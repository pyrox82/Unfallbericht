import jsPDF from "jspdf";
import type { UnfallBericht, ManoverCheckboxen } from "./types";
import { t, type Sprache } from "./i18n";

const manoverKeyMap: Record<keyof Omit<ManoverCheckboxen, "anderesManover">, string> = {
  geparkt: "manoverGeparkt",
  parkenVerlassen: "manoverParkenVerlassen",
  einparken: "manoverEinparken",
  ausGarageAusfahren: "manoverAusGarage",
  aufParkplatz: "manoverAufParkplatz",
  kreisverkehr: "manoverKreisverkehr",
  abbiegenLinks: "manoverAbbiegenLinks",
  abbiegenRechts: "manoverAbbiegenRechts",
  ueberholenVorbeifahren: "manoverUeberholen",
  spurwechselLinks: "manoverSpurwechselLinks",
  spurwechselRechts: "manoverSpurwechselRechts",
  rechtsHintenAufgefahren: "manoverHintenAufgefahren",
  gleicheRichtungVerschiedeneSpuren: "manoverGleicheRichtung",
  gegenfahrbahn: "manoverGegenfahrbahn",
  rechtsVonRechts: "manoverRechtsVonRechts",
  rueckwaerts: "manoverRueckwaerts",
  nichtBeachtenVorfahrt: "manoverVorfahrt",
};

const manoverKeys = Object.keys(manoverKeyMap) as (keyof typeof manoverKeyMap)[];

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

function calculateFieldHeight(
  doc: jsPDF,
  label: string,
  value: string,
  width: number
): number {
  doc.setFontSize(8);
  const labelLines = doc.splitTextToSize(label, width - 4);
  const labelH = labelLines.length * 4;
  const lines = doc.splitTextToSize(value || "—", width - 4);
  const valueH = Math.max(lines.length * 4.5, 4.5);
  const totalH = labelH + valueH;
  return totalH + 6;
}

function drawField(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number
): void {
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
}

function addField(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  pageHeight?: number
): number {
  const height = calculateFieldHeight(doc, label, value, width);
  if (pageHeight && y + height > pageHeight - 30) {
    doc.addPage();
    y = 20;
  }
  drawField(doc, label, value, x, y, width);
  return y + height;
}

function twoColumns(
  doc: jsPDF,
  fields: [string, string][],
  startY: number,
  pageWidth: number,
  pageHeight?: number
): number {
  const colW = (pageWidth - 28) / 2;
  let leftY = startY;
  let rightY = startY;

  for (let i = 0; i < fields.length; i += 2) {
    const [leftLabel, leftValue] = fields[i];
    const rightField = fields[i + 1];

    const leftHeight = calculateFieldHeight(doc, leftLabel, leftValue, colW);
    const rightHeight = rightField
      ? calculateFieldHeight(doc, rightField[0], rightField[1], colW)
      : 0;
    const neededHeight = Math.max(leftHeight, rightHeight);

    if (
      pageHeight &&
      (leftY + neededHeight > pageHeight - 30 || rightY + neededHeight > pageHeight - 30)
    ) {
      doc.addPage();
      leftY = 20;
      rightY = 20;
    }

    drawField(doc, leftLabel, leftValue, 14, leftY, colW);
    leftY += leftHeight;

    if (rightField) {
      drawField(doc, rightField[0], rightField[1], 14 + colW + 2, rightY, colW);
      rightY += rightHeight;
    }
  }

  return Math.max(leftY, rightY);
}

function checkNewPage(doc: jsPDF, y: number, pageHeight: number, margin = 80): number {
  if (y > pageHeight - margin) {
    doc.addPage();
    return 20;
  }
  return y;
}

