import jsPDF from "jspdf";
import type { UnfallBericht, ManoverCheckboxen } from "./types";

const manoverLabels: Record<keyof Omit<ManoverCheckboxen, "anderesManover">, string> = {
  geparkt: "Stand geparkt",
  parkenVerlassen: "Verließ Parkplatz / öffnete Tür",
  einparken: "Wollte einparken",
  ausGarageAusfahren: "Fuhr aus Garage / Privatgelände",
  aufParkplatz: "Fuhr auf Parkplatz",
  kreisverkehr: "Im Kreisverkehr",
  abbiegenLinks: "Bog links ab",
  abbiegenRechts: "Bog rechts ab",
  ueberholenVorbeifahren: "Überholte / fuhr vorbei",
  spurwechselLinks: "Wechselte Spur nach links",
  spurwechselRechts: "Wechselte Spur nach rechts",
  rechtsHintenAufgefahren: "Fuhr von hinten auf",
  gleicheRichtungVerschiedeneSpuren: "Gleiche Richtung, andere Spur",
  gegenfahrbahn: "Fuhr auf Gegenfahrbahn",
  rechtsVonRechts: "Kam von rechts (Vorfahrt)",
  rueckwaerts: "Fuhr rückwärts",
  nichtBeachtenVorfahrt: "Missachtete Vorfahrt / Ampel",
};

