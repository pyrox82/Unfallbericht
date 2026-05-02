# Active Context: Next.js Starter Template

## Current State

**App Status**: ✅ Europäischer Unfallbericht (European Accident Report) app fully implemented

A complete multi-tab accident report form app with optional bilingual support. Users can fill in all accident details and generate a downloadable PDF in German only, German/English, or German/French.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Europäischer Unfallbericht form app
  - [x] Multi-tab UI: Unfalldaten, Fahrzeug A, Fahrzeug B, Skizze, Fotos, Unterschrift
  - [x] All form fields (date, time, names, addresses, insurance, maneuvers)
  - [x] Freehand canvas sketch with pen/eraser/color tools
  - [x] Photo upload (drag & drop, multiple files, categories)
  - [x] Signature canvas for Fahrzeug A & B with stylus/finger/mouse support
  - [x] PDF generation via jspdf (all data + sketch + photos + signatures)
  - [x] All fields optional, language: German
  - [x] PDF footer overflow fix: increased bottom margin from 40mm to 60mm and moved footer from pageHeight-6 to pageHeight-15 to prevent content overlap
  - [x] PDF image fix: preserve aspect ratio for photos, no longer forcing 4:3 format; now scales images to fit while maintaining original proportions
  - [x] PDF two-column overflow fix: `twoColumns` processes field pairs together, calculates required height before drawing, and performs a single synchronized page-break when needed, preventing both footer overlap and empty pages
  - [x] Save/load JSON: users can save all form data + sketch + photos + signatures to a local `.json` file and reload it later via header buttons
  - [x] Bilingual form support: language selector in header with three options — German only (default), German/English, German/French. All UI labels, section titles, placeholders, and PDF output are translated accordingly via centralized i18n system (`src/lib/i18n.ts`)
  - [x] Added help section on first tab explaining app functionality, button usage and PDF output, fully translated

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main accident report form (client component, tabbed) | ✅ Done |
| `src/app/layout.tsx` | Root layout (lang=de) | ✅ Done |
| `src/components/FormField.tsx` | Reusable form primitives (Input, Textarea, Checkbox, Section) | ✅ Done |
| `src/components/FahrzeugForm.tsx` | Vehicle + driver data form | ✅ Done |
| `src/components/VersicherungForm.tsx` | Insurance data form | ✅ Done |
| `src/components/ManoverForm.tsx` | Accident maneuver checkboxes | ✅ Done |
| `src/components/SkizzeCanvas.tsx` | Freehand drawing canvas | ✅ Done |
| `src/components/BilderUpload.tsx` | Photo upload with drag & drop | ✅ Done |
| `src/components/SignatureCanvas.tsx` | Signature pads for Fahrzeug A & B | ✅ Done |
| `src/lib/types.ts` | TypeScript interfaces & defaults | ✅ Done |
| `src/lib/i18n.ts` | Translation dictionary and `t()` helper for DE / DE+EN / DE+FR | ✅ Done |
| `src/lib/generatePdf.ts` | jspdf-based PDF generation | ✅ Done |

## Current Focus

App is complete and deployed.

## Quick Start Guide

### To add a new page:

Create a file at `src/app/[route]/page.tsx`:
```tsx
export default function NewPage() {
  return <div>New page content</div>;
}
```

### To add components:

Create `src/components/` directory and add components:
```tsx
// src/components/ui/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return <button className="px-4 py-2 bg-blue-600 text-white rounded">{children}</button>;
}
```

### To add a database:

Follow `.kilocode/recipes/add-database.md`

### To add API routes:

Create `src/app/api/[route]/route.ts`:
```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello" });
}
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add more recipes (auth, email, etc.)
- [ ] Add example components
- [ ] Add testing setup recipe

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-05-01 | Europäischer Unfallbericht app built: multi-tab form, sketch canvas, photo upload, PDF export |
| 2026-05-01 | PDF text overflow fix: all text rendering now uses splitTextToSize for labels, values, maneuver items, free-text fields, check rows, section titles, and photo captions |
| 2026-05-01 | PDF footer overlap fix: `twoColumns` and `addField` now perform inline page-break checks to prevent fields from drawing over the footer area |
| 2026-05-01 | PDF empty page fix: refactored `twoColumns` to calculate field heights before drawing and perform a single synchronized page-break per pair, preventing duplicate `addPage()` calls that caused blank pages |
| 2026-05-01 | Added signature tab: dual canvas signature pads for Fahrzeug A & B with pointer event support (stylus, finger, mouse), signatures embedded in PDF |
| 2026-05-01 | Added save/load JSON feature: header buttons to export/import all form data (including sketch, photos, signatures) as local `.json` file |
| 2026-05-01 | Added bilingual form support: language selector (Deutsch / Deutsch+English / Deutsch+Français), all UI labels and PDF output now support trilingual i18n via `src/lib/i18n.ts` |
| 2026-05-02 | Added responsive header: buttons wrap on mobile, subtitle hidden, compact padding |
| 2026-05-02 | Removed duplicate PDF button from bottom bar |
| 2026-05-02 | Added help box on first tab explaining app purpose, buttons and PDF output in all three languages |
