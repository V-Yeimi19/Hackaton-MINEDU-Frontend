# ENDPOINTS.md — Contrato completo Backend ↔ Frontend

> Generado el 2026-07-26 leyendo directamente el código fuente del backend
> (`tokenizados_backend`, controllers + DTOs + `schema.prisma` de cada servicio)
> y cruzándolo con el cliente ya implementado en este repo
> (`lib/api/schemas/*.ts`, `lib/api/services/*.ts`). El backend es la fuente
> de verdad; todo lo de aquí está verificado contra su código real, no contra
> los docs del backend (`tokenizados_backend/docs/API.md` y `SERVICES.md`
> tienen secciones desactualizadas — no usarlos como referencia, este archivo
> los reemplaza para efectos de frontend).
>
> **El cliente HTTP para todo esto ya existe.** No reimplementes fetch a mano:
> importa `classroomApi`, `analyticsApi`, `aiApi`, `reportsApi`,
> `accessibilityApi`, `usersApi`, `authApi`, `storageApi`, `notificationsApi`,
> `dashboardApi` desde `@/lib/api` (ver `lib/api/index.ts`). Cada función ya valida la
> respuesta con Zod y tipa el retorno. Este documento describe qué hace cada
> una y qué espera el backend, para que puedas usarlas o extenderlas
> correctamente.

## Tabla de contenidos

