# Unfallbericht

Eine moderne Webanwendung zum Erstellen umfassender KFZ-Unfallberichte.

## 🎯 Übersicht

**Unfallbericht** ist eine benutzerfreundliche Webapp, die den Prozess der Unfallberichterstattung vereinfacht. Die Anwendung erfasst alle relevanten Unfalldetails, ermöglicht den Upload von Schadensfotos und generiert automatisch ein professionelles PDF-Dokument zur Dokumentation und Versicherungsabwicklung.

## ✨ Features

- 📋 **Umfassendes Formular** - Erfasst alle wichtigen Unfalldetails
- 📸 **Fotoupload** - Laden Sie Schadensfotos direkt in die Anwendung hoch
- 📄 **PDF-Generierung** - Automatische Erstellung eines professionellen PDF-Berichts
- 🎨 **Modernes Design** - Responsive Benutzeroberfläche mit Tailwind CSS
- ⚡ **Performance** - Built mit Next.js für optimale Geschwindigkeit
- 🔒 **TypeScript** - Vollständige Typ-Sicherheit für zuverlässigen Code

## 🛠️ Technologie-Stack

- **Frontend-Framework**: [Next.js](https://nextjs.org/) 16.1.3
- **UI-Framework**: [React](https://react.dev/) 19.2.3
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.1.17
- **PDF-Generierung**: [jsPDF](https://github.com/parallax/jsPDF) 4.2.1
- **Canvas-Rendering**: [html2canvas](https://html2canvas.hertzen.com/) 1.4.1
- **Sprache**: [TypeScript](https://www.typescriptlang.org/) 5.9.3

## 📦 Installation

### Voraussetzungen

- Node.js 18+ oder höher
- npm oder yarn Package Manager

### Setup

1. **Repository klonen**
   ```bash
   git clone https://github.com/pyrox82/Unfallbericht.git
   cd Unfallbericht
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

   Die Anwendung ist nun verfügbar unter: `http://localhost:3000`

## 🚀 Verwendung

### Unfallbericht erstellen

1. Öffnen Sie die Anwendung im Browser
2. Füllen Sie das Unfallformular mit allen relevanten Informationen aus
3. Laden Sie Fotos der Unfallstelle und Schäden hoch
4. Klicken Sie auf "PDF generieren"
5. Der Bericht wird automatisch als PDF heruntergeladen

### Verfügbare Felder

Das Formular erfasst typischerweise:
- Datum und Uhrzeit des Unfalls
- Ort und Straße
- Beteiligte Fahrzeuge und Fahrer
- Schadensumfang
- Zeugenaussagen
- Fotodokumentation

## 📝 Verfügbare Scripts

```bash
# Entwicklungsserver starten
npm run dev

# Produktions-Build erstellen
npm run build

# Produktionsserver starten
npm run start

# ESLint Code-Qualitätsprüfung
npm run lint

# TypeScript Type-Checking
npm run typecheck
```

## 📁 Projektstruktur

```
Unfallbericht/
├── app/                    # Next.js App-Verzeichnis
├── components/             # React-Komponenten
├── public/                 # Statische Assets
├── styles/                 # Global Styles
├── package.json            # Projekt-Dependencies
├── tsconfig.json           # TypeScript Konfiguration
└── README.md               # Diese Datei
```

## 🎨 Anpassung

### Design anpassen

Das Projekt nutzt Tailwind CSS für Styling. Konfigurieren Sie das Design in:
- `tailwind.config.js` - Tailwind Konfiguration
- CSS-Module in den Komponenten

### PDF-Layout anpassen

Das PDF-Layout kann in den entsprechenden Komponenten angepasst werden. Verwenden Sie `jsPDF` und `html2canvas` für Custom-Layouts.

## 🐛 Troubleshooting

### Port 3000 ist bereits in Verwendung

```bash
npm run dev -- -p 3001
```

### Module nicht gefunden

```bash
# Cache löschen und neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Buildprobleme

```bash
npm run typecheck
npm run lint
```

## 🤝 Beitragen

Beiträge sind willkommen! Falls Sie Verbesserungen oder Bugfixes haben:

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## 📄 Lizenz

Dieses Projekt ist privat. Alle Rechte sind dem Repositoriumbesitzer vorbehalten.

## 📧 Kontakt

**Autor**: pyrox82  
**Repository**: [pyrox82/Unfallbericht](https://github.com/pyrox82/Unfallbericht)

---

Erstellt mit ❤️ für bessere Unfallberichterstattung