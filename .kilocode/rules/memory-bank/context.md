# Active Context: Next.js Starter Template

## Current State

**App Status**: ✅ Europäischer Unfallbericht (European Accident Report) app fully implemented

A complete multi-tab accident report form app in German. Users can fill in all accident details and generate a downloadable PDF.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Europäischer Unfallbericht form app
  - [x] Multi-tab UI: Unfalldaten, Fahrzeug A, Fahrzeug B, Skizze, Fotos
  - [x] All form fields (date, time, names, addresses, insurance, maneuvers)
  - [x] Freehand canvas sketch with pen/eraser/color tools
  - [x] Photo upload (drag & drop, multiple files, categories)
  - [x] PDF generation via jspdf (all data + sketch + photos)
  - [x] All fields optional, language: German

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
| `src/lib/types.ts` | TypeScript interfaces & defaults | ✅ Done |
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