export async function generateUnfallberichtPdf(bericht: UnfallBericht, lang: Sprache): Promise<void> {
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
  doc.text(t("appTitle", lang), pageWidth / 2, 10, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Constat Amiable d'Accident Automobile", pageWidth / 2, 17, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y = 28;

   // ── 1. Unfalldaten ──────────────────────────────────────────────────────────
   y = addSectionTitle(doc, t("pdfSectionUnfall", lang), y, pageWidth);
   y = twoColumns(
     doc,
     [
       [t("pdfDatum", lang), bericht.unfallDatum],
       [t("pdfUhrzeit", lang), bericht.unfallUhrzeit],
       [t("pdfUnfallort", lang), bericht.unfallOrt],
       [t("pdfLand", lang), bericht.unfallLand],
     ],
     y,
     pageWidth,
     pageHeight
   );
   y = checkNewPage(doc, y, pageHeight);

   const checks = [
     bericht.verletzte ? t("pdfVerletzteJa", lang) : t("pdfVerletzteNein", lang),
     bericht.sachschadenAnDritten ? t("pdfSachschadenJa", lang) : t("pdfSachschadenNein", lang),
     bericht.zeugenVorhanden ? t("pdfZeugenJa", lang) : t("pdfZeugenNein", lang),
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
    y = addSectionTitle(doc, t("pdfSectionZeugen", lang), y, pageWidth);
    y = twoColumns(
      doc,
      [
        [t("pdfNameZeuge1", lang), bericht.zeuge1Name],
        [t("pdfNameZeuge2", lang), bericht.zeuge2Name],
        [t("pdfAdresseZeuge1", lang), bericht.zeuge1Adresse],
        [t("pdfAdresseZeuge2", lang), bericht.zeuge2Adresse],
        [t("pdfTelefonZeuge1", lang), bericht.zeuge1Telefon],
        [t("pdfTelefonZeuge2", lang), bericht.zeuge2Telefon],
      ],
      y,
      pageWidth,
      pageHeight
    );
  }

  // ── Fahrzeug A & B ───────────────────────────────────────────────────────────
  const fahrzeuge: ["A" | "B", typeof bericht.fahrzeugA, typeof bericht.versicherungA, typeof bericht.manoverA, string, string][] = [
    ["A", bericht.fahrzeugA, bericht.versicherungA, bericht.manoverA, bericht.schadenA, bericht.bemerkungA],
    ["B", bericht.fahrzeugB, bericht.versicherungB, bericht.manoverB, bericht.schadenB, bericht.bemerkungB],
  ];

  for (const [label, fz, vs, mv, schaden, bemerkung] of fahrzeuge) {
    y = checkNewPage(doc, y, pageHeight);
    y = addSectionTitle(doc, t(label === "A" ? "pdfSectionFahrzeugA" : "pdfSectionFahrzeugB", lang), y, pageWidth);

    y = twoColumns(
      doc,
      [
        [t("labelKennzeichen", lang), fz.kennzeichen],
        [t("labelMarkeModell", lang), fz.markeModell],
        [t("labelBaujahr", lang), fz.baujahr],
        [t("labelFahrgestellnummer", lang), fz.fahrgestellnummer],
        [t("labelName", lang) + " (" + t("fahrer", lang) + ")", fz.fahrerName],
        [t("labelVorname", lang) + " (" + t("fahrer", lang) + ")", fz.fahrerVorname],
        [t("labelGeburtsdatum", lang), fz.fahrerGeburtsdatum],
        [t("labelAdresse", lang), fz.fahrerAdresse],
        [t("labelPLZOrt", lang), fz.fahrerPLZOrt],
        [t("labelLand", lang), fz.fahrerLand],
        [t("labelTelefon", lang), fz.fahrerTelefon],
        [t("labelFuehrerscheinnummer", lang), fz.fahrerFuehrerscheinnummer],
        [t("labelFuehrerscheinklasse", lang), fz.fahrerFuehrerscheinklasse],
        [t("labelAusstelldatum", lang), fz.fahrerFuehrerscheinAusstelldatum],
        [t("labelEigentuemerName", lang), fz.eigentuemerName],
        [t("labelEigentuemerAdresse", lang), fz.eigentuemerAdresse],
        [t("labelEigentuemerPLZOrt", lang), fz.eigentuemerPLZOrt],
        [t("labelEigentuemerLand", lang), fz.eigentuemerLand],
        [t("labelEigentuemerTelefon", lang), fz.eigentuemerTelefon],
      ],
      y,
      pageWidth,
      pageHeight
    );

    y = checkNewPage(doc, y, pageHeight);
    y = addSectionTitle(doc, t(label === "A" ? "pdfSectionVersicherungA" : "pdfSectionVersicherungB", lang), y, pageWidth);
    y = twoColumns(
      doc,
      [
        [t("labelVersicherungsgesellschaft", lang), vs.gesellschaftName],
        [t("labelGesellschaftAdresse", lang), vs.gesellschaftAdresse],
        [t("labelGesellschaftTelefon", lang), vs.gesellschaftTelefon],
        [t("labelVersicherungsscheinnummer", lang), vs.versicherungsscheinnummer],
        [t("labelGrueneKarteNummer", lang), vs.grueneKarteNummer],
        [t("labelGrueneKarteGueltig", lang), vs.grueneKarteGueltigBis],
        [t("pdfKaskoJa", lang), vs.kaskoversicherung ? "Ja" : "Nein"],
        [t("labelKaskoGesellschaft", lang), vs.kaskoGesellschaft],
        [t("labelKaskoScheinnummer", lang), vs.kaskoScheinnummer],
      ],
      y,
      pageWidth,
      pageHeight
    );

    y = checkNewPage(doc, y, pageHeight);
    y = addSectionTitle(doc, t(label === "A" ? "pdfSectionManoverA" : "pdfSectionManoverB", lang), y, pageWidth);
    doc.setFontSize(8);
    let mvY = y;
    let col = 0;
    const colW2 = (pageWidth - 28) / 2;
    manoverKeys.forEach((key) => {
      if (mv[key]) {
        const xPos = 14 + col * (colW2 + 2);
        mvY = checkNewPage(doc, mvY, pageHeight);
        doc.setFontSize(8);
        doc.setTextColor(30, 64, 175);
        doc.text("✓", xPos, mvY);
        doc.setTextColor(0, 0, 0);
        const labelWrapped = doc.splitTextToSize(t(manoverKeyMap[key], lang), colW2 - 7);
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
      const sonstigesLines = doc.splitTextToSize(`${t("pdfSonstiges", lang)}: ${mv.anderesManover}`, pageWidth - 28);
      doc.text(sonstigesLines, 14, mvY);
      mvY += sonstigesLines.length * 4.5 + 2;
    }
    y = mvY + 2;

    y = checkNewPage(doc, y, pageHeight);
    y = addField(doc, t(label === "A" ? "labelSchadenA" : "labelSchadenB", lang), schaden, 14, y, pageWidth - 28, pageHeight);
    y = addField(doc, t(label === "A" ? "labelBemerkungA" : "labelBemerkungB", lang), bemerkung, 14, y, pageWidth - 28, pageHeight);
  }

  // ── Skizze ──────────────────────────────────────────────────────────────────
  if (bericht.skizze) {
    y = checkNewPage(doc, y + 4, pageHeight, 80);
    y = addSectionTitle(doc, t("pdfSectionSkizze", lang), y, pageWidth);
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
      y = addSectionTitle(doc, t("pdfSectionFotos", lang), y, pageWidth);

      const maxW = (pageWidth - 32) / 2; // max width for image in a column
      const maxH = 80; // max height for image
      let col = 0;
      let rowY = y; // current row's starting y
      let maxHeightInRow = 0; // track max height in current row for layout

      for (const bild of bericht.bilder) {
        try {
          let displayWidth = Math.min(bild.width, maxW);
          const ratio = bild.height / bild.width;
          let displayHeight = displayWidth * ratio;

          // Cap height at maxH while preserving aspect ratio
          if (displayHeight > maxH) {
            displayHeight = maxH;
            const dw = displayHeight / ratio;
            displayWidth = dw;
          }

          const xPos = 14 + col * (maxW + 4);

          const typeLabel =
            bild.type === "fahrzeugA"
              ? t("fotoTypFahrzeugA", lang)
              : bild.type === "fahrzeugB"
              ? t("fotoTypFahrzeugB", lang)
              : bild.type === "unfall"
              ? t("fotoTypUnfall", lang)
              : t("fotoTypSonstiges", lang);
          const caption = `${typeLabel}${bild.beschreibung ? `: ${bild.beschreibung}` : ""}`;
          const captionLines = doc.splitTextToSize(caption, displayWidth);
          const captionHeight = Math.max(captionLines.length * 3.5, 3.5);
          const neededHeight = displayHeight + 4 + captionHeight + 4;

          y = checkNewPage(doc, rowY, pageHeight, neededHeight);

          if (y !== rowY) {
            rowY = y;
            maxHeightInRow = 0;
          }

          doc.addImage(bild.dataUrl, "JPEG", xPos, y, displayWidth, displayHeight);

          doc.setFontSize(7);
          doc.setTextColor(80, 80, 80);
          doc.text(captionLines, xPos, y + displayHeight + 4);
          doc.setTextColor(0, 0, 0);

          const itemHeight = displayHeight + 4 + captionHeight + 4;
          if (itemHeight > maxHeightInRow) maxHeightInRow = itemHeight;

          col++;
          if (col >= 2) {
            col = 0;
            rowY += maxHeightInRow;
            maxHeightInRow = 0;
            y = rowY;
          }
        } catch {
        }
      }
    }

  // ── Unterschriften ────────────────────────────────────────────────────────────
  doc.addPage();
  y = 20;
  y = addSectionTitle(doc, t("pdfSectionUnterschriften", lang), y, pageWidth);
  y += 6;
  doc.setFontSize(8);
  doc.text(t("pdfLabelUnterschriftA", lang), 14, y);
  doc.text(t("pdfLabelUnterschriftB", lang), pageWidth / 2 + 4, y);
  y += 4;
  doc.setDrawColor(100, 100, 100);
  const sigW = (pageWidth - 32) / 2;
  const sigH = 30;
  doc.rect(14, y, sigW, sigH);
  doc.rect(pageWidth / 2 + 4, y, sigW, sigH);

  if (bericht.unterschriftA) {
    try {
      doc.addImage(bericht.unterschriftA, "PNG", 14, y, sigW, sigH);
    } catch {
      // ignore image errors
    }
  }
  if (bericht.unterschriftB) {
    try {
      doc.addImage(bericht.unterschriftB, "PNG", pageWidth / 2 + 4, y, sigW, sigH);
    } catch {
      // ignore image errors
    }
  }

  y += 36;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    t("pdfUnterschriftText1", lang),
    pageWidth / 2,
    y,
    { align: "center" }
  );
  doc.text(
    t("pdfUnterschriftText2", lang),
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
      t("pdfFooter", lang, { i: String(i), totalPages: String(totalPages) }),
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
  }

  doc.save("unfallbericht.pdf");
}
