"use client";

import { CheckboxField, InputField, Section } from "./FormField";
import type { ManoverCheckboxen } from "@/lib/types";
import { t, type Sprache } from "@/lib/i18n";

interface Props {
  label: "A" | "B";
  lang: Sprache;
  data: ManoverCheckboxen;
  onChange: (data: ManoverCheckboxen) => void;
}

function manoverFelder(lang: Sprache): { key: keyof Omit<ManoverCheckboxen, "anderesManover">; label: string }[] {
  return [
    { key: "geparkt", label: t("manoverGeparkt", lang) },
    { key: "parkenVerlassen", label: t("manoverParkenVerlassen", lang) },
    { key: "einparken", label: t("manoverEinparken", lang) },
    { key: "ausGarageAusfahren", label: t("manoverAusGarage", lang) },
    { key: "aufParkplatz", label: t("manoverAufParkplatz", lang) },
    { key: "kreisverkehr", label: t("manoverKreisverkehr", lang) },
    { key: "abbiegenLinks", label: t("manoverAbbiegenLinks", lang) },
    { key: "abbiegenRechts", label: t("manoverAbbiegenRechts", lang) },
    { key: "ueberholenVorbeifahren", label: t("manoverUeberholen", lang) },
    { key: "spurwechselLinks", label: t("manoverSpurwechselLinks", lang) },
    { key: "spurwechselRechts", label: t("manoverSpurwechselRechts", lang) },
    { key: "rechtsHintenAufgefahren", label: t("manoverHintenAufgefahren", lang) },
    { key: "gleicheRichtungVerschiedeneSpuren", label: t("manoverGleicheRichtung", lang) },
    { key: "gegenfahrbahn", label: t("manoverGegenfahrbahn", lang) },
    { key: "rechtsVonRechts", label: t("manoverRechtsVonRechts", lang) },
    { key: "rueckwaerts", label: t("manoverRueckwaerts", lang) },
    { key: "nichtBeachtenVorfahrt", label: t("manoverVorfahrt", lang) },
  ];
}

export function ManoverForm({ label, lang, data, onChange }: Props) {
  const set = <K extends keyof ManoverCheckboxen>(key: K, val: ManoverCheckboxen[K]) =>
    onChange({ ...data, [key]: val });

  const felder = manoverFelder(lang);
  const anzahl = felder.filter((f) => data[f.key]).length;

  return (
    <Section title={t("sectionManover", lang, { label, anzahl })}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {felder.map(({ key, label: lbl }) => (
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
          label={t("labelSonstigesManover", lang)}
          value={data.anderesManover}
          onChange={(v) => set("anderesManover", v)}
          placeholder="Freie Beschreibung..."
        />
      </div>
    </Section>
  );
}
