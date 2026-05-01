"use client";

import { InputField, CheckboxField, Section } from "./FormField";
import type { VersicherungDaten } from "@/lib/types";
import { t, type Sprache } from "@/lib/i18n";

interface Props {
  label: "A" | "B";
  lang: Sprache;
  data: VersicherungDaten;
  onChange: (data: VersicherungDaten) => void;
}

export function VersicherungForm({ label, lang, data, onChange }: Props) {
  const set = <K extends keyof VersicherungDaten>(key: K, val: VersicherungDaten[K]) =>
    onChange({ ...data, [key]: val });

  return (
    <Section title={t("sectionVersicherung", lang, { label })}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label={t("labelVersicherungsgesellschaft", lang)} value={data.gesellschaftName} onChange={(v) => set("gesellschaftName", v)} className="col-span-full sm:col-span-1" />
        <InputField label={t("labelGesellschaftAdresse", lang)} value={data.gesellschaftAdresse} onChange={(v) => set("gesellschaftAdresse", v)} />
        <InputField label={t("labelGesellschaftTelefon", lang)} value={data.gesellschaftTelefon} onChange={(v) => set("gesellschaftTelefon", v)} type="tel" />
        <InputField label={t("labelVersicherungsscheinnummer", lang)} value={data.versicherungsscheinnummer} onChange={(v) => set("versicherungsscheinnummer", v)} />
        <InputField label={t("labelGrueneKarteNummer", lang)} value={data.grueneKarteNummer} onChange={(v) => set("grueneKarteNummer", v)} />
        <InputField label={t("labelGrueneKarteGueltig", lang)} value={data.grueneKarteGueltigBis} onChange={(v) => set("grueneKarteGueltigBis", v)} type="date" />

        <div className="col-span-full">
          <CheckboxField
            label={t("checkKasko", lang)}
            checked={data.kaskoversicherung}
            onChange={(v) => set("kaskoversicherung", v)}
          />
        </div>

        {data.kaskoversicherung && (
          <>
            <InputField label={t("labelKaskoGesellschaft", lang)} value={data.kaskoGesellschaft} onChange={(v) => set("kaskoGesellschaft", v)} />
            <InputField label={t("labelKaskoScheinnummer", lang)} value={data.kaskoScheinnummer} onChange={(v) => set("kaskoScheinnummer", v)} />
          </>
        )}
      </div>
    </Section>
  );
}
