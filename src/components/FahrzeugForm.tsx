"use client";

import { InputField, Section } from "./FormField";
import type { FahrzeugDaten } from "@/lib/types";
import { t, type Sprache } from "@/lib/i18n";

interface Props {
  label: "A" | "B";
  lang: Sprache;
  data: FahrzeugDaten;
  onChange: (data: FahrzeugDaten) => void;
}

export function FahrzeugForm({ label, lang, data, onChange }: Props) {
  const set = <K extends keyof FahrzeugDaten>(key: K, val: FahrzeugDaten[K]) =>
    onChange({ ...data, [key]: val });

  return (
    <Section title={t("sectionFahrzeug", lang, { label })}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t("labelKennzeichen", lang)} value={data.kennzeichen} onChange={(v) => set("kennzeichen", v)} placeholder="z. B. B-AB 1234" />
        <InputField label={t("labelMarkeModell", lang)} value={data.markeModell} onChange={(v) => set("markeModell", v)} placeholder="z. B. VW Golf" />
        <InputField label={t("labelBaujahr", lang)} value={data.baujahr} onChange={(v) => set("baujahr", v)} placeholder="z. B. 2018" />
        <InputField label={t("labelFahrgestellnummer", lang)} value={data.fahrgestellnummer} onChange={(v) => set("fahrgestellnummer", v)} />

        <div className="col-span-full">
          <p className="text-sm font-semibold text-gray-700 mt-2 mb-2">{t("fahrer", lang)}</p>
        </div>

        <InputField label={t("labelName", lang)} value={data.fahrerName} onChange={(v) => set("fahrerName", v)} />
        <InputField label={t("labelVorname", lang)} value={data.fahrerVorname} onChange={(v) => set("fahrerVorname", v)} />
        <InputField label={t("labelGeburtsdatum", lang)} value={data.fahrerGeburtsdatum} onChange={(v) => set("fahrerGeburtsdatum", v)} type="date" />
        <InputField label={t("labelTelefon", lang)} value={data.fahrerTelefon} onChange={(v) => set("fahrerTelefon", v)} type="tel" />
        <InputField label={t("labelAdresse", lang)} value={data.fahrerAdresse} onChange={(v) => set("fahrerAdresse", v)} className="col-span-full sm:col-span-1" />
        <InputField label={t("labelPLZOrt", lang)} value={data.fahrerPLZOrt} onChange={(v) => set("fahrerPLZOrt", v)} />
        <InputField label={t("labelLand", lang)} value={data.fahrerLand} onChange={(v) => set("fahrerLand", v)} placeholder="z. B. Deutschland" />
        <InputField label={t("labelFuehrerscheinnummer", lang)} value={data.fahrerFuehrerscheinnummer} onChange={(v) => set("fahrerFuehrerscheinnummer", v)} />
        <InputField label={t("labelFuehrerscheinklasse", lang)} value={data.fahrerFuehrerscheinklasse} onChange={(v) => set("fahrerFuehrerscheinklasse", v)} placeholder="z. B. B" />
        <InputField label={t("labelAusstelldatum", lang)} value={data.fahrerFuehrerscheinAusstelldatum} onChange={(v) => set("fahrerFuehrerscheinAusstelldatum", v)} type="date" />

        <div className="col-span-full">
          <p className="text-sm font-semibold text-gray-700 mt-2 mb-2">{t("eigentuemer", lang)}</p>
        </div>

        <InputField label={t("labelEigentuemerName", lang)} value={data.eigentuemerName} onChange={(v) => set("eigentuemerName", v)} />
        <InputField label={t("labelEigentuemerAdresse", lang)} value={data.eigentuemerAdresse} onChange={(v) => set("eigentuemerAdresse", v)} />
        <InputField label={t("labelEigentuemerPLZOrt", lang)} value={data.eigentuemerPLZOrt} onChange={(v) => set("eigentuemerPLZOrt", v)} />
        <InputField label={t("labelEigentuemerLand", lang)} value={data.eigentuemerLand} onChange={(v) => set("eigentuemerLand", v)} />
        <InputField label={t("labelEigentuemerTelefon", lang)} value={data.eigentuemerTelefon} onChange={(v) => set("eigentuemerTelefon", v)} type="tel" />
      </div>
    </Section>
  );
}
