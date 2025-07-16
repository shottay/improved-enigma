# 🔥 FLAME - IT-Sicherheit & Datenschutz Lernspiel

Ein interaktives Webspiel zum Erlernen von IT-Sicherheit und Datenschutz-Grundlagen mit Gamification-Elementen.

---

## 🚀 Quick Start

### Voraussetzungen
- **Node.js** (v16+)
- **npm** Package Manager
- **Git**

### Installation

```bash
# 1. Repository klonen
git clone <repository-url>
cd /path/to/yourProject

# 2. Dependencies installieren
npm install

# 3. Entwicklungsserver starten
npm run dev
```

🎮 **Das Spiel ist dann unter `http://localhost:5173` verfügbar!**

---

## 🎯 Game Design Document

### 🎲 Spielkonzept

**FLAME** ist ein aufbauendes Lernspiel mit drei Modulen:

```
📚 Lerntexte → 🧠 Quiz → 🔍 Point-and-Click Abenteuer
```

- **Ziel**: Grundlegende Datenschutz und IT-Sicherheits-Konzepte spielerisch vermitteln
- **Methode**: Interaktiver digitaler Lernfragebogen mit Gamification
- **Progression**: Aufbauendes Lernsystem mit Belohnungen

---

## 🎮 Gameplay & Mechanik

### 1. 📖 Erklärtexte
- ✅ Kurze, prägnante Lehrtexte
- 📊 Visueller Fortschrittsbalken
- 🎯 **Mechanik**: Lesen und Klicken
- 🔥 **Challenge**: Spannende Texte für hohe Motivation

### 2. 🧠 Quiz
- 🔓 Freischaltung nach Lerntexten
- ❓ Multiple Choice Fragen
- ✅ Alle Fragen müssen richtig beantwortet werden
- ⚡ Punkte basierend auf Geschwindigkeit
- 🎊 Schaltet das Abenteuer frei

### 3. 🔍 Point-and-Click Abenteuer
- 🏢 **2 Level** mit steigender Schwierigkeit
- 🎯 Suche nach Datenschutz- und IT-Sicherheitsrisiken
- ⏱️ Zeitbasierte Punktevergabe
- ❌ Punkteverlust bei Falschklicks
- 🧠 Anwendung des Erlernten

---

## 🏆 Gamification-Elemente

| Element | Beschreibung |
|---------|--------------|
| 🎯 **Punktesystem** | Sammle Punkte in Quiz & Abenteuer |
| 🏅 **Rangliste** | Vergleiche dich mit anderen Spielern |
| ⏱️ **Timer** | Zeitdruck für zusätzliche Herausforderung |
| 📊 **Fortschrittsbalken** | Visueller Lernfortschritt |
| 🔓 **Progressive Freischaltung** | Level-System mit Belohnungen |

---

## 👥 Spielertypen (nach Richard A. Bartle)

### 🗡️ Killer
**Motivation**: Wettbewerb und Dominanz
- ✅ Punkte sammeln und vergleichen
- ✅ Ranglisten-Position

### 🏆 Achiever  
**Motivation**: Erfolge und Belohnungen
- 🔄 Sound- und visuelle Effekte (geplant)
- ✅ Achievement-System

### 👥 Socializer
**Motivation**: Community und soziale Interaktion
- 🔄 Soziale Stats (geplant)
- 🔄 Team-Vergleiche (geplant)

### 🗺️ Explorer
**Motivation**: Entdeckung und Abwechslung
- ✅ Point-and-Click Mechanik
- 🔄 Verschiedene Wimmelbilder (geplant)

---


## ⚠️ Bekannte Issues

### 🐛 Bugs
- [ ] Timer läuft weiter bei abgeschlossenem Abenteuer
- [ ] Punkte werden nicht in der NavBar angezeigt

### 🔧 Technische Schulden
- [ ] Monolithische Komponenten → kleinere Komponenten
- [ ] Business Logic von UI trennen
- [ ] Pinia Store einbauen
- [ ] Types auslagern
- [ ] localStorage Validierung
- [ ] Tests implementieren
- [ ] Accessibility verbessern

### 📋 Nicht umgesetzt
- [ ] **Lock-System** (Lernen → Quiz → Abenteuer)
- [ ] **Mobile Responsiveness**
- [ ] **Audio-Feedback**
- [ ] **Punkteverlust** bei Falschklicks
- [ ] **Soziale Elemente**
- [ ] **Wimmelbilder** erstellen

---



**🎮 Viel Spaß beim Lernen von IT-Sicherheit und Datenschutz!**