function addSectionTitle(doc: jsPDF, title: string, y: number, pageWidth: number): number {
  doc.setFillColor(30, 64, 175);
  doc.rect(14, y, pageWidth - 28, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(title, pageWidth - 32);
  doc.text(titleLines, 16, y + 5.5);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  return y + 12;
}

function addField(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number
): number {
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  const labelLines = doc.splitTextToSize(label, width - 4);
  doc.text(labelLines, x, y);
  const labelH = labelLines.length * 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const lines = doc.splitTextToSize(value || "—", width - 4);
  doc.text(lines, x, y + labelH + 0.5);

  const valueH = Math.max(lines.length * 4.5, 4.5);
  const totalH = labelH + valueH;
  doc.setDrawColor(200, 200, 200);
  doc.line(x, y + totalH + 3, x + width - 2, y + totalH + 3);
  return y + totalH + 6;
}

function twoColumns(
  doc: jsPDF,
  fields: [string, string][],
  startY: number,
  pageWidth: number
): number {
  const colW = (pageWidth - 28) / 2;
  let leftY = startY;
  let rightY = startY;

  fields.forEach(([label, value], i) => {
    if (i % 2 === 0) {
      leftY = addField(doc, label, value, 14, leftY, colW);
    } else {
      rightY = addField(doc, label, value, 14 + colW + 2, rightY, colW);
    }
  });

  return Math.max(leftY, rightY);
}

function checkNewPage(doc: jsPDF, y: number, pageHeight: number, margin = 40): number {
  if (y > pageHeight - margin) {
    doc.addPage();
    return 20;
  }
  return y;
}

export async function generateUnfallberichtPdf(bericht: UnfallBericht): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = 14;

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Europäischer Unfallbericht", pageWidth / 2, 10, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Constat Amiable d'Accident Automobile", pageWidth / 2, 17, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y = 28;

   // ── 1. Unfalldaten ──────────────────────────────────────────────────────────
   y = addSectionTitle(doc, "1. Unfalldaten", y, pageWidth);
   y = twoColumns(
     doc,
     [
       ["Datum", bericht.unfallDatum],
       ["Uhrzeit", bericht.unfallUhrzeit],
       ["Unfallort", bericht.unfallOrt],
       ["Land", bericht.unfallLand],
     ],
     y,
     pageWidth
   );
   y = checkNewPage(doc, y, pageHeight);

   const checks = [
     bericht.verletzte ? "Verletzte: Ja" : "Verletzte: Nein",
     bericht.sachschadenAnDritten ? "Sachschaden an Dritten: Ja" : "Sachschaden an Dritten: Nein",
     bericht.zeugenVorhanden ? "Zeugen vorhanden: Ja" : "Zeugen vorhanden: Nein",
   ];
   doc.setFontSize(8);
   doc.setFont("helvetica", "normal");
   const checkColW = (pageWidth - 28) / 3;
   checks.forEach((c, i) => {
     const wrappedCheck = doc.splitTextToSize(c, checkColW - 2);
     doc.text(wrappedCheck, 14 + i * checkColW, y);
   });
   y += 8;

  // ── 2. Zeugen ────────────────────────────────────────────────────────────────
  if (
    bericht.zeugenVorhanden ||
    bericht.zeuge1Name ||
    bericht.zeuge2Name
  ) {
    y = checkNewPage(doc, y, pageHeight);
    y = addSectionTitle(doc, "2. Zeugen", y, pageWidth);
    y = twoColumns(
      doc,
      [
        ["Name Zeuge 1", bericht.zeuge1Name],
        ["Name Zeuge 2", bericht.zeuge2Name],
        ["Adresse Zeuge 1", bericht.zeuge1Adresse],
        ["Adresse Zeuge 2", bericht.zeuge2Adresse],
        ["Telefon Zeuge 1", bericht.zeuge1Telefon],
        ["Telefon Zeuge 2", bericht.zeuge2Telefon],
      ],
      y,
      pageWidth
    );
  }

  // ── Fahrzeug A & B ───────────────────────────────────────────────────────────
  const fahrzeuge: ["A" | "B", typeof bericht.fahrzeugA, typeof bericht.versicherungA, typeof bericht.manoverA, string, string][] = [
    ["A", bericht.fahrzeugA, bericht.versicherungA, bericht.manoverA, bericht.schadenA, bericht.bemerkungA],
    ["B", bericht.fahrzeugB, bericht.versicherungB, bericht.manoverB, bericht.schadenB, bericht.bemerkungB],
  ];

  for (const [label, fz, vs, mv, schaden, bemerkung] of fahrzeuge) {
    y = checkNewPage(doc, y, pageHeight);
    y = addSectionTitle(doc, `3${label === "B" ? "b" : "a"}. Fahrzeug ${label} – Fahrer & Fahrzeug`, y, pageWidth);

    y = twoColumns(
      doc,
      [
        ["Kennzeichen", fz.kennzeichen],
        ["Marke / Modell", fz.markeModell],
        ["Baujahr", fz.baujahr],
        ["Fahrgestellnummer", fz.fahrgestellnummer],
        ["Name (Fahrer)", fz.fahrerName],
        ["Vorname (Fahrer)", fz.fahrerVorname],
        ["Geburtsdatum", fz.fahrerGeburtsdatum],
        ["Adresse", fz.fahrerAdresse],
        ["PLZ / Ort", fz.fahrerPLZOrt],
        ["Land", fz.fahrerLand],
        ["Telefon", fz.fahrerTelefon],
        ["Führerscheinnummer", fz.fahrerFuehrerscheinnummer],
        ["Führerscheinklasse", fz.fahrerFuehrerscheinklasse],
        ["Ausstelldatum Führerschein", fz.fahrerFuehrerscheinAusstelldatum],
        ["Eigentümer Name", fz.eigentuemerName],
        ["Eigentümer Adresse", fz.eigentuemerAdresse],
        ["Eigentümer PLZ / Ort", fz.eigentuemerPLZOrt],
        ["Eigentümer Land", fz.eigentuemerLand],
        ["Eigentümer Telefon", fz.eigentuemerTelefon],
      ],
      y,
      pageWidth
    );

    y = checkNewPage(doc, y, pageHeight);
    y = addSectionTitle(doc, `Versicherung Fahrzeug ${label}`, y, pageWidth);
    y = twoColumns(
      doc,
      [
        ["Versicherungsgesellschaft", vs.gesellschaftName],
        ["Adresse", vs.gesellschaftAdresse],
        ["Telefon", vs.gesellschaftTelefon],
        ["Versicherungsscheinnummer", vs.versicherungsscheinnummer],
        ["Grüne Karte Nummer", vs.grueneKarteNummer],
        ["Grüne Karte gültig bis", vs.grueneKarteGueltigBis],
        ["Kaskoversicherung", vs.kaskoversicherung ? "Ja" : "Nein"],
        ["Kasko-Gesellschaft", vs.kaskoGesellschaft],
        ["Kasko-Scheinnummer", vs.kaskoScheinnummer],
      ],
      y,
      pageWidth
    );

    y = checkNewPage(doc, y, pageHeight);
    y = addSectionTitle(doc, `Manöver / Umstände Fahrzeug ${label}`, y, pageWidth);
    doc.setFontSize(8);
    let mvY = y;
    let col = 0;
    const colW2 = (pageWidth - 28) / 2;
    (Object.keys(manoverLabels) as (keyof typeof manoverLabels)[]).forEach((key) => {
      if (mv[key]) {
        const xPos = 14 + col * (colW2 + 2);
        mvY = checkNewPage(doc, mvY, pageHeight);
        doc.setFontSize(8);
        doc.setTextColor(30, 64, 175);
        doc.text("✓", xPos, mvY);
        doc.setTextColor(0, 0, 0);
        const labelWrapped = doc.splitTextToSize(manoverLabels[key], colW2 - 7);
        doc.text(labelWrapped, xPos + 5, mvY);
        const rowH = Math.max(labelWrapped.length * 4.5, 5);
        col++;
        if (col >= 2) {
          col = 0;
          mvY += rowH;
          mvY = checkNewPage(doc, mvY, pageHeight);
        }
      }
    });
    if (col > 0) mvY += 5;
    if (mv.anderesManover) {
      mvY = checkNewPage(doc, mvY, pageHeight);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      const sonstigesLines = doc.splitTextToSize(`Sonstiges: ${mv.anderesManover}`, pageWidth - 28);
      doc.text(sonstigesLines, 14, mvY);
      mvY += sonstigesLines.length * 4.5 + 2;
    }
    y = mvY + 2;

    y = checkNewPage(doc, y, pageHeight);
    y = addField(doc, `Sichtbare Schäden Fahrzeug ${label}`, schaden, 14, y, pageWidth - 28);
    y = addField(doc, `Bemerkungen Fahrzeug ${label}`, bemerkung, 14, y, pageWidth - 28);
  }

  // ── Skizze ──────────────────────────────────────────────────────────────────
  if (bericht.skizze) {
    y = checkNewPage(doc, y + 4, pageHeight, 80);
    y = addSectionTitle(doc, "4. Skizze des Unfalls", y, pageWidth);
    const skizzeW = pageWidth - 28;
    const skizzeH = 80;
    try {
      doc.addImage(bericht.skizze, "PNG", 14, y, skizzeW, skizzeH);
      y += skizzeH + 4;
    } catch {
      // ignore image errors
    }
  }

   // ── Fotos ─────────────────────────────────────────────────────────────────
   if (bericht.bilder.length > 0) {
     doc.addPage();
     y = 14;
     y = addSectionTitle(doc, "5. Fotos", y, pageWidth);

     const maxW = (pageWidth - 32) / 2; // max width for image
     let col = 0;
     let rowY = y; // current row's starting y
     let maxHeightInRow = 0; // track max height in current row for layout

     for (const bild of bericht.bilder) {
       try {
         // Load image to get its dimensions
         const img = new Image();
         await new Promise((resolve, reject) => {
           img.onload = resolve;
           img.onerror = reject;
           img.src = bild.dataUrl;
         });
         const { width: imgWidth, height: imgHeight } = img;

         // Calculate scale to fit within maxW while preserving aspect ratio
         // We'll also limit height to a reasonable max (e.g., 80mm) but let's compute based on maxW and a maxH
         const maxH = 80; // max height for image
         let scale = Math.min(maxW / imgWidth, maxH / imgHeight);
         // If scale > 1, we don't want to enlarge too much, cap at 1.5 maybe?
         if (scale > 1.5) scale = 1.5;
         const displayWidth = imgWidth * scale;
         const displayHeight = imgHeight * scale;

         const xPos = 14 + col * (maxW + 4); // column position

         // Check if we need a new page before drawing this image
         // We need space for image + caption gap + caption text + bottom margin
         // We'll compute caption lines after we have displayWidth
         const typeLabel =
           bild.type === "fahrzeugA"
             ? "Fahrzeug A"
             : bild.type === "fahrzeugB"
             ? "Fahrzeug B"
             : bild.type === "unfall"
             ? "Unfall"
             : "Sonstiges";
         const caption = `${typeLabel}${bild.beschreibung ? `: ${bild.beschreibung}` : ""}`;
         const captionLines = doc.splitTextToSize(caption, displayWidth);
         const captionHeight = Math.max(captionLines.length * 3.5, 3.5);
         const neededHeight = displayHeight + 4 + captionHeight + 4; // 4px gap above and below caption

         // Check if adding this image would exceed page height
         y = checkNewPage(doc, rowY, pageHeight, neededHeight);

         // If we moved to a new page, reset rowY and maxHeightInRow
         if (y !== rowY) {
           rowY = y;
           maxHeightInRow = 0;
         }

         // Draw image
         doc.addImage(bild.dataUrl, "JPEG", xPos, y, displayWidth, displayHeight);

         // Draw caption below image
         doc.setFontSize(7);
         doc.setTextColor(80, 80, 80);
         doc.text(captionLines, xPos, y + displayHeight + 4);
         doc.setTextColor(0, 0, 0);

         // Update max height in row for row layout
         const itemHeight = displayHeight + 4 + captionHeight + 4;
         if (itemHeight > maxHeightInRow) maxHeightInRow = itemHeight;

         col++;
         if (col >= 2) {
           col = 0;
           // Move to next row
           rowY += maxHeightInRow;
           maxHeightInRow = 0;
           y = rowY;
         }
       } catch {
         // skip broken images
       }
     }
   }

  // ── Unterschriften ──────────────────────────────────────────────────────────
  doc.addPage();
  y = 20;
  y = addSectionTitle(doc, "6. Unterschriften", y, pageWidth);
  y += 6;
  doc.setFontSize(8);
  doc.text("Fahrzeug A – Unterschrift des Fahrers:", 14, y);
  doc.text("Fahrzeug B – Unterschrift des Fahrers:", pageWidth / 2 + 4, y);
  y += 4;
  doc.setDrawColor(100, 100, 100);
  doc.rect(14, y, (pageWidth - 32) / 2, 30);
  doc.rect(pageWidth / 2 + 4, y, (pageWidth - 32) / 2, 30);
  y += 36;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Durch Unterzeichnung bestätigen beide Fahrer die Richtigkeit der obigen Angaben.",
    pageWidth / 2,
    y,
    { align: "center" }
  );
  doc.text(
    "Dieser Bericht stellt kein Schuldanerkenntnis dar.",
    pageWidth / 2,
    y + 4,
    { align: "center" }
  );

  // ── Footer on every page ────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Europäischer Unfallbericht – Seite ${i} von ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: "center" }
    );
  }

  doc.save("unfallbericht.pdf");
}
