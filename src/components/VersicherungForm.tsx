"use client";

import { InputField, CheckboxField, Section } from "./FormField";
import type { VersicherungDaten } from "@/lib/types";

interface Props {
  label: "A" | "B";
  data: VersicherungDaten;
  onChange: (data: VersicherungDaten) => void;
}

export function VersicherungForm({ label, data, onChange }: Props) {
  const set = <K extends keyof VersicherungDaten>(key: K, val: VersicherungDaten[K]) =>
    onChange({ ...data, [key]: val });

  return (
    <Section title={`Versicherung Fahrzeug ${label}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Versicherungsgesellschaft" value={data.gesellschaftName} onChange={(v) => set("gesellschaftName", v)} className="col-span-full sm:col-span-1" />
        <InputField label="Adresse der Gesellschaft" value={data.gesellschaftAdresse} onChange={(v) => set("gesellschaftAdresse", v)} />
        <InputField label="Telefon der Gesellschaft" value={data.gesellschaftTelefon} onChange={(v) => set("gesellschaftTelefon", v)} type="tel" />
        <InputField label="Versicherungsscheinnummer" value={data.versicherungsscheinnummer} onChange={(v) => set("versicherungsscheinnummer", v)} />
        <InputField label="Grüne Karte Nummer" value={data.grueneKarteNummer} onChange={(v) => set("grueneKarteNummer", v)} />
        <InputField label="Grüne Karte gültig bis" value={data.grueneKarteGueltigBis} onChange={(v) => set("grueneKarteGueltigBis", v)} type="date" />

        <div className="col-span-full">
          <CheckboxField
            label="Kaskoversicherung vorhanden"
            checked={data.kaskoversicherung}
            onChange={(v) => set("kaskoversicherung", v)}
          />
        </div>

        {data.kaskoversicherung && (
          <>
            <InputField label="Kasko-Gesellschaft" value={data.kaskoGesellschaft} onChange={(v) => set("kaskoGesellschaft", v)} />
            <InputField label="Kasko-Versicherungsscheinnummer" value={data.kaskoScheinnummer} onChange={(v) => set("kaskoScheinnummer", v)} />
          </>
        )}
      </div>
    </Section>
  );
}