1. [Convenciones globales](#1-convenciones-globales)
2. [Roles y autenticación](#2-roles-y-autenticación)
3. [Auth](#3-auth)
4. [Users](#4-users)
5. [Storage](#5-storage)
6. [Notifications](#6-notifications) + [WebSocket](#websocket)
7. [Classroom](#7-classroom)
8. [Analytics](#8-analytics)
9. [Reports](#9-reports)
10. [AI](#10-ai)
11. [Accessibility](#11-accessibility)
12. [Dashboard](#12-dashboard)
13. [Gotchas y reglas de ownership no obvias](#13-gotchas-y-reglas-de-ownership-no-obvias)
14. [Mapa cliente frontend → backend](#14-mapa-cliente-frontend--backend)

---

## 1. Convenciones globales

| Propiedad | Valor |
|---|---|
| Base URL | `NEXT_PUBLIC_GATEWAY_URL` (`lib/api/config.ts`), default `http://localhost:3000` |
| Todas las rutas de API pasan por | `${GATEWAY_URL}/api/<servicio>/...` (el Gateway hace strip del prefijo antes de llegar al servicio) |
| Content-Type request | `application/json`, excepto upload (`multipart/form-data`) |
| Content-Type response | `application/json`, excepto binarios (PDF/MP3) y redirects 302 |
| Auth header | `Authorization: Bearer <accessToken>` |
| Rate limit | 100 req/min por IP (Gateway, `express-rate-limit`), headers `RateLimit-*` |
| CORS | habilitado sin restricciones (`app.enableCors()` en el Gateway) |

### Formato de error

Todo error (400/401/403/404/409) responde:

```typescript
{
  statusCode: number;
  message: string | string[];   // string[] si falla la validación de un DTO (class-validator)
  error: string;                // "Bad Request", "Unauthorized", "Forbidden", "Not Found", ...
}
```

`lib/api/http.ts` (`apiFetch`) ya parsea esto y lo relanza como `ApiError` (`.statusCode`, `.message`, `.error`). Captúralo con `err instanceof ApiError`.

### ⚠️ Paginación — envelope real

Los endpoints paginados (Users, Storage, Notifications, y los de Analytics/Classroom con query `page`/`limit`) devuelven:

```typescript
{ items: T[]; total: number; page: number; limit: number }
```

**No** `{ data: [...] }`. Usa `paginated(schema)` de `lib/api/schemas/common.ts`.

### ⚠️ DELETE — nunca hay body ni 204

Ningún controlador del backend fija `@HttpCode(204)`. Todo endpoint `DELETE` (o cualquier método que retorne `Promise<void>`) responde **200 con body vacío**. `apiFetch` ya maneja esto (lee `res.text()` antes de intentar `JSON.parse`); el tipo de retorno de esas funciones es `void`, no `{ deleted: true }` — no asumas esa forma en ningún componente nuevo.

### Fechas

Todas las fechas viajan como **string ISO** en JSON (no hay serialización especial). Los DTOs de request que piden fecha (`date`, `weekStart`, `periodStart`, `birthDate`, etc.) aceptan cualquier string parseable por `new Date()` en el backend — usa `YYYY-MM-DD` o ISO completo.

---

## 2. Roles y autenticación

```typescript
type Role = "ADMIN" | "DIRECTIVO" | "DOCENTE" | "FAMILIAR";
```

No existen `ESTUDIANTE` ni `ESPECIALISTA`. El estudiante **no es un usuario que se loguea** — es un registro `Student` (en `classroom_db`) creado por su `FAMILIAR`.

| Rol | Quién es | Qué puede crear/ver |
|---|---|---|
| `ADMIN` | superusuario | todo, en todos los servicios |
| `DIRECTIVO` | director de una IE | crea `Institution`, invita `DOCENTE`s a su IE, ve reportes institucionales |
| `DOCENTE` | profesor de aula | crea `Classroom`/`Course` (con o sin IE), registra asistencia/notas/competencias, invita `FAMILIAR`es a su aula |
| `FAMILIAR` | padre/madre | registra `Student` (hijos), acepta invitaciones, ve datos de sus propios hijos |

### Flujo

```
POST /api/auth/register  { email, password, fullName, role }  →  { accessToken, user }
POST /api/auth/login     { email, password }                  →  { accessToken, user }
```

`user` aquí es **solo** `{ id, email, role }` (`AuthUser`, sin `fullName` ni `createdAt` — Auth no guarda el perfil completo, eso vive en Users). Guarda `accessToken` y mándalo como Bearer en todo lo demás.

### Sesión en este frontend

`lib/api/token.ts` + `token.server.ts`: cookies `ad_token` (JWT) y `ad_user` (`SessionUser = { id, email, fullName?, role }`, `fullName` opcional porque Auth no lo devuelve). Para obtener el perfil completo (`fullName`, `authUserId`, `createdAt`) usa `usersApi.getMe(token)` → `GET /api/users/me` (ver sección 4) — **no** `usersApi.getUser(sessionUser.id, token)`, porque `sessionUser.id` es el id de `AuthUser`, no el `id` propio del perfil en Users (son UUIDs distintos, `getUser` fallaría con 404 "Usuario no encontrado").

### Invalidación de sesión

`PATCH /api/auth/:authUserId/role` (solo `ADMIN`) cambia el rol de un usuario e invalida todos sus JWT ya emitidos — cualquier request posterior con el token viejo da 401 hasta que el usuario vuelva a hacer login.

---

## 3. Auth

**Base**: `/api/auth` — el único prefijo público del Gateway (no requiere JWT en `register`/`login`).
Cliente: `authApi` (`lib/api/services/auth.ts`), schemas en `lib/api/schemas/auth.ts`.

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/register` | público | `RegisterDto` | `AuthResponse` |
| POST | `/login` | público | `LoginDto` | `AuthResponse` |
| PATCH | `/:authUserId/role` | `ADMIN` | `{ role: Role }` | `AuthUser` |

```typescript
type RegisterDto = { email: string; password: string /* min 8 */; fullName: string; role: Role };
type LoginDto = { email: string; password: string };
type AuthUser = { id: string; email: string; role: Role };
type AuthResponse = { accessToken: string; user: AuthUser };
```

---

## 4. Users

**Base**: `/api/users`. Cliente: `usersApi` (`lib/api/services/users.ts`).

| Método | Ruta | Roles | Body/Query | Response |
|---|---|---|---|---|
| GET | `/` | `ADMIN`, `DIRECTIVO` | `?role=&page=&limit=` | `Paginated<User>` |
| GET | `/me` | cualquiera (JWT) | — | `User` — resuelve por `currentUser.sub`, **usar siempre este para "mi perfil"** |
| GET | `/:id` | self (por `authUserId`) o `ADMIN`/`DIRECTIVO` | — | `User` |
| PATCH | `/:id` | self o `ADMIN`/`DIRECTIVO` | `{ fullName? }` | `User` |
| DELETE | `/:id` | `ADMIN`, `DIRECTIVO` | — | `void` |

```typescript
type User = {
  id: string;          // id propio de Users, DISTINTO de authUserId
  authUserId: string;  // FK al AuthUser (esto es lo que trae el JWT como `sub`)
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
```

`GET /:id` y `PATCH /:id` comparan `currentUser.sub === user.authUserId` para el check de "self" — si le pasas el `id` incorrecto (el `authUserId`, en vez del `id` propio del perfil) da 404 antes de llegar al check de ownership. `GET /me` evita ese problema por completo.

---

## 5. Storage

**Base**: `/api/storage`, + MinIO. Cliente: `storageApi` (`lib/api/services/storage.ts`).

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/upload` | cualquiera (JWT) | `multipart/form-data`, campo `file` | `ApiFile` |
| GET | `/` | cualquiera (JWT) | `?page=&limit=` | `Paginated<ApiFile>` (solo archivos del usuario actual) |
| GET | `/:id` | owner o `ADMIN`/`DIRECTIVO` | — | `ApiFile` |
| GET | `/:id/download` | owner o `ADMIN`/`DIRECTIVO` | — | `302` → URL prefirmada de MinIO |
| DELETE | `/:id` | owner o `ADMIN`/`DIRECTIVO` | — | `void` |

```typescript
type ApiFile = {
  id: string; filename: string; originalName: string; mimeType: string;
  size: number; ownerId: string /* authUserId */; createdAt: string;
};
```

```typescript
const formData = new FormData();
formData.append("file", selectedFile);
const file = await storageApi.uploadFile(selectedFile, token); // ya arma el FormData
```

**Nota conocida (no arreglable desde frontend)**: la URL prefirmada del 302 usa el hostname interno de Docker (`minio:9000`), que no resuelve desde el navegador si se accede desde fuera de la red Docker del VPS. `storageApi.downloadFileUrl(id)` solo devuelve el path `/api/storage/:id/download` para navegación directa (`window.open(...)`) — si falla, es un bug de backend pendiente, no del cliente.

---

## 6. Notifications

**Base**: `/api/notifications`. Cliente: `notificationsApi` (`lib/api/services/notifications.ts`).

| Método | Ruta | Roles | Query | Response |
|---|---|---|---|---|
| GET | `/` | cualquiera (JWT) | `?page=&limit=` | `Paginated<Notification>` |
| PATCH | `/:id/read` | cualquiera (JWT) | — | `Notification` |

```typescript
type Notification = {
  id: string; userId: string /* authUserId */; type: string; title: string; message: string;
  payload?: Record<string, unknown>; read: boolean; createdAt: string;
};
```

### WebSocket

```typescript
import { io } from "socket.io-client";
const socket = io(`${WS_URL}/notifications`, {  // WS_URL de lib/api/config.ts, mismo host que el Gateway
  path: "/ws/notifications",
  auth: { token: accessToken },
});
socket.on("notification", (n: Notification) => { /* toast, badge, etc. */ });
```

Pasa por el Gateway (proxy de `upgrade` hacia Notifications); si el JWT es inválido, la conexión se rechaza. Llega un evento `notification` cuando: se registra el usuario (bienvenida), se acepta una invitación creada por él, o cualquier otro evento futuro que el backend encole vía BullMQ.

---

## 7. Classroom

**Base**: `/api/classroom`. El servicio más grande — 9 sub-recursos. Cliente: `classroomApi` (`lib/api/services/classroom.ts`), schemas en `lib/api/schemas/classroom.ts`. Todos los objetos `*DetailSchema`/`*WithStudentSchema` reflejan exactamente qué `include` hace cada método de servicio en el backend — no asumas campos anidados que no estén en la tabla.

### 7a. Institutions (`institutions`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/institutions` | `DIRECTIVO` | `CreateInstitutionDto` | `Institution` |
| GET | `/institutions` | `DIRECTIVO`, `ADMIN` | — | `Institution[]` (`ADMIN`: todas; `DIRECTIVO`: solo las suyas por `directorId`) |
| GET | `/institutions/:id` | `DIRECTIVO`, `ADMIN` | — | `InstitutionDetail` (con `classrooms[]` y `teachers[]`) |
| PATCH | `/institutions/:id` | `DIRECTIVO`, `ADMIN` | `Partial<CreateInstitutionDto>` | `Institution` |
| DELETE | `/institutions/:id` | `DIRECTIVO`, `ADMIN` | — | `void` |

```typescript
type CreateInstitutionDto = { name: string; code?: string; address?: string };
type Institution = { id: string; name: string; code?: string | null; address?: string | null; directorId: string; createdAt: string };
type InstitutionDetail = Institution & { classrooms: Classroom[]; teachers: InstitutionTeacher[] };
type InstitutionTeacher = { id: string; institutionId: string; teacherId: string; joinedAt: string };
```

### 7b. Classrooms (`classrooms`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/classrooms` | `DOCENTE`, `ADMIN` | `CreateClassroomDto` | `Classroom` |
| GET | `/classrooms` | todos | — | `Classroom[]` (filtrado por ownership, ver abajo) |
| GET | `/classrooms/:id` | todos | — | `ClassroomDetail` (con `courses[]`, **sin** `enrollments`) |
| PATCH | `/classrooms/:id` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `UpdateClassroomDto` | `Classroom` |
| DELETE | `/classrooms/:id` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `void` |
| GET | `/classrooms/:id/enrollments` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `EnrollmentWithStudent[]` |
| DELETE | `/classrooms/:id/enrollments/:enrollmentId` | `DOCENTE`, `ADMIN` | — | `void` |

```typescript
type CreateClassroomDto = { name: string; gradeLevel: string; institutionId?: string /* omitir = aula independiente */ };
type UpdateClassroomDto = { name?: string; gradeLevel?: string };
type Classroom = { id: string; name: string; gradeLevel: string; institutionId?: string | null; teacherId: string; createdAt: string };
type ClassroomDetail = Classroom & { courses: Course[] };
type Enrollment = { id: string; classroomId: string; studentId: string; familiarId: string; createdAt: string };
type EnrollmentWithStudent = Enrollment & { student: { id: string; fullName: string; birthDate?: string | null } };
```

`GET /classrooms` filtra por rol: `ADMIN` ve todas, `DIRECTIVO` solo las de sus IEs, `DOCENTE` solo las propias (`teacherId`), `FAMILIAR` solo las que tienen un hijo matriculado. El roster de estudiantes de un aula **siempre** se obtiene con el endpoint separado `enrollments`, nunca viene embebido en `GET /classrooms/:id`.

### 7c. Courses (`courses`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/courses` | `DOCENTE`, `ADMIN` | `CreateCourseDto` | `Course` |
| GET | `/courses` | todos | — | `Course[]` (`FAMILIAR`: solo de aulas con hijos matriculados) |
| GET | `/courses/:id` | todos | — | `Course & { classroom: Classroom }` |
| PATCH | `/courses/:id` | `DOCENTE`, `ADMIN` | `{ name? }` | `Course` |
| DELETE | `/courses/:id` | `DOCENTE`, `ADMIN` | — | `void` |

```typescript
type CreateCourseDto = { name: string; classroomId: string };
type Course = { id: string; name: string; classroomId: string; createdAt: string };
```

### 7d. Grades (`grades`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/grades` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `CreateGradeDto` | `Grade` |
| GET | `/grades/classroom/:classroomId` | todos | — | `Grade[]` |
| GET | `/grades/student/:studentId` | todos | — | `Grade[]` |
| PATCH | `/grades/:id` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `UpdateGradeDto` | `Grade` |
| DELETE | `/grades/:id` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `void` |

```typescript
type CreateGradeDto = { studentId: string; courseId: string; evaluation: string; score: number /* 0-20 */ };
type UpdateGradeDto = Partial<Pick<CreateGradeDto, "evaluation" | "score">>;
type Grade = { id: string; studentId: string; courseId: string; course: Course; evaluation: string; score: number; date: string };
```

### 7e. Competencies (`competencies`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/competencies` | `DOCENTE` | `CreateCompetencyDto` | `Competency` |
| GET | `/competencies` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `Competency[]` |
| GET | `/competencies/:id` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `Competency` |
| GET | `/competencies/student/:studentId` | todos | — | `StudentCompetency[]` |
| POST | `/competencies/evaluate` | `DOCENTE`, `ADMIN` | `EvaluateCompetencyDto` | `StudentCompetency` |

```typescript
type CreateCompetencyDto = { name: string; area: string };
type Competency = { id: string; name: string; area: string };
type CompetencyLevel = "BASICO" | "INTERMEDIO" | "AVANZADO" | "LOGRADO";
type EvaluateCompetencyDto = { competencyId: string; studentId: string; courseId: string; level: CompetencyLevel };
type StudentCompetency = { id: string; studentId: string; courseId: string; competencyId: string; competency: Competency; level: CompetencyLevel; date: string };
```

### 7f. Attendance (`attendance`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/attendance` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `CreateAttendanceDto` (batch) | `Attendance[]` |
| PATCH | `/attendance/:id` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `{ status }` | `Attendance` |
| GET | `/attendance/classroom/:classroomId` | todos | — | `Attendance[]` |
| GET | `/attendance/student/:studentId` | todos | — | `Attendance[]` |

```typescript
type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
type CreateAttendanceDto = { classroomId: string; date: string; records: Array<{ studentId: string; status: AttendanceStatus }> };
// Rechaza con 400 si algún studentId no está matriculado en ese classroomId.
type Attendance = { id: string; studentId: string; classroomId: string; date: string; status: AttendanceStatus; createdAt: string };
```

### 7g. Support needs (`support-needs`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/support-needs` | `DOCENTE`, `ADMIN`, `FAMILIAR` | `CreateSupportNeedDto` | `StudentSupportNeed` |
| GET | `/support-needs/student/:studentId` | todos | — | `StudentSupportNeed[]` |
| PATCH | `/support-needs/:id` | `DOCENTE`, `ADMIN`, `FAMILIAR` | `UpdateSupportNeedDto` | `StudentSupportNeed` |
| DELETE | `/support-needs/:id` | `DOCENTE`, `ADMIN`, `FAMILIAR` | — | `void` |

```typescript
type SupportNeedType = "DISCAPACIDAD_VISUAL" | "DISCAPACIDAD_AUDITIVA" | "DISCAPACIDAD_INTELECTUAL"
  | "DISCAPACIDAD_MOTORA" | "TRASTORNO_ESPECTRO_AUTISTA" | "DIFICULTAD_APRENDIZAJE"
  | "TDAH" | "MULTIDISCAPACIDAD" | "OTRO";
type SupportLevel = "LEVE" | "MODERADO" | "SIGNIFICATIVO";
type CreateSupportNeedDto = { studentId: string; type: SupportNeedType; level?: SupportLevel /* default MODERADO */; description?: string };
type StudentSupportNeed = { id: string; studentId: string; type: SupportNeedType; level: SupportLevel; description?: string | null; registeredBy: string; createdAt: string };
```

### 7h. Students (`students`)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/students` | `FAMILIAR` | `CreateStudentDto` | `Student` |
| GET | `/students` | `FAMILIAR` | — | `Student[]` (hijos propios) |
| GET | `/students/:id` | `FAMILIAR`, `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `Student` |
| PATCH | `/students/:id` | `FAMILIAR` | `UpdateStudentDto` | `Student` |
| DELETE | `/students/:id` | `FAMILIAR` | — | `void` |

```typescript
type CreateStudentDto = {
  fullName: string; birthDate?: string;
  supportNeeds?: Array<{ type: SupportNeedType; level?: SupportLevel; description?: string }>;
};
type Student = {
  id: string; fullName: string; birthDate?: string | null; familiarId: string;
  supportNeeds: StudentSupportNeed[]; createdAt: string;
  // OJO: nunca incluye `enrollments` — para saber en qué aulas está, usa
  // classroomApi.classrooms.enrollments(classroomId) desde el lado del aula,
  // no hay un "mis aulas" por estudiante expuesto todavía.
};
```

`Student.id` es lo que se usa como `studentId` en **todos** los demás servicios (grades, attendance, competencies, indicators, recommendations, digital-twin) — nunca el `authUserId` del familiar.

### 7i. Invitations (`invitations`)

**No existe un `POST /invitations` genérico.** Hay dos rutas separadas, sin campo `type` en el body (la ruta ya lo determina):

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/invitations/teacher` | `DIRECTIVO` | `{ email, institutionId }` | `Invitation` |
| POST | `/invitations/family` | `DOCENTE` | `{ email, classroomId }` | `Invitation` |
| POST | `/invitations/accept/teacher` | `DOCENTE` | `{ token }` | `{ message: string }` — **no** un objeto `Invitation` |
| POST | `/invitations/accept/family` | `FAMILIAR` | `{ token, studentId }` | `Enrollment` (objeto crudo) |
| GET | `/invitations/token/:token` | **público, sin JWT** | — | `Invitation` |
| GET | `/invitations/pending/institution/:institutionId` | `DIRECTIVO` | — | `Invitation[]` |
| GET | `/invitations/pending/classroom/:classroomId` | `DOCENTE` | — | `Invitation[]` |
| GET | `/invitations` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `Invitation[]` (creadas por el usuario) |
| PATCH | `/invitations/:id/revoke` | cualquiera (JWT, sin restricción de rol — ownership se verifica dentro del servicio) | — | `Invitation` |

```typescript
type InvitationType = "TEACHER_TO_INSTITUTION" | "FAMILY_TO_CLASSROOM";
type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
type Invitation = {
  id: string; token: string; type: InvitationType; status: InvitationStatus; email: string;
  institutionId?: string | null; classroomId?: string | null; createdBy: string;
  usedBy?: string | null; usedAt?: string | null; expiresAt?: string | null; createdAt: string;
};
```

`classroomApi.invitations.create(dto, token)` en el cliente frontend ya traduce un DTO combinado `{ email, type, institutionId?, classroomId? }` a la ruta correcta según `dto.type` — es la única forma "genérica" y vive solo en el frontend, el backend no la tiene.

**El `status` es la fuente de verdad de si algo realmente pasó.** Crear una invitación y enviar el link **no matricula a nadie** — el familiar/docente tiene que abrir `/invitations/[token]`, autenticarse, y explícitamente aceptar (`accept/teacher` o `accept/family`) para que se cree el `InstitutionTeacher`/`Enrollment`. Si un roster aparece vacío, lo primero a revisar es si la invitación sigue en `PENDING`.

### 7j. Internal (`internal`)

Todos protegidos con `x-internal-key` (`InternalKeyGuard`) — **no llamar desde frontend**, son para Reports/AI/Analytics/Accessibility: `GET /internal/classrooms`, `/internal/classroom/:id`, `/internal/classroom/:id/attendances`, `/internal/classroom/:id/grades`, `/internal/classroom/:id/enrollments`, `/internal/courses`, `/internal/support-needs/student/:studentId`, `/internal/students/familiar/:familiarId`.

---

## 8. Analytics

**Base**: `/api/analytics`. Solo lectura desde HTTP público — se recalcula reactivamente por eventos de Classroom. Cliente: `analyticsApi` (`indicators`, `digitalTwin`, `recommendations` en `lib/api/services/analytics.ts`).

### 8a. Indicators (`indicators`)

| Método | Ruta | Roles | Query | Response |
|---|---|---|---|---|
| GET | `/indicators/classroom/:classroomId` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `?page=&limit=` | `Paginated<StudentIndicator>` |
| GET | `/indicators/student/:studentId/classroom/:classroomId` | todos | — | `StudentIndicator` |
| GET | `/indicators/student/:studentId` | todos | `?page=&limit=` | `Paginated<StudentIndicator>` |

```typescript
type StudentIndicator = {
  id: string; studentId: string; classroomId: string;
  attendanceRate: number; avgGrade: number; gradeCount: number;
  competencyScore: number; competencyCount: number; updatedAt: string; // no `lastCalculatedAt`
};
```

### 8b. Digital twin (`digital-twin`)

| Método | Ruta | Roles | Response |
|---|---|---|---|
| GET | `/digital-twin/classroom/:classroomId` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `ClassroomTwinResponse` |
| GET | `/digital-twin/classroom/:classroomId/student/:studentId` | todos (incl. `FAMILIAR`) | `StudentTwinSnapshot` |

```typescript
type RiskLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH"; // valores en inglés, NO "BAJO/MEDIO/ALTO/CRITICO"
type RecommendationStatus = "PENDING" | "SENT" | "DISMISSED"; // default PENDING, no "ACTIVE"
type TwinRecommendation = { id: string; type: string; message: string; source: string; status: RecommendationStatus };
type StudentTwinSnapshot = {
  studentId: string; attendanceRate: number; avgGrade: number; participationScore: number;
  competencyScore: number; riskLevel: RiskLevel; riskReasons: string[];
  recommendations: TwinRecommendation[]; // array de OBJETOS, no strings
  lastUpdated: string;
};
type ClassroomTwinResponse = { classroomId: string; studentsCount: number; atRiskCount: number; students: StudentTwinSnapshot[] };
```

### 8c. Recommendations (`recommendations`)

| Método | Ruta | Roles | Query | Response |
|---|---|---|---|---|
| GET | `/recommendations/classroom/:classroomId` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | `?page=&limit=` | `Paginated<Recommendation>` |
| GET | `/recommendations/student/:studentId` | todos | `?page=&limit=` | `Paginated<Recommendation>` |
| PATCH | `/recommendations/:id/dismiss` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `Recommendation` |

```typescript
type Recommendation = {
  id: string; studentId: string; classroomId: string; type: string; message: string;
  source: string; status: RecommendationStatus; createdAt: string;
};
```

**Ownership `FAMILIAR`**: en todos los endpoints "por estudiante", Analytics verifica que el estudiante sea hijo del `FAMILIAR` autenticado llamando internamente a Classroom (`/internal/students/familiar/:familiarId`) — no hay nada especial que el frontend deba hacer, solo saber que un 403 aquí significa "ese estudiante no es tuyo", no un bug.

---

## 9. Reports

**Base**: `/api/reports`. Reportes **institucionales agregados multi-aula**, distinto del reporte semanal de AI (ver comparación en sección 10). Cliente: `reportsApi` (`lib/api/services/reports.ts`).

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/reports/generate` | `ADMIN`, `DIRECTIVO` | `GenerateInstitutionalReportDto` | `GenerateReportResponse` (JSON) |
| POST | `/reports/generate/pdf` | `ADMIN`, `DIRECTIVO` | igual | PDF binario |
| POST | `/reports/generate/classroom` | `ADMIN`, `DIRECTIVO`, `DOCENTE` | `GenerateClassroomReportDto` | PDF binario (no persiste) |
| POST | `/reports/generate/student` | `ADMIN`, `DIRECTIVO`, `DOCENTE` | `GenerateStudentReportDto` | PDF binario (no persiste) |
| GET | `/reports` | `ADMIN`, `DIRECTIVO` | `?gradeLevel=&courseId=` | `Report[]` |
| GET | `/reports/:id` | `ADMIN`, `DIRECTIVO` | — | `Report` |
| GET | `/reports/:id/download` | `ADMIN`, `DIRECTIVO` | — | `302` → CSV en Storage |
| GET | `/reports/:id/download/pdf` | `ADMIN`, `DIRECTIVO` | — | `302` → PDF en Storage |

```typescript
type GenerateInstitutionalReportDto = { gradeLevel?: string; courseId?: string; periodStart: string; periodEnd: string };
type GenerateClassroomReportDto = { classroomId: string; periodStart: string; periodEnd: string };
type GenerateStudentReportDto = { studentId: string; classroomId: string; periodStart: string; periodEnd: string };

// Modelo InstitutionReport real — NO tiene `title`/`type`/`csvFileId`.
type Report = {
  id: string; gradeLevel?: string | null; courseId?: string | null;
  periodStart: string; periodEnd: string; classroomCount: number; studentCount: number;
  avgAttendanceRate: number; avgGrade: number; riskCounts: Record<string, number>;
  fileId?: string | null /* CSV en Storage */; pdfFileId?: string | null; generatedBy: string; createdAt: string;
};

// POST /generate responde ESTO, no { report, csvFileId, pdfFileId }:
type GenerateReportResponse = { report: Report; classroomSummaries: unknown[] };
```

Para los binarios (`/generate/pdf`, `/generate/classroom`, `/generate/student`) usa las funciones del cliente que ya piden `raw: true` (devuelven un `Response` crudo, no lo intentes parsear como JSON): `reportsApi.generateInstitutionalReportPdf/generateClassroomReportPdf/generateStudentReportPdf`.

---

## 10. AI

**Base**: `/api/ai`. Reporte PDF semanal **de una sola aula** (no agregado — ver comparación abajo). Cliente: `aiApi` (`lib/api/services/ai.ts`).

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/ai/reports/generate` | `ADMIN`, `DIRECTIVO`, `DOCENTE` | `GenerateAiReportDto` | `GenerateAiReportResponse` (JSON) |
| POST | `/ai/reports/generate/pdf` | `ADMIN`, `DIRECTIVO`, `DOCENTE` | igual | PDF binario |
| GET | `/ai/reports` | `ADMIN`, `DIRECTIVO`, `DOCENTE` | `?classroomId=&courseId=` | `AiReport[]` |
| GET | `/ai/reports/:id` | `ADMIN`, `DIRECTIVO`, `DOCENTE` | — | `AiReport` |

```typescript
type GenerateAiReportDto = { classroomId: string; weekStart: string; weekEnd: string };

// Modelo Report real (ai_db) — NO tiene `title`/`periodStart`/`periodEnd`/`fileId`.
type AiReport = {
  id: string; classroomId: string; courseId: string; teacherId: string;
  courseName: string; className: string; weekStart: string; weekEnd: string;
  studentCount: number; pdfFileId?: string | null; status: string; createdAt: string;
};
type AiAnomaly = { studentId: string; message: string }; // array de objetos, no strings sueltos
type GenerateAiReportResponse = {
  report: AiReport;
  attendanceSummary: Record<string, unknown>;
  gradeSummary: Record<string, unknown>;
  anomalies: AiAnomaly[];
};
```

### AI vs Reports — no confundir

| | AI (`/api/ai/reports`) | Reports (`/api/reports`) |
|---|---|---|
| Alcance | 1 aula | N aulas (institucional), o 1 aula/1 estudiante on-demand |
| Quién | `DOCENTE`/`ADMIN`/`DIRECTIVO` | Institucional: `ADMIN`/`DIRECTIVO`. Aula/estudiante: + `DOCENTE` |
| Salida | PDF | Institucional: CSV+PDF persistido. Aula/estudiante: PDF on-demand sin persistir |
| Caso de uso | "reporte semanal de mi aula" | "estado del colegio" / "detalle de aula o estudiante" |

---

## 11. Accessibility

**Base**: `/api/accessibility`. Pipeline: OCR → adaptación de texto (Groq) → audio (ElevenLabs) → subtítulos SRT → pictogramas ARASAAC → (opcional) ficha didáctica PDF. Cliente: `accessibilityApi` (`lib/api/services/accessibility.ts`).

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| POST | `/accessibility/process` | `ADMIN`, `DOCENTE` | `ProcessContentDto` | `ProcessContentResponse` (JSON) |
| POST | `/accessibility/process/audio` | `ADMIN`, `DOCENTE` | igual | MP3 binario |
| POST | `/accessibility/process/worksheet` | `ADMIN`, `DOCENTE` | `GenerateWorksheetDto` | `GenerateWorksheetResponse` |
| GET | `/accessibility/jobs` | `ADMIN`, `DOCENTE`, `DIRECTIVO` | — | `AccessibilityJob[]` |
| GET | `/accessibility/jobs/:id` | `ADMIN`, `DOCENTE`, `DIRECTIVO` | — | `AccessibilityJob` |

```typescript
type ProcessContentDto = { fileId: string /* de Storage */; fileName: string; fileType: string /* MIME */; adaptationLevel: SupportLevel };
type GenerateWorksheetDto = ProcessContentDto & { studentId?: string /* personaliza según StudentSupportNeed, fail-open si Classroom no responde */ };

type AccessibilityJobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
type PictogramEntry = { keyword: string; arasaacId: number; imageUrl: string };
type WorksheetExercise = { type: "opcion_multiple" | "verdadero_falso" | "completar" | "texto"; prompt: string; options?: string[]; answer?: string };
type WorksheetContent = { title: string; instructions: string; exercises: WorksheetExercise[] };

type AccessibilityJob = {
  id: string; fileId: string; fileName: string; fileType: string; status: AccessibilityJobStatus;
  originalText?: string | null; adaptedText?: string | null; summaryText?: string | null;
  audioFileId?: string | null; subtitlesFileId?: string | null;
  pictogramData?: PictogramEntry[] | null; // ARRAY, no objeto/record
  adaptationLevel: SupportLevel;
  worksheetFileId?: string | null; worksheetContent?: WorksheetContent | null;
  error?: string | null; createdAt: string;
};

type ProcessContentResponse = { job: AccessibilityJob; audioSize: number };
type GenerateWorksheetResponse = { job: AccessibilityJob; worksheetSize: number };
```

Flujo típico: `storageApi.uploadFile(file, token)` → tomar `file.id` → `accessibilityApi.generateWorksheet({ fileId, fileName, fileType, adaptationLevel, studentId? }, token)` → el `job.worksheetFileId` resultante es otro archivo de Storage (el PDF final), descargable con `storageApi.downloadFileUrl(job.worksheetFileId)`.

---

## 12. Dashboard

**Base**: `/api/dashboard`. Servicio nuevo (puerto interno 3010) que **agrega** datos de Classroom + Analytics — no duplica nada de lo anterior. No expone `/internal/*` propio (es solo consumidor). Cliente: `dashboardApi` (`lib/api/services/dashboard.ts`), schemas en `lib/api/schemas/dashboard.ts`.

Este servicio existe porque ningún otro microservicio tiene un rollup a nivel institución/nacional, series históricas, avance curricular, ni créditos/incidencias — ver el análisis de gaps que motivó su creación. Los cálculos de resumen (`national-summary`, `institution/:id/summary`) hacen fan-out sobre `/internal/*` de Classroom/Analytics en cada llamada (no hay ningún endpoint pre-agregado en el resto del sistema salvo `InstitutionReport`, que no tiene `institutionId` y por eso no sirve para esto) — se cachean 5 min en Redis. A escala de hackathon es aceptable; a escala real debería ser event-driven como `StudentIndicator`.

### 12a. Resúmenes agregados

| Método | Ruta | Roles | Response |
|---|---|---|---|
| GET | `/dashboard/national-summary` | `ADMIN` | `NationalSummary` |
| GET | `/dashboard/institution/:id/summary` | `DIRECTIVO` (solo la suya), `ADMIN` (cualquiera) | `InstitutionSummary` |
| GET | `/dashboard/trends?scope=&scopeId=&metric=&months=` | `ADMIN`, `DIRECTIVO` | `MetricSnapshot[]` |

```typescript
type NationalSummary = {
  totalStudents: number; activeInstitutions: number; totalClassrooms: number;
  riskCounts: Record<string, number>; calculatedAt: string;
};
type InstitutionSummary = {
  institutionId: string; classroomCount: number; studentCount: number;
  avgAttendanceRate: number; avgGrade: number; riskCounts: Record<string, number>; calculatedAt: string;
};
type TrendScope = "NATIONAL" | "INSTITUTION";
type TrendMetric = "avgAttendanceRate" | "avgGrade" | "totalStudents" | "activeInstitutions";
type MetricSnapshot = { id: string; scope: TrendScope; scopeId: string | null; metric: string; value: number; capturedAt: string };
```

`trends` requiere `scopeId` cuando `scope=INSTITUTION` (no aplica para `NATIONAL`). Las series se llenan con un cron diario (`ScheduleService`, medianoche) — recién creado el servicio, esperar unos días de historia antes de graficar tendencias útiles.

### 12b. Progreso curricular (dominio nuevo, no existe en Classroom)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| GET | `/dashboard/course/:courseId/progress` | todos | — | `CourseProgress` |
| PATCH | `/dashboard/course/:courseId/progress` | `DOCENTE`, `ADMIN` | `{ totalUnits, completedUnits }` | `CourseProgress` |
| GET | `/dashboard/classroom/:classroomId/progress` | `DOCENTE`, `ADMIN`, `DIRECTIVO` | — | `ClassroomProgress` (promedio de sus cursos) |

```typescript
type CourseProgress = { courseId: string; totalUnits: number; completedUnits: number; percentage: number };
type ClassroomProgress = { classroomId: string; courseCount: number; totalUnits: number; completedUnits: number; percentage: number };
```

El docente actualiza `totalUnits`/`completedUnits` a mano (no hay un catálogo de unidades/temas — es un MVP de avance manual, no un sílabo estructurado).

### 12c. Créditos e incidencias del estudiante (dominio nuevo, no existe en Classroom)

| Método | Ruta | Roles | Body | Response |
|---|---|---|---|---|
| GET | `/dashboard/student/:studentId/extras` | todos (ownership `FAMILIAR` vía Classroom, igual que Analytics) | — | `StudentExtras` |
| POST | `/dashboard/student/:studentId/incidents` | `DOCENTE`, `ADMIN` | `CreateIncidentDto` | `StudentIncident` |

```typescript
type IncidentSeverity = "LEVE" | "MODERADO" | "GRAVE";
type StudentIncident = { id: string; studentId: string; type: string; description?: string | null; severity: IncidentSeverity; registeredBy: string; createdAt: string };
type StudentExtras = { studentId: string; creditsEarned: number; incidents: StudentIncident[] };
type CreateIncidentDto = { type: string; description?: string; severity?: IncidentSeverity };
```

`creditsEarned` **no se persiste** — se deriva en caliente contando `StudentCompetency` con `level = "LOGRADO"` del estudiante (vía el nuevo endpoint interno `internal/competencies/student/:studentId` que se agregó a Classroom para esto). Las incidencias sí se persisten en la DB propia de Dashboard (`dashboard_db`).

---

## 13. Gotchas y reglas de ownership no obvias

Estas son las causas reales de bugs ya encontrados en este repo — tenlas en cuenta antes de asumir que algo "no funciona":

1. **Aceptar una invitación es un paso explícito.** Crear la invitación (`invitations/teacher` o `invitations/family`) solo genera el link y el email; nada se matricula hasta que el invitado abre `/invitations/[token]` autenticado y confirma. Si un roster/lista aparece vacía, revisa `Invitation.status` antes de asumir un bug de código.
2. **`Student.id` ≠ `authUserId` del familiar.** `studentId` en grades/attendance/competencies/indicators/recommendations siempre es el id del registro `Student`, nunca un id de usuario.
3. **`User.id` (Users) ≠ `AuthUser.id` (JWT `sub`).** Son UUIDs distintos con una relación 1:1 vía `authUserId`. Para "mi perfil" usa siempre `GET /api/users/me`, nunca `GET /api/users/:id` con el id del JWT.
4. **DELETE nunca devuelve `{ deleted: true }`** — ver sección 1. Cualquier código que intente leer esa forma está mal.
5. **Los enums de riesgo/recomendación de Analytics están en inglés** (`NONE|LOW|MEDIUM|HIGH`, `PENDING|SENT|DISMISSED`), no en español ni con los valores que "sonarían lógicos" (`ACTIVE`, `CRITICO`, etc.).
6. **`GET /classrooms/:id` no incluye `enrollments`.** El roster de un aula es siempre `GET /classrooms/:id/enrollments`, un endpoint aparte.
7. **Descarga de Storage (302) puede fallar fuera de la red Docker del VPS** — el hostname de la URL prefirmada es interno (`minio:9000`). Bug de backend conocido, no un problema del cliente.
8. **`FAMILIAR` puede ver datos de un hijo antes de que esté matriculado en ningún aula.** El ownership de grades/attendance/competencies/support-needs para `FAMILIAR` se valida contra `Student.familiarId`, no contra la existencia de un `Enrollment` — un hijo recién registrado sin aula debe devolver listas vacías (`200 []`), no `403`.
9. **`Course.classroomId`, no `Classroom.courseId`.** La relación es Course → pertenece a → Classroom (invertida respecto a lo que muchos esperarían).
10. **Invitaciones no tienen un endpoint combinado.** Aunque el DTO interno del frontend (`CreateInvitationDto`) tenga un campo `type`, el backend siempre recibe la petición en `invitations/teacher` o `invitations/family` sin ese campo — usa `classroomApi.invitations.create()`, que ya hace el switch.
11. **Dashboard cachea 5 min en Redis y solo snapshotea tendencias una vez al día.** `national-summary`/`institution/:id/summary` pueden tardar unos segundos la primera vez que se piden (fan-out real sobre Classroom/Analytics) y quedar "desactualizados" hasta 5 min tras un cambio; `trends` no tendrá datos útiles hasta que el cron diario acumule varios días.

---

## 14. Mapa cliente frontend → backend

Todo el consumo de la API pasa por `lib/api/`:

| Archivo | Qué expone |
|---|---|
| `lib/api/http.ts` | `apiFetch<T>()` — fetch + Bearer + Zod parse + manejo de error/DELETE-vacío. `ApiError` para capturar fallos. |
| `lib/api/config.ts` | `GATEWAY_URL`, `WS_URL` (de `NEXT_PUBLIC_*` env vars). |
| `lib/api/token.ts` / `token.server.ts` | Cookies de sesión (`SessionUser`, `getClientToken`/`getServerToken`). |
| `lib/api/schemas/*.ts` | Un Zod schema + tipo TS por modelo/DTO, por servicio backend. Ya verificados contra Prisma/DTOs reales — si necesitas un tipo, ya existe aquí, no lo redefinas. |
| `lib/api/services/*.ts` | Funciones que llaman a cada endpoint (agrupadas en objetos como `classroomApi.grades.create(...)` o sueltas como `authApi.login(...)`). |
| `lib/api/index.ts` | Re-exporta todo como `authApi`, `usersApi`, `storageApi`, `notificationsApi`, `classroomApi`, `analyticsApi`, `reportsApi`, `aiApi`, `accessibilityApi`, `dashboardApi`. **Importa siempre desde aquí.** |

Regla práctica para un agente que va a construir una pantalla nueva: busca primero si la función ya existe en `lib/api/services/<dominio>.ts` (probablemente sí) antes de escribir un `fetch` nuevo o de inventar una forma de respuesta — este documento y esos archivos deben coincidir siempre; si no coinciden, el backend (código fuente real, no `tokenizados_backend/docs/`) es quien tiene la razón.
