# Game Design Document

## Game Overview

Interaktives Webspiel zum Thema IT-Sicherhiet und Datenschutz.
Es soll einen Lern und Aufklärungseffekt haben.
Ich brauche einen Gamification Ansatz , also Spielerische Elmente, wie Rangliste, Erfahrungspunkte, Quests etc...

### Spielkonzept

Lernspiel zum Erlernen von grundlegenden Datenschutz Konzepten. Es soll ein Digitaler Lernfragebogen werden der mit interaktivität das Thema vermitteln soll. Es soll aufbauend gelernt werden, das heißt zuerst soll mit Lerntexten das Thema näher gebracht werden. Daraufhin wird ein Quiz freigeschaltet, welches den Wissensstand abfragt. Wenn das Quiz erfolgreich bestanden ist wird ein Point and Click Abenteuer freigeschaltet. 

Über das Quiz und das Abenteuer können Punkte für eine Rangliste erarbeitet werden.

### Spielertypen

nach Richard A. Bartle

#### Killer

wird angesprochen durch Punkte sammeln und sich Vergleichen in der Rangliste

#### Achiever

werden motiviert durch Belohnungen (Sound und visuelle Effekte beim Lösen von Aufgaben)

#### Socializer

wird motiviert durch ein Community Gefühl (Sociale Stats -> wie haben die anderen abgeschnitten, evtl wie die verschiedenen Teams in einem Unternehmen abgeschnitten haben)

#### Explorer

wird durch neue Spielweisen motiviert (viele Wimmelbilder)

### Gameplay & Mechanik

1. Erklärtexte

    Kurze prägnante Lehrtexte
    Ein visueller Fortschrittsbalekn zeigt den Lernfortschritt an.
    Mechanik: Lesen und Klicken
    Herausforderung: spannende Texte damit der Lernende seine Motivation/Aufmerksamkeit nicht verliert.

2. Quiz

    Schaltet sich frei nach dem man die Erklärtexte gelesen hat.
    Multiple Choice fragen
    Alle Fragen müssen richtig beantwortet werden.
    Generiert Punkte für die Rangliste. Je nachdem wie schnell man die Frage richtig beantwortet hat.
    Schaltet das Abentuer frei.

3. Point and Click Abenteuer

    2 Level
    Schwierigkeit erhöht sich mit der Anzahl an Point die man finden muss.
    Suche nach Datenschutz und IT-Sicherheits Risiken
    Anwendung des Erlernten.
    Punkte werden nach der Schnelligkeit vergeben
    Punkte werden beim Flaschklicken verloren



#### Gamification

- Punktesystem
- Rangliste
- Timer
- Fortschrittsbalken
- Progressives Freischalten (denke an Levels)


### Technische Schulden

- Komponenten sind nur Views, für bessere Wartbarkeit und Nutzung sollte kleinere Komponenten geschrieben werden.
- Bilder einfügen im Lernbereich
- Kein klare Trennung von Business Logic, state Management und Darstellung -> Monolitische Komponenten auflösen, pinia stores einbauen, styles woanders definieren und magic numbers entfernen.
- Types auslagern für bessere Wartbarkeit, Safety und Erweiterbarkeit
- localStorage data validieren , allgemeine Sicherheitsaspekte einfügen (XSS, etc. ...)
- accessibility
- Tests einbauen
- UI/UX

### Bugs

- Timer im Abenteuer läuft weiter bei abgeschlossenen Abenteuer
- Punkte werden nicht in der NavBar angezeigt

### Nicht umgesetzt

- Locksystem -  Die Spielenden sollten nicht direkt das Quiz und Abenteuer starten können, sondern es aufbauend freischalten. Lernen -> Quiz -> Abenteuer
- Mobile Responsiveness
- Audio Feedback , zb für das abschließen von Modulen.
- Punkteverlust beim Falschklicken im Abenteuer
- Soziale Elemente
- Wimmelbilder erstellen/einfügen