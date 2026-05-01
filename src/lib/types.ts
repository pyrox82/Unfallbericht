export interface FahrzeugDaten {
  kennzeichen: string;
  markeModell: string;
  baujahr: string;
  fahrgestellnummer: string;
  fahrerName: string;
  fahrerVorname: string;
  fahrerGeburtsdatum: string;
  fahrerAdresse: string;
  fahrerPLZOrt: string;
  fahrerLand: string;
  fahrerTelefon: string;
  fahrerFuehrerscheinnummer: string;
  fahrerFuehrerscheinklasse: string;
  fahrerFuehrerscheinAusstelldatum: string;
  eigentuemerName: string;
  eigentuemerAdresse: string;
  eigentuemerPLZOrt: string;
  eigentuemerLand: string;
  eigentuemerTelefon: string;
}

export interface VersicherungDaten {
  gesellschaftName: string;
  gesellschaftAdresse: string;
  gesellschaftTelefon: string;
  versicherungsscheinnummer: string;
  grueneKarteNummer: string;
  grueneKarteGueltigBis: string;
  kaskoversicherung: boolean;
  kaskoGesellschaft: string;
  kaskoScheinnummer: string;
}

export interface SchadenBereich {
  vornLinks: boolean;
  vornMitte: boolean;
  vornRechts: boolean;
  linksVorne: boolean;
  linksHinten: boolean;
  hintenLinks: boolean;
  hintenMitte: boolean;
  hintenRechts: boolean;
  rechtsVorne: boolean;
  rechtsHinten: boolean;
  dach: boolean;
  fahrertuer: boolean;
  beifahrertuer: boolean;
}

export interface ManoverCheckboxen {
  geparkt: boolean;
  parkenVerlassen: boolean;
  einparken: boolean;
  ausGarageAusfahren: boolean;
  aufParkplatz: boolean;
  kreisverkehr: boolean;
  abbiegenLinks: boolean;
  abbiegenRechts: boolean;
  ueberholenVorbeifahren: boolean;
  spurwechselLinks: boolean;
  spurwechselRechts: boolean;
  rechtsHintenAufgefahren: boolean;
  gleicheRichtungVerschiedeneSpuren: boolean;
  gegenfahrbahn: boolean;
  rechtsVonRechts: boolean;
  rueckwaerts: boolean;
  nichtBeachtenVorfahrt: boolean;
  anderesManover: string;
}

export interface UnfallBericht {
  // Unfall Allgemein
  unfallDatum: string;
  unfallUhrzeit: string;
  unfallOrt: string;
  unfallLand: string;
  verletzte: boolean;
  sachschadenAnDritten: boolean;
  zeugenVorhanden: boolean;
  skizze: string; // base64 canvas drawing

  // Zeugen
  zeuge1Name: string;
  zeuge1Adresse: string;
  zeuge1Telefon: string;
  zeuge2Name: string;
  zeuge2Adresse: string;
  zeuge2Telefon: string;

  // Fahrzeug A
  fahrzeugA: FahrzeugDaten;
  versicherungA: VersicherungDaten;
  manoverA: ManoverCheckboxen;
  manoverAnzahlA: number;
  schadenA: string; // Beschreibung sichtbarer Schäden
  bemerkungA: string;

  // Fahrzeug B
  fahrzeugB: FahrzeugDaten;
  versicherungB: VersicherungDaten;
  manoverB: ManoverCheckboxen;
  manoverAnzahlB: number;
  schadenB: string;
  bemerkungB: string;

  // Bilder
  bilder: UploadedImage[];
}

export interface UploadedImage {
  id: string;
  name: string;
  dataUrl: string;
  type: "fahrzeugA" | "fahrzeugB" | "unfall" | "sonstiges";
  beschreibung: string;
  width: number;
  height: number;
}

export const defaultManover = (): ManoverCheckboxen => ({
  geparkt: false,
  parkenVerlassen: false,
  einparken: false,
  ausGarageAusfahren: false,
  aufParkplatz: false,
  kreisverkehr: false,
  abbiegenLinks: false,
  abbiegenRechts: false,
  ueberholenVorbeifahren: false,
  spurwechselLinks: false,
  spurwechselRechts: false,
  rechtsHintenAufgefahren: false,
  gleicheRichtungVerschiedeneSpuren: false,
  gegenfahrbahn: false,
  rechtsVonRechts: false,
  rueckwaerts: false,
  nichtBeachtenVorfahrt: false,
  anderesManover: "",
});

export const defaultFahrzeug = (): FahrzeugDaten => ({
  kennzeichen: "",
  markeModell: "",
  baujahr: "",
  fahrgestellnummer: "",
  fahrerName: "",
  fahrerVorname: "",
  fahrerGeburtsdatum: "",
  fahrerAdresse: "",
  fahrerPLZOrt: "",
  fahrerLand: "",
  fahrerTelefon: "",
  fahrerFuehrerscheinnummer: "",
  fahrerFuehrerscheinklasse: "",
  fahrerFuehrerscheinAusstelldatum: "",
  eigentuemerName: "",
  eigentuemerAdresse: "",
  eigentuemerPLZOrt: "",
  eigentuemerLand: "",
  eigentuemerTelefon: "",
});

export const defaultVersicherung = (): VersicherungDaten => ({
  gesellschaftName: "",
  gesellschaftAdresse: "",
  gesellschaftTelefon: "",
  versicherungsscheinnummer: "",
  grueneKarteNummer: "",
  grueneKarteGueltigBis: "",
  kaskoversicherung: false,
  kaskoGesellschaft: "",
  kaskoScheinnummer: "",
});

export const defaultBericht = (): UnfallBericht => ({
  unfallDatum: "",
  unfallUhrzeit: "",
  unfallOrt: "",
  unfallLand: "",
  verletzte: false,
  sachschadenAnDritten: false,
  zeugenVorhanden: false,
  skizze: "",
  zeuge1Name: "",
  zeuge1Adresse: "",
  zeuge1Telefon: "",
  zeuge2Name: "",
  zeuge2Adresse: "",
  zeuge2Telefon: "",
  fahrzeugA: defaultFahrzeug(),
  versicherungA: defaultVersicherung(),
  manoverA: defaultManover(),
  manoverAnzahlA: 0,
  schadenA: "",
  bemerkungA: "",
  fahrzeugB: defaultFahrzeug(),
  versicherungB: defaultVersicherung(),
  manoverB: defaultManover(),
  manoverAnzahlB: 0,
  schadenB: "",
  bemerkungB: "",
  bilder: [],
});
