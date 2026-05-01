"use client";

import { InputField, Section } from "./FormField";
import type { FahrzeugDaten } from "@/lib/types";

interface Props {
  label: "A" | "B";
  data: FahrzeugDaten;
  onChange: (data: FahrzeugDaten) => void;
}

export function FahrzeugForm({ label, data, onChange }: Props) {
  const set = <K extends keyof FahrzeugDaten>(key: K, val: FahrzeugDaten[K]) =>
    onChange({ ...data, [key]: val });

  return (
    <Section title={`Fahrzeug ${label} – Fahrzeug & Fahrer`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Kennzeichen" value={data.kennzeichen} onChange={(v) => set("kennzeichen", v)} placeholder="z. B. B-AB 1234" />
        <InputField label="Marke / Modell" value={data.markeModell} onChange={(v) => set("markeModell", v)} placeholder="z. B. VW Golf" />
        <InputField label="Baujahr" value={data.baujahr} onChange={(v) => set("baujahr", v)} placeholder="z. B. 2018" />
        <InputField label="Fahrgestellnummer (VIN)" value={data.fahrgestellnummer} onChange={(v) => set("fahrgestellnummer", v)} />

        <div className="col-span-full">
          <p className="text-sm font-semibold text-gray-700 mt-2 mb-2">Fahrer</p>
        </div>

        <InputField label="Name" value={data.fahrerName} onChange={(v) => set("fahrerName", v)} />
        <InputField label="Vorname" value={data.fahrerVorname} onChange={(v) => set("fahrerVorname", v)} />
        <InputField label="Geburtsdatum" value={data.fahrerGeburtsdatum} onChange={(v) => set("fahrerGeburtsdatum", v)} type="date" />
        <InputField label="Telefon" value={data.fahrerTelefon} onChange={(v) => set("fahrerTelefon", v)} type="tel" />
        <InputField label="Adresse" value={data.fahrerAdresse} onChange={(v) => set("fahrerAdresse", v)} className="col-span-full sm:col-span-1" />
        <InputField label="PLZ / Ort" value={data.fahrerPLZOrt} onChange={(v) => set("fahrerPLZOrt", v)} />
        <InputField label="Land" value={data.fahrerLand} onChange={(v) => set("fahrerLand", v)} placeholder="z. B. Deutschland" />
        <InputField label="Führerscheinnummer" value={data.fahrerFuehrerscheinnummer} onChange={(v) => set("fahrerFuehrerscheinnummer", v)} />
        <InputField label="Führerscheinklasse" value={data.fahrerFuehrerscheinklasse} onChange={(v) => set("fahrerFuehrerscheinklasse", v)} placeholder="z. B. B" />
        <InputField label="Ausstelldatum Führerschein" value={data.fahrerFuehrerscheinAusstelldatum} onChange={(v) => set("fahrerFuehrerscheinAusstelldatum", v)} type="date" />

        <div className="col-span-full">
          <p className="text-sm font-semibold text-gray-700 mt-2 mb-2">Eigentümer (falls abweichend vom Fahrer)</p>
        </div>

        <InputField label="Name Eigentümer" value={data.eigentuemerName} onChange={(v) => set("eigentuemerName", v)} />
        <InputField label="Adresse Eigentümer" value={data.eigentuemerAdresse} onChange={(v) => set("eigentuemerAdresse", v)} />
        <InputField label="PLZ / Ort Eigentümer" value={data.eigentuemerPLZOrt} onChange={(v) => set("eigentuemerPLZOrt", v)} />
        <InputField label="Land Eigentümer" value={data.eigentuemerLand} onChange={(v) => set("eigentuemerLand", v)} />
        <InputField label="Telefon Eigentümer" value={data.eigentuemerTelefon} onChange={(v) => set("eigentuemerTelefon", v)} type="tel" />
      </div>
    </Section>
  );
}
