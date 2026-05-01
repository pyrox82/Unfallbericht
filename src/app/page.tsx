"use client";

import { useState, useCallback, useRef } from "react";
import { defaultBericht } from "@/lib/types";
import type { UnfallBericht } from "@/lib/types";
import { InputField, CheckboxField, TextareaField, Section } from "@/components/FormField";
import { FahrzeugForm } from "@/components/FahrzeugForm";
import { VersicherungForm } from "@/components/VersicherungForm";
import { ManoverForm } from "@/components/ManoverForm";
import { BilderUpload } from "@/components/BilderUpload";
import { SkizzeCanvas } from "@/components/SkizzeCanvas";
import { SignatureCanvas } from "@/components/SignatureCanvas";

type Tab = "unfall" | "fahrzeugA" | "fahrzeugB" | "skizze" | "bilder" | "unterschrift";

const TABS: { key: Tab; label: string }[] = [
  { key: "unfall", label: "Unfalldaten & Zeugen" },
  { key: "fahrzeugA", label: "Fahrzeug A" },
  { key: "fahrzeugB", label: "Fahrzeug B" },
  { key: "skizze", label: "Skizze" },
  { key: "bilder", label: "Fotos" },
  { key: "unterschrift", label: "Unterschrift" },
];

export default function Home() {
  const [bericht, setBericht] = useState<UnfallBericht>(defaultBericht());
  const [activeTab, setActiveTab] = useState<Tab>("unfall");
  const [generating, setGenerating] = useState(false);

  const set = useCallback(
    <K extends keyof UnfallBericht>(key: K, val: UnfallBericht[K]) =>
      setBericht((prev) => ({ ...prev, [key]: val })),
    []
  );

  const handleGeneratePdf = async () => {
    setGenerating(true);
    try {
      const { generateUnfallberichtPdf } = await import("@/lib/generatePdf");
      await generateUnfallberichtPdf(bericht);
    } catch (err) {
      console.error("PDF-Fehler:", err);
      alert("Fehler beim Erstellen des PDFs. Bitte versuchen Sie es erneut.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    if (confirm("Alle Eingaben löschen und neu beginnen?")) {
      setBericht(defaultBericht());
      setActiveTab("unfall");
    }
  };

  const handleSave = () => {
    const data = JSON.stringify(bericht, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unfallbericht-${bericht.unfallDatum || new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        // Basic validation
        if (typeof data !== "object" || data === null) {
          throw new Error("Ungültige Datei");
        }
        setBericht({ ...defaultBericht(), ...data });
        alert("Daten erfolgreich geladen.");
      } catch (err) {
        alert("Fehler beim Laden der Datei. Bitte wählen Sie eine gültige JSON-Datei aus.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold leading-tight">Europäischer Unfallbericht</h1>
            <p className="text-blue-200 text-xs">Constat Amiable d&apos;Accident Automobile</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-sm rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors"
            >
              Neu
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 text-sm rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors"
            >
              Speichern
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 text-sm rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors"
            >
              Laden
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleLoad}
              className="hidden"
            />
            <button
              onClick={handleGeneratePdf}
              disabled={generating}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-blue-800 hover:bg-blue-50 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                  PDF wird erstellt…
                </>
              ) : (
                "PDF erstellen"
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 text-sm whitespace-nowrap rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-blue-800 font-semibold"
                  : "text-blue-200 hover:text-white hover:bg-blue-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6 pb-24">
        {/* ── Tab: Unfalldaten & Zeugen ─────────────────────────────────────── */}
        {activeTab === "unfall" && (
          <>
            <Section title="1. Unfalldaten">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Datum des Unfalls"
                  value={bericht.unfallDatum}
                  onChange={(v) => set("unfallDatum", v)}
                  type="date"
                />
                <InputField
                  label="Uhrzeit"
                  value={bericht.unfallUhrzeit}
                  onChange={(v) => set("unfallUhrzeit", v)}
                  type="time"
                />
                <InputField
                  label="Unfallort (Straße, Ort)"
                  value={bericht.unfallOrt}
                  onChange={(v) => set("unfallOrt", v)}
                  placeholder="z. B. Hauptstraße 5, München"
                  className="col-span-full sm:col-span-1"
                />
                <InputField
                  label="Land"
                  value={bericht.unfallLand}
                  onChange={(v) => set("unfallLand", v)}
                  placeholder="z. B. Deutschland"
                />

                <div className="col-span-full flex flex-col gap-2">
                  <CheckboxField
                    label="Verletzte Personen vorhanden"
                    checked={bericht.verletzte}
                    onChange={(v) => set("verletzte", v)}
                  />
                  <CheckboxField
                    label="Sachschaden an anderen Fahrzeugen / Gegenständen"
                    checked={bericht.sachschadenAnDritten}
                    onChange={(v) => set("sachschadenAnDritten", v)}
                  />
                  <CheckboxField
                    label="Zeugen vorhanden"
                    checked={bericht.zeugenVorhanden}
                    onChange={(v) => set("zeugenVorhanden", v)}
                  />
                </div>
              </div>
            </Section>

            <Section title="2. Zeugen (optional)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-gray-700">Zeuge 1</p>
                  <InputField
                    label="Name"
                    value={bericht.zeuge1Name}
                    onChange={(v) => set("zeuge1Name", v)}
                  />
                  <InputField
                    label="Adresse"
                    value={bericht.zeuge1Adresse}
                    onChange={(v) => set("zeuge1Adresse", v)}
                  />
                  <InputField
                    label="Telefon"
                    value={bericht.zeuge1Telefon}
                    onChange={(v) => set("zeuge1Telefon", v)}
                    type="tel"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-gray-700">Zeuge 2</p>
                  <InputField
                    label="Name"
                    value={bericht.zeuge2Name}
                    onChange={(v) => set("zeuge2Name", v)}
                  />
                  <InputField
                    label="Adresse"
                    value={bericht.zeuge2Adresse}
                    onChange={(v) => set("zeuge2Adresse", v)}
                  />
                  <InputField
                    label="Telefon"
                    value={bericht.zeuge2Telefon}
                    onChange={(v) => set("zeuge2Telefon", v)}
                    type="tel"
                  />
                </div>
              </div>
            </Section>
          </>
        )}

        {/* ── Tab: Fahrzeug A ───────────────────────────────────────────────── */}
        {activeTab === "fahrzeugA" && (
          <>
            <FahrzeugForm
              label="A"
              data={bericht.fahrzeugA}
              onChange={(v) => set("fahrzeugA", v)}
            />
            <VersicherungForm
              label="A"
              data={bericht.versicherungA}
              onChange={(v) => set("versicherungA", v)}
            />
            <ManoverForm
              label="A"
              data={bericht.manoverA}
              onChange={(v) => set("manoverA", v)}
            />
            <Section title="Sichtbare Schäden & Bemerkungen – Fahrzeug A">
              <div className="flex flex-col gap-4">
                <TextareaField
                  label="Sichtbare Schäden Fahrzeug A"
                  value={bericht.schadenA}
                  onChange={(v) => set("schadenA", v)}
                  placeholder="Beschreiben Sie die sichtbaren Schäden am Fahrzeug A..."
                  rows={3}
                />
                <TextareaField
                  label="Bemerkungen Fahrzeug A"
                  value={bericht.bemerkungA}
                  onChange={(v) => set("bemerkungA", v)}
                  placeholder="Weitere Anmerkungen..."
                  rows={3}
                />
              </div>
            </Section>
          </>
        )}

        {/* ── Tab: Fahrzeug B ───────────────────────────────────────────────── */}
        {activeTab === "fahrzeugB" && (
          <>
            <FahrzeugForm
              label="B"
              data={bericht.fahrzeugB}
              onChange={(v) => set("fahrzeugB", v)}
            />
            <VersicherungForm
              label="B"
              data={bericht.versicherungB}
              onChange={(v) => set("versicherungB", v)}
            />
            <ManoverForm
              label="B"
              data={bericht.manoverB}
              onChange={(v) => set("manoverB", v)}
            />
            <Section title="Sichtbare Schäden & Bemerkungen – Fahrzeug B">
              <div className="flex flex-col gap-4">
                <TextareaField
                  label="Sichtbare Schäden Fahrzeug B"
                  value={bericht.schadenB}
                  onChange={(v) => set("schadenB", v)}
                  placeholder="Beschreiben Sie die sichtbaren Schäden am Fahrzeug B..."
                  rows={3}
                />
                <TextareaField
                  label="Bemerkungen Fahrzeug B"
                  value={bericht.bemerkungB}
                  onChange={(v) => set("bemerkungB", v)}
                  placeholder="Weitere Anmerkungen..."
                  rows={3}
                />
              </div>
            </Section>
          </>
        )}

        {/* ── Tab: Skizze ───────────────────────────────────────────────────── */}
        {activeTab === "skizze" && (
          <SkizzeCanvas
            value={bericht.skizze}
            onChange={(v) => set("skizze", v)}
          />
        )}

        {/* ── Tab: Bilder ───────────────────────────────────────────────────── */}
        {activeTab === "bilder" && (
          <BilderUpload
            bilder={bericht.bilder}
            onChange={(v) => set("bilder", v)}
          />
        )}

        {/* ── Tab: Unterschrift ─────────────────────────────────────────────── */}
        {activeTab === "unterschrift" && (
          <SignatureCanvas
            unterschriftA={bericht.unterschriftA}
            unterschriftB={bericht.unterschriftB}
            onChangeA={(v) => set("unterschriftA", v)}
            onChangeB={(v) => set("unterschriftB", v)}
          />
        )}
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center shadow-lg z-40">
        <p className="text-sm text-gray-500">
          {bericht.bilder.length > 0 && (
            <span>{bericht.bilder.length} Foto{bericht.bilder.length !== 1 ? "s" : ""} angehängt</span>
          )}
          {bericht.skizze && (
            <span>{bericht.bilder.length > 0 ? " · " : ""}Skizze vorhanden</span>
          )}
          {(bericht.unterschriftA || bericht.unterschriftB) && (
            <span>{(bericht.bilder.length > 0 || bericht.skizze) ? " · " : ""}Unterschrift vorhanden</span>
          )}
          {!bericht.bilder.length && !bericht.skizze && !bericht.unterschriftA && !bericht.unterschriftB && (
            <span className="text-gray-400">Alle Felder sind optional</span>
          )}
        </p>
        <button
          onClick={handleGeneratePdf}
          disabled={generating}
          className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-blue-800 text-white hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {generating ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              PDF wird erstellt…
            </>
          ) : (
            "PDF erstellen & herunterladen"
          )}
        </button>
      </div>
    </div>
  );
}
