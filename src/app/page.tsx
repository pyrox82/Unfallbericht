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
import { t, type Sprache } from "@/lib/i18n";

type Tab = "unfall" | "fahrzeugA" | "fahrzeugB" | "skizze" | "bilder" | "unterschrift";

const TABS: Tab[] = ["unfall", "fahrzeugA", "fahrzeugB", "skizze", "bilder", "unterschrift"];

function tabLabel(tab: Tab, lang: Sprache): string {
  switch (tab) {
    case "unfall": return t("tabUnfall", lang);
    case "fahrzeugA": return t("tabFahrzeugA", lang);
    case "fahrzeugB": return t("tabFahrzeugB", lang);
    case "skizze": return t("tabSkizze", lang);
    case "bilder": return t("tabFotos", lang);
    case "unterschrift": return t("tabUnterschrift", lang);
  }
}

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
      await generateUnfallberichtPdf(bericht, bericht.sprache);
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
        <div className="max-w-5xl mx-auto px-4 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-xl font-bold leading-tight">{t("appTitle", bericht.sprache)}</h1>
            <p className="text-blue-200 text-xs hidden sm:block">Constat Amiable d&apos;Accident Automobile</p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
            <select
              value={bericht.sprache}
              onChange={(e) => set("sprache", e.target.value as Sprache)}
              className="px-2 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-blue-700 text-white border border-blue-600 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="de">Deutsch</option>
              <option value="de-en">Deutsch / English</option>
              <option value="de-fr">Deutsch / Français</option>
            </select>
            <button
              onClick={handleReset}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors"
            >
              {t("btnNeu", bericht.sprache)}
            </button>
            <button
              onClick={handleSave}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors"
            >
              {t("btnSpeichern", bericht.sprache)}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg bg-blue-700 hover:bg-blue-600 transition-colors"
            >
              {t("btnLaden", bericht.sprache)}
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
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-white text-blue-800 hover:bg-blue-50 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                  {t("pdfWirdErstellt", bericht.sprache)}
                </>
              ) : (
                t("btnPdfErstellen", bericht.sprache)
              )}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm whitespace-nowrap rounded-t-lg transition-colors ${
                activeTab === tab
                  ? "bg-white text-blue-800 font-semibold"
                  : "text-blue-200 hover:text-white hover:bg-blue-700"
              }`}
            >
              {tabLabel(tab, bericht.sprache)}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6 pb-24">
        {/* ── Tab: Unfalldaten & Zeugen ─────────────────────────────────────── */}
        {activeTab === "unfall" && (
          <>
            <Section title={t("sectionUnfall", bericht.sprache)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label={t("labelDatum", bericht.sprache)}
                  value={bericht.unfallDatum}
                  onChange={(v) => set("unfallDatum", v)}
                  type="date"
                />
                <InputField
                  label={t("labelUhrzeit", bericht.sprache)}
                  value={bericht.unfallUhrzeit}
                  onChange={(v) => set("unfallUhrzeit", v)}
                  type="time"
                />
                <InputField
                  label={t("labelUnfallort", bericht.sprache)}
                  value={bericht.unfallOrt}
                  onChange={(v) => set("unfallOrt", v)}
                  placeholder="z. B. Hauptstraße 5, München"
                  className="col-span-full sm:col-span-1"
                />
                <InputField
                  label={t("labelLand", bericht.sprache)}
                  value={bericht.unfallLand}
                  onChange={(v) => set("unfallLand", v)}
                  placeholder="z. B. Deutschland"
                />

                <div className="col-span-full flex flex-col gap-2">
                  <CheckboxField
                    label={t("checkVerletzte", bericht.sprache)}
                    checked={bericht.verletzte}
                    onChange={(v) => set("verletzte", v)}
                  />
                  <CheckboxField
                    label={t("checkSachschaden", bericht.sprache)}
                    checked={bericht.sachschadenAnDritten}
                    onChange={(v) => set("sachschadenAnDritten", v)}
                  />
                  <CheckboxField
                    label={t("checkZeugen", bericht.sprache)}
                    checked={bericht.zeugenVorhanden}
                    onChange={(v) => set("zeugenVorhanden", v)}
                  />
                </div>
              </div>
            </Section>

            <Section title={t("sectionZeugen", bericht.sprache)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-gray-700">{t("zeuge1", bericht.sprache)}</p>
                  <InputField
                    label={t("labelName", bericht.sprache)}
                    value={bericht.zeuge1Name}
                    onChange={(v) => set("zeuge1Name", v)}
                  />
                  <InputField
                    label={t("labelAdresse", bericht.sprache)}
                    value={bericht.zeuge1Adresse}
                    onChange={(v) => set("zeuge1Adresse", v)}
                  />
                  <InputField
                    label={t("labelTelefon", bericht.sprache)}
                    value={bericht.zeuge1Telefon}
                    onChange={(v) => set("zeuge1Telefon", v)}
                    type="tel"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold text-gray-700">{t("zeuge2", bericht.sprache)}</p>
                  <InputField
                    label={t("labelName", bericht.sprache)}
                    value={bericht.zeuge2Name}
                    onChange={(v) => set("zeuge2Name", v)}
                  />
                  <InputField
                    label={t("labelAdresse", bericht.sprache)}
                    value={bericht.zeuge2Adresse}
                    onChange={(v) => set("zeuge2Adresse", v)}
                  />
                  <InputField
                    label={t("labelTelefon", bericht.sprache)}
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
              lang={bericht.sprache}
              data={bericht.fahrzeugA}
              onChange={(v) => set("fahrzeugA", v)}
            />
            <VersicherungForm
              label="A"
              lang={bericht.sprache}
              data={bericht.versicherungA}
              onChange={(v) => set("versicherungA", v)}
            />
            <ManoverForm
              label="A"
              lang={bericht.sprache}
              data={bericht.manoverA}
              onChange={(v) => set("manoverA", v)}
            />
            <Section title={t("sectionSchadenA", bericht.sprache)}>
              <div className="flex flex-col gap-4">
                <TextareaField
                  label={t("labelSchadenA", bericht.sprache)}
                  value={bericht.schadenA}
                  onChange={(v) => set("schadenA", v)}
                  placeholder="Beschreiben Sie die sichtbaren Schäden am Fahrzeug A..."
                  rows={3}
                />
                <TextareaField
                  label={t("labelBemerkungA", bericht.sprache)}
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
              lang={bericht.sprache}
              data={bericht.fahrzeugB}
              onChange={(v) => set("fahrzeugB", v)}
            />
            <VersicherungForm
              label="B"
              lang={bericht.sprache}
              data={bericht.versicherungB}
              onChange={(v) => set("versicherungB", v)}
            />
            <ManoverForm
              label="B"
              lang={bericht.sprache}
              data={bericht.manoverB}
              onChange={(v) => set("manoverB", v)}
            />
            <Section title={t("sectionSchadenB", bericht.sprache)}>
              <div className="flex flex-col gap-4">
                <TextareaField
                  label={t("labelSchadenB", bericht.sprache)}
                  value={bericht.schadenB}
                  onChange={(v) => set("schadenB", v)}
                  placeholder="Beschreiben Sie die sichtbaren Schäden am Fahrzeug B..."
                  rows={3}
                />
                <TextareaField
                  label={t("labelBemerkungB", bericht.sprache)}
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
            lang={bericht.sprache}
            value={bericht.skizze}
            onChange={(v) => set("skizze", v)}
          />
        )}

        {/* ── Tab: Bilder ───────────────────────────────────────────────────── */}
        {activeTab === "bilder" && (
          <BilderUpload
            lang={bericht.sprache}
            bilder={bericht.bilder}
            onChange={(v) => set("bilder", v)}
          />
        )}

        {/* ── Tab: Unterschrift ─────────────────────────────────────────────── */}
        {activeTab === "unterschrift" && (
          <SignatureCanvas
            lang={bericht.sprache}
            unterschriftA={bericht.unterschriftA}
            unterschriftB={bericht.unterschriftB}
            onChangeA={(v) => set("unterschriftA", v)}
            onChangeB={(v) => set("unterschriftB", v)}
          />
        )}
      </main>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center shadow-lg z-40">
        <p className="text-sm text-gray-500">
          {bericht.bilder.length > 0 && (
            <span>{bericht.bilder.length} {t("fotosAngehaengt", bericht.sprache).replace("{s}", bericht.bilder.length !== 1 ? "s" : "")}</span>
          )}
          {bericht.skizze && (
            <span>{bericht.bilder.length > 0 ? " · " : ""}{t("skizzeVorhanden", bericht.sprache)}</span>
          )}
          {(bericht.unterschriftA || bericht.unterschriftB) && (
            <span>{(bericht.bilder.length > 0 || bericht.skizze) ? " · " : ""}{t("unterschriftVorhanden", bericht.sprache)}</span>
          )}
          {!bericht.bilder.length && !bericht.skizze && !bericht.unterschriftA && !bericht.unterschriftB && (
            <span className="text-gray-400">{t("alleFelderOptional", bericht.sprache)}</span>
          )}
        </p>
      </div>
    </div>
  );
}
