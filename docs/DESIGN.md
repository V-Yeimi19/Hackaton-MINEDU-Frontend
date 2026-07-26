---
name: Liquid Institutional
colors:
  surface: '#f4fafc'
  surface-dim: '#d5dbdd'
  surface-bright: '#f4fafc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff5f6'
  surface-container: '#e9eff0'
  surface-container-high: '#e3e9eb'
  surface-container-highest: '#dde3e5'
  on-surface: '#161d1e'
  on-surface-variant: '#3c494c'
  inverse-surface: '#2b3133'
  inverse-on-surface: '#ecf2f3'
  outline: '#6c797c'
  outline-variant: '#bbc9cc'
  surface-tint: '#006876'
  primary: '#006876'
  on-primary: '#ffffff'
  primary-container: '#00bcd4'
  on-primary-container: '#004650'
  inverse-primary: '#44d8f1'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#ba1a20'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff8980'
  on-tertiary-container: '#85000d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a1efff'
  primary-fixed-dim: '#44d8f1'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e59'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb3ac'
  on-tertiary-fixed: '#410003'
  on-tertiary-fixed-variant: '#930010'
  background: '#f4fafc'
  on-background: '#161d1e'
  surface-variant: '#dde3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system balances the ethereal quality of glassmorphism with the grounded stability of national institutional aesthetics. Targeted at educational management, the UI must feel high-tech yet authoritative. The style utilizes **Glassmorphism** heavily for data containers and overlays, while employing a **Corporate / Modern** structure for navigation and information architecture.

The emotional response is one of clarity and precision. By layering deep acrylic blurs over soft neutral backgrounds, the interface achieves a sense of depth without sacrificing legibility or professional rigor.

## Colors
This design system utilizes a high-contrast national palette. 
- **Primary (Cyan):** Used for forward-moving actions, progress indicators, and active states. It represents innovation and positive momentum.
- **Secondary (Black):** Used for heavy structural elements like sidebars and primary navigation headers. It provides the "institutional weight" necessary for a professional environment.
- **Tertiary (Red):** Reserved for critical risk levels, emergency alerts, and specific brand accents. It must be used sparingly to maintain its impact.
- **Backgrounds:** Surfaces are kept in a soft, cool neutral (#F8FAFB) to act as a stable canvas for the translucent glass layers, preventing visual fatigue.

## Typography
**Inter** is the sole typeface, chosen for its exceptional legibility in data-dense educational environments. 
- **Hierarchy:** Use bold weights (700) for secondary-colored structural headers to ground the page. 
- **Body Text:** Maintain a neutral scale using standard weights. 
- **Labels:** Small caps or uppercase labels with increased letter spacing should be used for metadata and table headers to differentiate from interactive body content.

## Layout & Spacing
The system follows a **Fluid Grid** model based on an 8px spacing power-of-two scale. 
- **Desktop:** 12-column grid with 40px outer margins and 16px gutters. Main content areas reside in "Glass" containers that stretch based on screen width.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.
Content should feel airy; use generous internal padding (min 24px) within glass cards to ensure the backdrop-blur effect is visible and not cramped by text.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and subtle **Ambient Shadows**.
- **Main Containers:** Apply a `backdrop-blur: 40px` with a semi-transparent white fill. This creates a "deep acrylic" look.
- **Borders:** Every glass element must have a 1px solid border. Use a high-transparency white to simulate a physical light-catching edge.
- **Shadows:** Use extremely diffused, low-opacity shadows (e.g., `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08)`) to lift the glass cards off the neutral background without creating heavy dark spots.

## Shapes
The shape language is sophisticated and approachable. 
- **Standard Radius:** 16px (rounded-lg) is the default for cards and primary containers.
- **Interactive Elements:** Buttons and inputs should use 8px (rounded-md) to maintain a slightly more "precise" and professional feel compared to the softer container edges.

## Components
- **Buttons:** Primary buttons use a solid Cyan (#00BCD4) fill with white text. Secondary buttons should be transparent with a 1px Secondary (#1A1A1A) border.
- **Glass Cards:** The central component. Must include `backdrop-blur: 40px`, the 1px white border, and 16px rounded corners.
- **Sidebars:** Use a solid Secondary (#1A1A1A) background to provide a heavy vertical anchor for the UI. Icons and text within should be high-contrast white or light-grey.
- **Inputs:** Use a soft-grey background with a 1px border that turns Cyan on focus.
- **Progress Bars:** Utilize Cyan for standard completion and Red for "Risk" or "Overdue" status.
- **Chips/Badges:** Use low-opacity fills of Cyan or Red with highly saturated text of the same color for status labeling.
