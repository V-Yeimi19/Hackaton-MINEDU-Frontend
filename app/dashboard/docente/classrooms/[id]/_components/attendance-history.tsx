"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldError, Select } from "@/components/ui/form";
import { classroomApi } from "@/lib/api";
import { getClientToken } from "@/lib/api/token";
import type { Attendance, AttendanceStatus, EnrollmentWithStudent } from "@/lib/api/schemas/classroom";

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "EXCUSED"];

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  PRESENT: "Presente",
  ABSENT: "Ausente",
  LATE: "Tardanza",
  EXCUSED: "Justificado",
};

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  PRESENT: "bg-primary/20 text-primary",
  ABSENT: "bg-error/20 text-error",
  LATE: "bg-tertiary/20 text-tertiary",
  EXCUSED: "bg-surface-container-high text-on-surface-variant",
};

export function AttendanceHistory({
  classroomId,
  roster,
}: {
  classroomId: string;
  roster: EnrollmentWithStudent[];
}) {
  const router = useRouter();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [updatingId, setUpdatingId] = useState<string>();

  const studentName = (studentId: string) =>
    roster.find((r) => r.studentId === studentId)?.student.fullName ?? studentId;

  useEffect(() => {
    const token = getClientToken();
    if (!token) return;
    classroomApi.attendance
      .byClassroom(classroomId, token)
      .then(setRecords)
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar asistencia"))
      .finally(() => setLoading(false));
  }, [classroomId]);

  async function handleStatusChange(id: string, status: AttendanceStatus) {
    const token = getClientToken();
    if (!token) return;
    setUpdatingId(id);
    try {
      await classroomApi.attendance.update(id, { status }, token);
      setRecords((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar");
    } finally {
      setUpdatingId(undefined);
    }
  }

  if (loading) {
    return <p className="text-body-md text-on-surface-variant">Cargando asistencia...</p>;
  }

  if (records.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        No hay registros de asistencia aún.
      </p>
    );
  }

  const grouped = records.reduce<Record<string, Attendance[]>>((acc, record) => {
    (acc[record.date] ??= []).push(record);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col gap-4">
      <FieldError message={error} />
      {sortedDates.map((date) => (
        <div key={date} className="flex flex-col gap-2">
          <h4 className="text-label-md uppercase tracking-wide text-on-surface-variant">
            {date}
          </h4>
          <ul className="flex flex-col gap-1.5">
            {grouped[date].map((record) => (
              <li key={record.id} className="flex items-center justify-between gap-4">
                <span className="text-body-md text-on-surface">
                  {studentName(record.studentId)}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-label-md ${STATUS_COLOR[record.status]}`}
                  >
                    {STATUS_LABEL[record.status]}
                  </span>
                  <Select
                    className="w-32"
                    value={record.status}
                    disabled={updatingId === record.id}
                    onChange={(e) =>
                      handleStatusChange(record.id, e.target.value as AttendanceStatus)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </Select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
