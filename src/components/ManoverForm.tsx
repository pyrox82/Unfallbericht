"use client";

import { CheckboxField, InputField, Section } from "./FormField";
import type { ManoverCheckboxen } from "@/lib/types";

interface Props {
  label: "A" | "B";
  data: ManoverCheckboxen;
  onChange: (data: ManoverCheckboxen) => void;
}

const manoverFelder: { key: keyof Omit<ManoverCheckboxen, "anderesManover">; label: string }[] = [
  { key: "geparkt", label: "Stand geparkt" },
  { key: "parkenVerlassen", label: "Verließ Parkplatz / öffnete Tür" },
  { key: "einparken", label: "Wollte einparken" },
  { key: "ausGarageAusfahren", label: "Fuhr aus Garage / Privatgelände" },
  { key: "aufParkplatz", label: "Fuhr auf Parkplatz" },
  { key: "kreisverkehr", label: "Im Kreisverkehr" },
  { key: "abbiegenLinks", label: "Bog links ab" },
  { key: "abbiegenRechts", label: "Bog rechts ab" },
  { key: "ueberholenVorbeifahren", label: "Überholte / fuhr vorbei" },
  { key: "spurwechselLinks", label: "Wechselte Spur nach links" },
  { key: "spurwechselRechts", label: "Wechselte Spur nach rechts" },
  { key: "rechtsHintenAufgefahren", label: "Fuhr von hinten auf" },
  { key: "gleicheRichtungVerschiedeneSpuren", label: "Gleiche Richtung, andere Spur" },
  { key: "gegenfahrbahn", label: "Fuhr auf Gegenfahrbahn" },
  { key: "rechtsVonRechts", label: "Kam von rechts (Vorfahrt)" },
  { key: "rueckwaerts", label: "Fuhr rückwärts" },
  { key: "nichtBeachtenVorfahrt", label: "Missachtete Vorfahrt / Ampel" },
];

export function ManoverForm({ label, data, onChange }: Props) {
  const set = <K extends keyof ManoverCheckboxen>(key: K, val: ManoverCheckboxen[K]) =>
    onChange({ ...data, [key]: val });

  const anzahl = manoverFelder.filter((f) => data[f.key]).length;

  return (
    <Section title={`Manöver / Umstände Fahrzeug ${label} (Anzahl angekreuzt: ${anzahl})`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {manoverFelder.map(({ key, label: lbl }) => (
          <CheckboxField
            key={key}
            label={lbl}
            checked={data[key]}
            onChange={(v) => set(key, v)}
          />
        ))}
      </div>
      <div className="mt-3">
        <InputField
          label="Sonstiges Manöver (Beschreibung)"
          value={data.anderesManover}
          onChange={(v) => set("anderesManover", v)}
          placeholder="Freie Beschreibung..."
        />
      </div>
    </Section>
  );
}
