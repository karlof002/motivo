# 📱 Motivo – Deine tägliche Motivation

**Motivo** ist eine minimalistische, offlinefähige Motivations-App, die dir täglich inspirierende Zitate liefert und dich dazu anregt, deine Gedanken zu reflektieren und persönliche Ziele zu setzen. Entwickelt mit React Native und Expo.

---

## 🚀 Features

- 🧠 **Tägliches Zitat** – Erhalte täglich neue, inspirierende Inhalte
- 📝 **Offline-Journal** – Schreibe Gedanken und Reflexionen nieder (lokal gespeichert)
- 🎯 **Ziel-Tracker** – Setze dir persönliche Wochenziele und verfolge deinen Fortschritt
- 😊 **Mood-Tracker** *(optional)* – Dokumentiere deine Stimmung
- 🌙 **Dark Mode & Themes** – Passe die App deinem Stil an
- 🔒 **Vollständig offline nutzbar** – Keine Internetverbindung erforderlich

---

## 🛠️ Tech Stack

| Technologie     | Beschreibung                      |
|----------------|------------------------------------|
| React Native    | Cross-Platform Mobile Framework   |
| Expo            | Toolchain für schnelles Setup     |
| TypeScript      | Typsichere Entwicklung            |
| React Navigation| Navigation zwischen Screens       |
| AsyncStorage / SQLite | Lokale Datenspeicherung         |

---

## 📦 Installation

### Voraussetzungen
- Node.js ≥ 18
- Expo CLI (falls nicht vorhanden: `npm install -g expo-cli`)

### Projekt starten

```bash
npx create-expo-app motivo --template tabs@49
cd motivo
npx expo start
