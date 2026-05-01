"use client";

import { useRef } from "react";
import { Section } from "./FormField";
import type { UploadedImage } from "@/lib/types";

interface Props {
  bilder: UploadedImage[];
  onChange: (bilder: UploadedImage[]) => void;
}

const typeOptions: { value: UploadedImage["type"]; label: string }[] = [
  { value: "fahrzeugA", label: "Fahrzeug A" },
  { value: "fahrzeugB", label: "Fahrzeug B" },
  { value: "unfall", label: "Unfallstelle" },
  { value: "sonstiges", label: "Sonstiges" },
];

export function BilderUpload({ bilder, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: UploadedImage[] = [];
    let processed = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          newImages.push({
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            dataUrl: e.target?.result as string,
            type: "unfall",
            beschreibung: "",
            width: img.width,
            height: img.height,
          });
          processed++;
          if (processed === files.length) {
            onChange([...bilder, ...newImages]);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const updateBild = (id: string, key: keyof UploadedImage, val: string) => {
    onChange(bilder.map((b) => (b.id === id ? { ...b, [key]: val } : b)));
  };

  const removeBild = (id: string) => {
    onChange(bilder.filter((b) => b.id !== id));
  };

  return (
    <Section title="Fotos anhängen">
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="text-4xl mb-2">📷</div>
        <p className="text-sm text-gray-600">
          Fotos hier ablegen oder <span className="text-blue-600 font-medium">klicken zum Auswählen</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP – mehrere Dateien möglich</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {bilder.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bilder.map((bild) => (
            <div key={bild.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bild.dataUrl}
                alt={bild.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 flex flex-col gap-2">
                <p className="text-xs text-gray-500 truncate">{bild.name}</p>
                <select
                  value={bild.type}
                  onChange={(e) => updateBild(bild.id, "type", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {typeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={bild.beschreibung}
                  onChange={(e) => updateBild(bild.id, "beschreibung", e.target.value)}
                  placeholder="Beschreibung (optional)"
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeBild(bild.id)}
                  className="text-red-500 text-xs hover:text-red-700 text-left"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
