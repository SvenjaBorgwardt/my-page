# Kaleido Scroll-Demo: Konzept v2

**Projekt:** borgwardt.me, Kaleido-Sektion
**Status:** Inhaltlich finalisiert, gegen reale `index.html` abgeglichen, implementierungsreif
**Datum:** 2026-04-23 (Inhalt) · 2026-04-24 (Integration gegen `index.html` abgeglichen)
**Kontext:** Direkt innerhalb der bestehenden Kaleido-Section auf der Homepage. Der Erklaer-Text erklaert bereits WAS Kaleido tut. Die Demo ZEIGT es.
**Pflichtlektuere vor Implementierung:** Abschnitt "Integration in die bestehende Seite" weiter unten.

**Sprachregel (oberste Prioritaet):** Alle sichtbaren Demo-Texte sind durchgaengig Englisch, weil die Seite fuer englischsprachige Leser ausgelegt ist — Kontextzeilen, Schuelertext, Annotationen, Uebungen, Fortschrittszahlen, Labels, Abschluss-Zeilen. Verweise auf Deutsch als Thema sind erlaubt, solange sie in englischer Prosa stehen (z.B. der L1-Transfer-Hinweis in Frame 3: "Common pattern for German speakers. In German, 'Gruppe' can take a plural verb."). Was vermieden wird: deutsche Saetze, deutsche UI-Labels, deutsche Ueberschriften in der gerenderten Demo.

---

## Strategische Entscheidung

Die Demo ist KEIN separates Tool, keine extra Seite. Sie ist eine Scroll-Animation direkt auf der Homepage, eingebettet unter dem bestehenden Kaleido-Abschnitt. Der Besucher scrollt durch eine kuratierte, cinematische Version des Schueler-Feedbacks. Vergleichbar mit einer Apple-Produktseite: in 30 Sekunden versteht man das Konzept.

### Zielgruppe der Demo

Leute die Einstellungsentscheidungen treffen (Anthropic, Mistral, Tech-Unternehmen), die an dem Tag schon drei Portfolios gesehen haben. Sie geben 20 Sekunden. Ausserdem: AI-Community (Mistral-Community, Claude-Community), potenzielle Kollaborationspartner, Konferenz-Besucher die nach dem Talk googeln.

### Was die Demo beweisen muss

1. Das ist kein "Text in ChatGPT geworfen". Das ist ein durchdachtes System mit separaten Analyse-Dimensionen.
2. Das Feedback klingt nicht wie eine KI-Ausgabe. Es klingt wie eine Lehrerin die diesen konkreten Schueler kennt.
3. Die Uebungen sind nicht generisch. Sie sind auf den Fehler UND die Domaene (IT-Berufsschule) zugeschnitten.
4. Es funktioniert. Before/After beweist das visuell.
5. Das skaliert. 23 Schueler, jeder individuell, kein Datenverlust.

---

## Bestehender Kaleido-Text auf der Homepage (Referenz)

Dieser Text steht UEBER der Demo. Die Demo wiederholt nichts davon. Aber: manche Besucher lesen den Text nicht. Deshalb braucht jeder Frame eine eigene Mini-Kontextzeile.

> Kaleido is a tool for giving individual feedback on student writing. It came out of a frustration I had no answer for: with 240 students a week, proper individual feedback on written work was simply not possible. I started vibe coding in early 2025, and this was my first big project. It began as a simple pipeline and grew. I added plagiarism detection, student progress analytics, all the things that seemed useful in theory, before subtracting most of it again. What's left is a GDPR and EU AI Act compliant pipeline that gives individual feedback to my students and generates targeted exercises for the specific mistakes they make, so they can actually improve.
>
> Here's how it works. A student hands in their paper. Their name is stripped out locally and replaced with a code. An anonymisation agent removes every remaining personal detail from the text. A set of agents then analyses the work along separate dimensions: structure, evidence, language, coherence, grammar, content. A final agent writes the feedback, addressed to the student rather than about them. The output is an HTML page they can read on their phone, with a progress view that shows how their writing has developed over the year.
>
> The first time I handed back Kaleido feedback instead of the usual red-penned pages, something happened I hadn't seen before. Students came to me afterwards with questions about their own essays. Not about the mark. About the essay itself. They'd read the feedback because it was addressed to them, in language that treated them as the authors of something real, and they wanted to know more. They finally knew what to change to improve, instead of just seeing where they'd gone wrong.
>
> Kaleido works well for English and Economics because I trained the agents on my specific types of tasks. Publishing a version that fits other subjects is on my list.
>
> I called it Kaleido because a kaleidoscope turns the same fragments into a different pattern every time you look. That's what I want feedback to do.

---

## Integration in die bestehende Seite (PFLICHT-LESE vor Implementierung)

Diese Sektion wurde am 2026-04-24 gegen den realen Stand von `index.html` abgeglichen. Alles darunter bezieht sich auf die tatsaechliche Datei, nicht auf Vermutungen.

### Reale Seitenstruktur (Stand 2026-04-24)

Die Homepage ist eine einzige Datei: `/Users/svenja/Developer/my-page/index.html`. Inline-`<style>`-Block im `<head>` (Zeilen 8-276), Body darunter. Kein Build, kein Bundler. Genau ein externes Script: `scripts/effects.js` (`<script defer>`, Zeile 669).

**Relevante Sections und IDs auf der Seite (in Reihenfolge):**

| Element | Selektor | Zeile in index.html |
|---------|----------|---------------------|
| Sticky Nav | `header.topnav` | 281 |
| Masthead (Name + Foto) | `header.masthead` | 307 |
| Intro-Absaetze | `p.observation.reveal` (3 Stueck) | 323, 325, 329 |
| Trenner | `hr.hr-soft` | 333 |
| Abschnittstitel | `div.section-title.reveal` (Text: "Featured Work") | 336 |
| **Kaleido-Chapter** | `section.chapter#kaleido` | **339-400** |
| Trenner | `hr.hr-soft` | 402 |
| Compass-Chapter | `section.chapter#compass` | 405-452 |
| Trenner | `hr.hr-soft` | 454 |
| UTE-Chapter | `section.chapter#ute` | 457-525 |
| Abschnittstitel | `div.section-title.reveal` (Text: "Also Built") | 529 |
| Claudia | `section.small-project.reveal#claudia` | 531 |
| Investor Game | `section.small-project.reveal#investor-game` | 585 |
| Abschnittstitel | `div.section-title.reveal` (Text: "The Other Parts") | 652 |
| Other-Parts | `section.other-parts.reveal` | 654 |
| Footer | `footer.reveal` | 663 |

### Wo genau die Demo eingefuegt wird

Die Kaleido-Section endet auf Zeile 400 mit `</section>`. Unmittelbar darauf (Zeile 401 leer) folgt der Trenner `<hr class="hr-soft">` (Zeile 402), dann beginnt Compass.

**Innerer Aufbau der bestehenden Kaleido-Section (Zeilen 339-400):**

1. Zeilen 340-343: `header.chapter-head.reveal` mit `span.chapter-num` ("I.") und `h2.chapter-title` ("Kaleido")
2. Zeilen 345-351: vier `<p>`-Absaetze mit dem kompletten Kaleido-Text
3. Zeile 353: `<blockquote>` mit dem Kaleidoskop-Zitat
4. Zeilen 355-394: `<figure class="project-example reveal">` mit dem statischen SVG-Mockup der Feedback-Karte
5. Zeilen 396-399: `<div class="stack">` mit `Stack`/`Note` (Python · Mistral · HTML; EU-Jurisdiktion)

**Einfuegepunkt der Scroll-Demo:**

Die Demo wird INNERHALB der Kaleido-Section eingefuegt, direkt NACH dem `.stack`-Block (Zeile 399 `</div>`) und VOR dem schliessenden `</section>` (Zeile 400). Semantische Begruendung: die Demo ist ein Deep-Dive in Kaleido und gehoert zur Kaleido-Chapter. Der `.stack`-Block liest sich als kompakter Metadaten-Abschluss des Erklaer-Textes, und die Entry-Transition "See it work." ist der Pivot von "hier ist was es ist" zu "hier ist es in Aktion". Der bestehende `hr.hr-soft` auf Zeile 402 uebernimmt weiterhin den Uebergang Kaleido -> Compass und muss nicht angefasst werden.

**Container-Element der Demo:**

```html
<!-- Scroll-Demo: Kaleido in Aktion -->
<div class="kaleido-demo reveal" id="kaleido-demo" aria-labelledby="kaleido-demo-entry">
  ...
</div>
```

Wichtig: NICHT `<section>`, weil `<section>` innerhalb der bestehenden `section.chapter` semantische Verschachtelung bringen wuerde, die die bestehende Dokumentstruktur nicht erwartet. Ein `<div>` mit der Klasse `kaleido-demo` reicht. Die Klasse `reveal` wird mitgegeben fuer Konsistenz mit dem bestehenden Hook-Pattern (siehe unten).

### Breiten-Contract

Das umgebende `<main>` (Zeile 36 CSS) hat `max-width:820px; margin:0 auto; padding:56px 32px 140px`. Effektive Inhaltsbreite also `820px - 64px = 756px`. Die Demo muss sich an diese Breite halten, ausser ein einzelner Frame rechtfertigt explizit einen Full-Bleed-Break (`margin-left:calc(-50vw + 50%)`-Trick) — aktuell nicht vorgesehen, weil alle Frames Textkarten sind. Desktop-Layouts der Frames sind auf `max-width:756px` auszulegen, nicht auf 820.

### Design-Token-Abgleich (verifiziert gegen index.html Zeilen 10-19)

Die CSS-Variablen im bestehenden `<style>`-Block stimmen exakt mit der Tabelle in "Design-Anforderungen" weiter unten ueberein. Zusaetzlich bereits vorhandene, in der Demo ebenfalls nutzbare Werte:

- Body-Hintergrund hat ein festes `::before`-Overlay mit zwei radialen Gradienten in warmen Tinten (index.html Zeilen 29-34). Das Overlay liegt `position:fixed` mit `z-index:0`, alle Demo-Frames muessen `position:relative; z-index:2` bekommen (wie `<main>`), sonst verschwinden sie hinter dem Gradient nicht, sondern gehen mit ihm verloren.
- `html{scroll-behavior:smooth}` ist gesetzt (Zeile 21). Kein eigenes Smooth-Scroll-Polyfill noetig.
- Kein Lenis, kein GSAP, kein ScrollTrigger aktuell geladen. Der Upgrade-Plan in `docs/upgrade-plan.md` sieht diese Libraries vor, sie sind aber noch nicht im HTML.

### Visuelle Muster-Korrekturen

Zwei Werte in der Design-Token-Sektion weiter unten stimmen nicht exakt mit dem realen Stylesheet ueberein. Richtig ist:

| Muster | Konzept sagt | Real ist | Verbindlich |
|--------|--------------|----------|-------------|
| Bilderrahmen (`.project-example .frame`, Zeile 176-178) | `box-shadow:3px 3px 0 rgba(0,0,0,0.05)` | `box-shadow:3px 3px 0 rgba(0,0,0,0.04)` | `0.04` |
| Masthead-Fotorahmen (`.photo-frame`, Zeile 76-82) | nicht spezifiziert | `box-shadow:4px 4px 0 rgba(0,0,0,0.05)` | Referenz, nicht in Demo benutzen |
| Body line-height | `1.72` | `body` hat `1.7`, `p` hat `1.72` | Innerhalb der Demo: `1.72` fuer `<p>`-artige Textbloecke, das ist konsistent mit der Chapter-Prosa |

Verwende fuer Demo-Karten mit dem `paper-warm`-Hintergrund exakt die Bilderrahmen-Signatur: `border:1px solid var(--rule); background:var(--paper-warm); padding:20px; box-shadow:3px 3px 0 rgba(0,0,0,0.04);`. Das ist der vorhandene `.project-example .frame`-Look und sollte visuell wiederverwendet werden, nicht neu erfunden.

### Bestehende JS-Infrastruktur (`scripts/effects.js`)

Der Script existiert bereits (`scripts/effects.js`, am Ende von `<body>` mit `defer` geladen, Zeile 669). Er ist eine IIFE, ein Modul, kein Framework. Er bietet:

- **Reduced-Motion-Detection:** Setzt beim Laden `document.documentElement.dataset.motion = 'reduced' | 'full'`. Alle Demo-Animationen muessen dieses Attribut konsultieren, nicht `matchMedia` neu anfragen.
- **Low-Perf-Detection:** Setzt `document.documentElement.dataset.perf = 'low'`, wenn `navigator.hardwareConcurrency < 4` oder wenn beim initialen 800ms-rAF-Sampling mehr als 5 Frames > 20ms gedauert haben. Demo-Logik sollte bei `data-perf="low"` reduzierte Varianten zeigen (keine Stagger-Delays, keine Glow-Animationen, nur harte Fades).
- **Bereits initialisiert:** `initSplitFlap`, `initPhotoTilt`, `initPronounce`. Split-Flap und Photo-Tilt laufen nicht bei reduzierter Motion.

**JS-Integrations-Regel:**

Der gesamte Demo-Code wird in dieselbe Datei geschrieben: `scripts/effects.js`. Keine neue Datei anlegen. Eine eigene Funktion `initKaleidoDemo()` innerhalb der IIFE, aufgerufen parallel zu den bestehenden `init*`-Calls am Ende der IIFE. Lokale Helper bleiben innerhalb der IIFE-Scope.

```js
// am Ende der IIFE, nach den bestehenden init-Aufrufen
initKaleidoDemo();
```

Der DOM-Einstieg ist `document.getElementById('kaleido-demo')`. Wenn nicht vorhanden: stiller Return (wie die anderen Init-Funktionen es machen).

### CSS-Integrations-Regel

Neue CSS-Regeln werden in den bestehenden Inline-`<style>`-Block in `index.html` geschrieben (Zeilen 8-276). Kein externes Stylesheet. Neue Regeln ans Ende des Blocks, direkt vor `</style>` (Zeile 276), unter einem eigenen Kommentar-Banner:

```css
/* ========== KALEIDO SCROLL-DEMO ========== */
```

CSS-Variablen: ausschliesslich die bestehenden acht verwenden (`--paper`, `--paper-warm`, `--paper-deep`, `--ink`, `--ink-soft`, `--ink-dim`, `--rule`, `--rust`). Die Fehlerfarben fuer Grammar/Vocabulary/Content (siehe "Fehlerfarben" weiter unten) werden als neue CSS-Variablen im `:root` ergaenzt, nicht als Magic-Hex im Regelwerk verstreut. Vorschlag fuer Namen: `--err-grammar`, `--err-vocab`, `--err-content`. Exakte Hex-Werte sind offen und muessen im Browser getestet werden (siehe Offene Punkte).

### Reveal-Klasse — existierender Hook

Die Klasse `.reveal` ist auf der Seite auf vielen Elementen als Hook plaziert (Intro-Absaetze, Chapter-Heads, Project-Examples etc.). Im aktuellen CSS (Zeilen 214-215) ist sie als No-Op definiert: `opacity:1; transform:none`. Kommentar im CSS: "kept on HTML elements as hooks for a future agent; currently no-op so everything renders immediately."

**Strategie:** Die Demo-Container und Frame-Elemente bekommen ebenfalls `.reveal`. Wenn die Demo-JS-Logik Reveal-Animationen aktiviert, ueberschreibt sie `.reveal` LOKAL fuer die Demo-Elemente via spezifischeren Selektoren (z.B. `.kaleido-demo .reveal`) und setzt `opacity:0; transform:translateY(12px)` als Startzustand, dann per IntersectionObserver die Reveal-Transition. Die globale `.reveal`-No-Op-Regel bleibt unangetastet, damit der Rest der Seite weiterhin sofort rendert.

### Scroll-Technologie-Entscheidung (revidiert 2026-04-24)

**Korrektur einer frueheren Annahme:** Eine vorherige Fassung dieses Dokuments spezifizierte `IntersectionObserver` + CSS-Transitions ohne GSAP. Diese Entscheidung beruhte auf einem Missverstaendnis der Demo-Architektur — sie interpretierte die sechs Frames als sechs aufeinanderfolgende Viewport-Abschnitte. Das ist nicht die Demo. Die Demo besteht aus drei Szenen, von denen zwei gepinnt sind, und auf denen sich Inhalte waehrend des Scrolls transformieren (siehe "Architektur der Szenen" im Abschnitt "Frame-by-Frame Scroll-Sequenz"). Das ist die Apple-Produktseiten-Mechanik und braucht anderes Werkzeug.

**Verbindliche Entscheidung:** Die Demo verwendet **GSAP 3.12.5 + ScrollTrigger** von CDN. CDN-URLs siehe `docs/upgrade-plan.md` (sind dort ohnehin schon als Phase-D-Abhaengigkeit gelistet, die Demo nutzt sie mit).

**Mechanik pro gepinnter Szene:**

```js
ScrollTrigger.create({
  trigger: sceneEl,
  start: 'top top',
  end: '+=350%',          // Szene 1: ~350vh Scroll-Laenge, Szene 2: ~200vh
  pin: true,
  scrub: 1,               // sanftes Nachlaufen, nicht 1:1 an den Scroll
  onUpdate: self => {
    // self.progress: 0 .. 1
    // hier: Unterstreichungen einblenden, Annotation sliden, Uebung morphen
  }
});
```

Der `scrub`-Wert zwischen `0.5` und `1` gibt der Animation ein sanftes Nachlaufen. `scrub: true` oder `0` fuehlt sich ruckelig an, weil die Animation 1:1 an der Scroll-Position haengt.

**Kein GSAP-Timeline-Missbrauch fuer lineare Reihenfolgen.** Fuer die Beat-Uebergaenge innerhalb einer gepinnten Szene (z.B. "Unterstreichung #1 faded ein von Progress 0.12 bis 0.16") wird direkt im `onUpdate`-Callback auf `self.progress` gemappt, nicht eine `gsap.timeline()` mit `scrollTrigger`-Binding erzeugt. Das haelt die Mechanik nachvollziehbar: eine Zahl (Progress), eine Funktion, die den Zustand daraus ableitet.

**Bei `data-motion="reduced"`:** ScrollTrigger wird gar nicht registriert. Keine Pins, kein Scrub. Alle Szenen-Inhalte werden direkt im Endzustand gerendert: Schuelertext mit allen Unterstreichungen und Pills sichtbar, Annotation vollstaendig geoeffnet unter dem Text, Uebung im Defaultzustand, Before- und After-Paragraph beide sofort vollstaendig sichtbar, Grid komplett. Die Demo wird zur statischen, durch-lesbaren Dokumentation.

**Bei `data-perf="low"`:** Pins aktiv, aber `scrub: false` (step-basiert). Keine Stagger-Delays, Elemente erscheinen gleichzeitig innerhalb ihres Beat-Fensters. Glow-Effekte entfallen. Frame-5-Morph wird durch harten Wechsel zwischen Before und After ersetzt.

---

## Entry-Transition (NEU)

**Architektonischer Hinweis:** Seit der Revision auf gepinnte Szenen ist die Entry-Transition kein separater Viewport-Abschnitt mehr, sondern der erste Timeline-Beat von Szene 1 (Progress 0.00-0.10). Die inhaltlichen Regeln unten gelten weiter, aber technisch ist "See it work." das erste Element im gepinnten Container — es fadet aus, waehrend der Schuelertext einfadet. Kein separater 80vh-leerer-Block mehr.

Zwischen dem bestehenden Kaleido-Text und Frame 1 braucht es einen visuellen Bruch. Ohne diesen Moment ist unklar, wo der Text aufhoert und die Demo anfaengt.

**Umsetzung:** Grosszuegiger Whitespace (mindestens 80vh leer), dann eine einzelne Zeile in `--rust` (#9F3A1F), zentriert:

"See it work."

Darunter ein dezenter Scroll-Indicator (animierter Chevron oder Punkt). Beim Scrollen fadet die Zeile aus und Frame 1 fadet ein.

**Zweck:** Signal an den Besucher: "Jetzt wechselst du vom Lesen ins Erleben." Ohne diesen Moment wirkt Frame 1 wie eine Fortsetzung des Textes statt wie der Beginn einer Demo.

---

## Frame-by-Frame Scroll-Sequenz

### Dramaturgischer Bogen

Die sechs Frames zeichnen eine Skalierung in drei Richtungen: nach innen (ein Fehler, eine Erklaerung, eine Uebung), nach vorn (derselbe Schueler fuenf Monate spaeter), und in die Breite (eine von 23 Lernbiografien). Frame 1 ist Aufschlag, Frame 2 Diagnose, Frame 3 der Aha-Moment, Frame 4 das System-im-Kleinen, Frame 5 der Beweis ueber Zeit, Frame 6 der Pullback auf die Klasse. Jeder Frame traegt ein Stueck dieses Bogens. Wenn ein Frame seinen Beitrag nicht klar leistet, gehoert er ueberarbeitet oder herausgenommen.

Pro Frame ist eine "Takeaway"-Zeile formuliert — der eine Gedanke, den ein Besucher auch dann mitnimmt, wenn er sonst nichts erinnert. Die Takeaway ist der Prueftest fuer jedes Detail: traegt das Detail zur Takeaway bei, oder lenkt es davon ab?

### Architektur der Szenen (architektonisch verbindlich)

Die sechs Frames sind **keine** sechs aufeinanderfolgenden Viewport-Abschnitte. Sie sind Timeline-Beats auf drei Szenen, von denen zwei gepinnt sind. Der Schuelertext bleibt waehrend Scene 1 im Viewport stehen, und auf ihm transformiert sich der Inhalt. Das ist die Apple-/Anthropic-Mechanik. Jede frische Interpretation dieses Konzepts muss diese Architektur respektieren — ohne sie wird die Demo nicht, was sie sein soll.

**Szene 1 — gepinnte Lupe auf den Schuelertext (~350vh Scroll-Laenge)**

Der Schuelertext-Container pinnt am oberen Viewport-Rand (mit visuellem Headroom fuer den Dimensionen-Streifen und die Kontextzeile darueber). Waehrend der Nutzer durch die Pin-Zone scrollt, laeuft eine Progress-getriggerte Choreografie auf dem SELBEN Textblock:

| Progress | Beat |
|----------|------|
| 0.00 - 0.10 | Entry "See it work." fadet aus, Schuelertext + Kontextzeile fadet ein. (Ersetzt die frueher separate Entry-Transition.) |
| 0.10 - 0.35 | Unterstreichungen erscheinen sequenziell auf dem Text: zuerst Grammar-Gruppe (Fehler 1+2, staggered), dann Vocab-Gruppe (3+4, staggered), dann Content (5). Summary-Pills bauen sich synchron zu den Gruppen auf. (ehemals Frame 2) |
| 0.35 - 0.55 | "are"-Unterstreichung wird fokussiert (volle Opazitaet, andere Unterstreichungen dimmen auf ~0.4). Annotations-Panel slidet unter dem Text ein: Quick Fix oben, Erklaerung primaer mit L1-Transfer-Hinweis, Regel unten. (ehemals Frame 3) |
| 0.55 - 0.80 | Annotation slidet nach oben/aus. Uebungs-Sektion fadet an gleicher Stelle ein. Die drei Uebungen bleiben interaktiv bis zum Ende dieser Szene — ein korrekter Klick markiert die Option, ein falscher zeigt Inline-Feedback. (ehemals Frame 4) |
| 0.80 - 1.00 | Uebung fadet aus, Schuelertext scaled leicht (0.95) und fadet aus. Vorbereitung auf Szene 2. |

**Szene 2 — gepinnter In-Place-Morph (~200vh Scroll-Laenge)**

Der Before-Absatz pinnt. Waehrend des Scrolls schreibt er sich in place neu zur After-Version. Gemeinsame Woerter bleiben fix positioniert. Geaenderte Woerter faden an ihrer Position aus, neue faden ein, staggered in 200ms-Schritten von links nach rechts. Am Ende der Szene (Progress ~0.85) erscheinen die drei Fortschritts-Metriken kompakt unter dem Absatz: `Corrections 10 → 2 · Grade 4+ → 3+ · 5 submissions tracked`. (ehemals Frame 5)

Technisch: gemeinsame Woerter werden per Diff vorab ermittelt und als fixe `<span>`s gerendert. Die divergenten Woerter liegen uebereinander (Before mit Opacity, After absolut positioniert). Der Scroll-Progress mappt auf Opacity-Crossfades. Positionen muessen auf Sub-Pixel-Niveau stimmen, sonst springt das Layout.

**Szene 3 — normaler Scroll-Abschnitt (keine Pin)**

Die 4×6-Datenmatrix erscheint als finale Ansicht. Bei Viewport-Eintritt fadet das Grid ein (IntersectionObserver reicht hier, keine ScrollTrigger noetig). Kontextzeile "This was one student. There are 22 more." darueber. Der Abschluss-Satz und der "Explore the full example"-Link schliessen die Demo. (ehemals Frame 6)

**Dimensionen-Streifen (Kontext-Header der Demo)**

Sitzt als `position: sticky; top: 0` am Kopf des gesamten Demo-Containers. Zeigt `STRUCTURE · EVIDENCE · LANGUAGE · COHERENCE · GRAMMAR · CONTENT` in JetBrains Mono 10px, `--ink-dim`, Punkttrenner. Je nach laufendem Progress in Szene 1 leuchtet die gerade behandelte Dimension in `--rust` auf — Grammar bei Progress 0.10-0.20, Vocabulary bei 0.20-0.30, Content bei 0.30-0.35, Grammar bleibt hervorgehoben waehrend der Annotation (0.35-0.55) und der Uebung (0.55-0.80). Ist informational, nicht dekorativ. Bindet die Beats zu einem sichtbaren System.

**Die Frame-Spezifikationen darunter** ("### Frame 1: Der Schuelertext" usw.) liefern Inhalt und Details pro Beat. Sie sind NICHT als separate Viewport-Sections zu implementieren. Jede Frame-Sektion entspricht einem Timeline-Beat innerhalb der oben definierten Szenen.

### Frame 1: Der Schuelertext

**Kontextzeile (immer sichtbar oben im Frame):**
"240 students. One tool. Start here."

Die Kontextzeile greift die Zahl aus dem bestehenden Text auf, verankert sofort die Skala, und erzeugt Spannung. Der Besucher weiss: das ist nicht ein Einzelfall, das ist ein System.

**Takeaway:** Der Besucher wird zum Korrektor. Diese mentale Verschiebung vom Lesen zum Pruefen traegt den Rest der Demo.

**Inhalt:**
Erster Absatz des Schuelertexts. Roh, unkorrigiert. Auf einer leicht angedeuteten Karte (`--paper-warm`). Oben die anonymisierte Kennung.

**Kennung:** `#2025-IT3A-07 · Target Group Analysis · October 2025`

**Exakter Schuelertext:**

> My target group are people studying from the age 18 and up until the average age of finishing studys such as university which are 22 and 27. My target group isn't bound by nation and is accessible globally. My AI can help them with their studies and allow them to save time. My AI also makes studying easier. The ads would be inspiring and professional of the sorts.

**Wirkung:** Der Besucher liest mit und bemerkt selbst die Fehler. Er wird unbewusst zum Korrektor. Das erzeugt Involvement. Das Thema (AI-Produkt, Target Group) ist sofort verstaendlich fuer Tech-Besucher.

**Mobile:** Text-Karte nimmt volle Breite ein mit 16px Padding links/rechts. Kennung wird einzeilig, Font-Size auf 12px reduziert.

---

### Frame 2: Die Analyse leuchtet auf

**Kontextzeile:**
"Kaleido analyses the text along separate dimensions."

**Takeaway:** Sequenzielles Aufleuchten macht sichtbar: hier lesen mehrere Agenten den Text, jeder entlang seiner eigenen Dimension.

**Animation:** Beim Scrollen erscheinen farbcodierte Unterstreichungen. WICHTIG: Die Unterstreichungen erscheinen SEQUENZIELL, nicht gleichzeitig. Gruppiert nach Kategorie mit 200-300ms Staffelung zwischen den Gruppen.

**Reihenfolge:**
1. Erst Grammar leuchtet auf (Fehler 1 + 2)
2. Dann Vocabulary (Fehler 3 + 4)
3. Dann Content (Fehler 5)

Die Summary-Pills bauen sich parallel zu den jeweiligen Gruppen auf.

**Fehler die aufleuchten:**

| # | Text | Kategorie | Farbe |
|---|------|-----------|-------|
| 1 | "are" (in "My target group are") | Grammar | Gedaempftes Rot, verwandt mit `--rust` |
| 2 | "studys" | Grammar | Gedaempftes Rot, verwandt mit `--rust` |
| 3 | "bound by nation" | Vocabulary | Gedaempftes Petrol/Blaugruen |
| 4 | "of the sorts" | Vocabulary | Gedaempftes Petrol/Blaugruen |
| 5 | "My AI can help them... My AI also makes studying easier." | Content | Gedaempftes Ocker/Bernstein |

**Summary-Pills (erscheinen unter dem Text):**
`2 Grammar` · `2 Vocabulary` · `1 Content`

**Warum sequenziell:** Gleichzeitiges Aufleuchten sieht aus wie Grammarly/Spell-Check. Sequenzielles Aufleuchten zeigt: hier laufen MEHRERE Analysen, verschiedene Agenten, verschiedene Dimensionen. Das ist der visuelle Beweis fuer "separate dimensions" aus der Kontextzeile.

**Mobile:** Identisch, aber Pills werden unterhalb des Textes gestapelt statt nebeneinander (eine Zeile pro Pill).

---

### Frame 3: Die Tiefe (eine Annotation oeffnet sich)

**Kontextzeile:**
"Each correction explains the why, not just the what."

**Takeaway:** Kaleido liest den ganzen Text und erkennt Muster. Der Satz "This came up three times in your text" ist der Moment, in dem die Tiefe des Systems sichtbar wird.

**Animation:** Fehler #1 (Grammar: "are" -> "is") klappt auf oder slided ein. Zeigt drei Layer, aber mit veraenderter Hierarchie.

**Layout-Entscheidung:** Die Erklaerung (Layer 2) ist das primaere Element und sofort sichtbar. Quick Fix und Regel sind kompaktere Elemente darueber und darunter. Im Scroll-Kontext ist der warme, persoenliche Ton das Unterscheidungsmerkmal. Der darf nicht hinter einem Klick versteckt sein.

**Exakter Inhalt der Annotation:**

**Layer 1 (kompakt, oben): Quick Fix**
`"My target group are"` -> `"My target group is"`

**Layer 2 (primaer, groesster Bereich): Erklaerung**

> Your subject here is "group", not "people". Even though you're talking about many people, the word "group" is singular, so it needs "is". This came up three times in your text, so it's not a one-off. It's a pattern worth practising.
>
> Common pattern for German speakers. In German, "Gruppe" can take a plural verb. In English, it doesn't.

**Layer 3 (kompakt, unten): Regel**
"Collective nouns (group, team, company, audience) take a singular verb in formal writing."

**Tonregeln fuer alle Annotationen:**
- Zweite Person ("your subject", "you used this three times")
- Warm, nicht herablassend
- Konkret, nicht generisch
- Bezug auf den GANZEN Text, nicht nur den einzelnen Fehler
- Keine KI-Sprache ("The subject necessitates", "It is important to note")
- Keine Niveaustufen (A1, B1, B2 etc.)
- Keine Em-Dashes

**Warum der L1-Transfer-Hinweis PFLICHT ist:** Der Satz ueber German/English zeigt Domain-Wissen (deutscher Berufsschulkontext) und beweist, dass das System kontextuelle Tiefe hat, die generische Modelle nicht liefern. Das ist genau der Moment wo ein Tech-Recruiter denkt: "Die versteht, was Domain-Adaptation bedeutet."

**Mobile:** Annotation erscheint als Full-Width-Card unter dem Text. Quick Fix und Regel als eingeklappte Sections (Tap to expand), Erklaerung immer offen. Kein Modal, kein Overlay.

---

### Frame 4: Die Uebung (aus dem Fehler generiert)

**Kontextzeile:**
"Kaleido generates exercises targeting exactly this mistake."

**Takeaway:** Die Uebungen entstehen aus dem Fehler UND aus der Domaene. Doppelte Personalisierung: fehlerbezogen und berufskontextuell.

**Animation:** Direkt aus der Annotation heraus morpht oder slided eine interaktive Uebung rein. Sichtbare Verbindung: "Based on correction #1: Subject-Verb Agreement"

**Exakte Uebungen (3 Stueck, ALLE im IT-Kontext):**

**Uebung 1:**
"The development team ___ (is/are) deploying the update."
- Antwort: is
- Feedback bei richtig: "Correct. 'Team' is singular."
- Feedback bei falsch: "Not quite. 'Team' is a collective noun, so it takes a singular verb."

**Uebung 2:**
"The software, along with all its plugins, ___ (need/needs) to be updated."
- Antwort: needs
- Feedback bei richtig: "Correct. The subject is 'software', not 'plugins'. The phrase 'along with' doesn't change the subject."
- Feedback bei falsch: "The subject here is 'software', which is singular. 'Along with all its plugins' is extra information, it doesn't make the subject plural."

**Uebung 3:**
"Each user ___ (receive/receives) a personalised dashboard."
- Antwort: receives
- Feedback bei richtig: "Correct. 'Each' always takes a singular verb."
- Feedback bei falsch: "'Each' is always singular, no matter how many users there are."

**Warum IT-Kontext:** Zeigt Personalisierung auf Domain-Level, nicht nur auf Fehler-Level. Generische Tools wuerden "The committee has/have decided" generieren. Kaleido generiert Saetze aus dem Berufsfeld des Schuelers.

**Interaktivitaet:** Der Besucher kann die Uebung selbst loesen. Click oder Tippen auf die richtige Option. Sofortiges Inline-Feedback (richtig/falsch + kurze Erklaerung). Er erlebt was der Schueler erlebt.

**Mobile:** Tap-Targets fuer Antwortoptionen muessen mindestens 44x44px sein (Apple HIG Minimum). Feedback erscheint INLINE direkt unter der jeweiligen Uebung, KEIN Modal oder Overlay. Grund: Auf Mobile scrollt der Nutzer weiter sobald ein Modal aufgeht und verpasst die naechste Uebung. Zwischen den Uebungen mindestens 16px Abstand.

---

### Frame 5: Der Beweis (Before/After)

**Kontextzeile:**
"Same student. Five months later."

**Takeaway:** Fuenf Monate, messbares Wachstum, derselbe Schueler. Das ist, was das System ueber Zeit leistet.

**Inhalt:** Zwei Textbloecke mit visuellem Diff.

**Links/Oben (Oktober 2025, erste Abgabe):**

> My target group are people studying from the age 18 and up until the average age of finishing studys such as university which are 22 and 27. My target group isn't bound by nation and is accessible globally. My AI can help them with their studies and allow them to save time.

**Rechts/Unten (Februar 2026, fuenfte Abgabe):**

> The primary target group is university students aged 19 to 27 who use digital tools on a daily basis for studying and organising their schedules. This group is not limited by nationality since the app works with localised user interfaces in multiple languages. The main USP of the product is that it addresses the pain point of inefficient study habits by creating personalised revision plans.

**Visueller Diff (Glow-Effekt):**
Im "Nachher"-Text leuchten 2-3 Stellen kurz auf (sanfter Glow in `--rust` mit niedriger Opazitaet, 1.5s Fade), wenn der Frame in den Viewport scrollt. Diese Stellen markieren die deutlichsten Verbesserungen:
1. "university students aged 19 to 27" (ersetzt die vage Altersangabe)
2. "not limited by nationality since the app works with localised user interfaces" (konkreter Grund statt leerer Behauptung)
3. "addresses the pain point of inefficient study habits" (Business-Vokabular statt "helps them")

Der Glow zeigt: man muss die Texte nicht Wort fuer Wort vergleichen. Die Verbesserung springt einem entgegen. NICHT jede Verbesserung markieren, nur 2-3. Der Rest bleibt dem Auge des Besuchers ueberlassen.

**Wichtig:** Der "Nachher"-Text hat bewusst noch 1-2 kleine Unvollkommenheiten. Er ist nicht perfekt. Das ist ehrlich und glaubwuerdig. Zeigt Wachstum, nicht Perfektion.

**Fortschritts-Indikator (PFLICHT, nicht optional):**
Kompakt unter dem Before/After:
`Corrections: 10 -> 2` · `Grade: 4+ -> 3+` · `5 submissions tracked`

Die Zahlen sind in 0.5 Sekunden erfasst und liefern den quantitativen Beweis. "5 submissions tracked" zeigt, dass Kaleido longitudinal arbeitet, nicht einmalig.

**Desktop:** Zwei Bloecke nebeneinander, Labels "October 2025 · First submission" und "February 2026 · Fifth submission" ueber den jeweiligen Bloecken.

**Mobile:** Bloecke uebereinander. Zuerst "Before" mit Label, dann 24px Abstand, dann "After" mit Label. Glow-Effekt funktioniert identisch. Fortschritts-Zahlen werden gestapelt (eine Zeile pro Metrik). Swipe-Geste als Alternative: Besucher kann zwischen Before/After wischen. Aber: statische Ansicht ist der Default, Swipe ist Bonus.

---

### Frame 6 (Closer): Die Skala

**Kontextzeile:**
"This was one student. There are 22 more."

**Takeaway:** Ein Schueler, 22 weitere, jeder mit eigenem Profil. Die Individualitaet skaliert, statt im System zu verschwinden.

**Inhalt:** Ein Grid aus 23 Elementen. Jedes Element zeigt:
1. Die anonymisierte Kennung (#07, #03, #19, etc.)
2. Ein Mini-Balkendiagramm der Fehlerkategorien-Verteilung

Jedes Element hat ein anderes Profil: #07 hat viel Grammar, wenig Content. #19 hat viel Content, wenig Grammar. #03 hat gleichmaessig verteilte Fehler. Der Punkt: kein Text noetig, die Visualisierung zeigt auf einen Blick, dass jeder Schueler anders ist und jedes Feedback anders sein muss.

Das Element von #07 (der Schueler aus der Demo) ist visuell hervorgehoben (`2px solid var(--rust)` Border), damit der Besucher den Zusammenhang zur Demo erkennt.

**Abschluss-Element:**
Ein einzelner Satz: "Every feedback is different. No student data ever leaves the school."

Darunter ein Link: "Explore the full example" -> GitHub MATE-DEMO Repo

**Desktop:** Grid-Layout, 4-5 Spalten, Elemente ca. 120x80px.

**Mobile:** Grid wird zu 3 Spalten, Elemente proportional verkleinert. Mini-Balkendiagramme bleiben lesbar bei mindestens 60px Breite. Falls noetig: nur 12 Elemente sichtbar + "... and 11 more" Hinweis, um Scrollen in der Scroll-Demo zu vermeiden (Meta-Scroll-Problem).

---

## Design-Anforderungen

### Design-Token von borgwardt.me (verifiziert gegen index.html, Stand 2026-04-24)

Die Demo uebernimmt alle Variablen und Fonts direkt aus dem bestehenden Stylesheet. Keine eigenen Werte erfinden. Alle Werte unten sind exakt gegen `index.html` Zeilen 10-19 (Variablen), Zeile 7 (Fonts), Zeilen 106-113 (`.hr-soft`), Zeilen 175-184 (`.project-example`), Zeilen 143-151 (Prosa + Blockquotes), Zeilen 194, 200, 206-208 (Nav/Labels) abgeglichen.

**CSS-Variablen:**

| Variable | Wert | Verwendung |
|----------|------|------------|
| `--paper` | `#F6F1E6` | Haupthintergrund |
| `--paper-warm` | `#EFE6D1` | Akzentflaechen, Karten, Codeblocks |
| `--paper-deep` | `#E4D8B8` | Dunkelster Papierton, tiefere Ebenen |
| `--ink` | `#141018` | Haupttextfarbe |
| `--ink-soft` | `#3A3440` | Sekundaerer Text, Italic-Akzente |
| `--ink-dim` | `#8A8493` | Tertiaer: Labels, Captions, Monospace |
| `--rule` | `#D4C9AF` | Linien, Rahmen, Trenner |
| `--rust` | `#9F3A1F` | Akzentfarbe: Links, Hover, Hervorhebungen |

**Fonts:**

| Font | Verwendung |
|------|------------|
| Cormorant Garamond (300, 400, 500, italic) | Body, Headings, Blockquotes |
| JetBrains Mono (400) | Nav, Labels, Metadata, Kennungen |

**Visuelle Muster der Homepage:**
- Trenner: `<hr class="hr-soft">`, 120px Linie + zentrierter Punkt in `--rust` auf `--paper`-Background
- Bilderrahmen (`.project-example .frame`): `1px solid var(--rule)` + `box-shadow: 3px 3px 0 rgba(0,0,0,0.04)` + Hintergrund `--paper-warm` + `padding: 20px`. *Korrektur gegenueber frueherer Konzept-Version: 0.04, nicht 0.05.*
- Hover-Akzent: `color: var(--rust)`
- Kein Bold: Alle `strong` sind `font-weight: 400`
- Body hat subtiles radial-gradient Overlay per `body::before`, `position:fixed`, `z-index:0`. Demo-Frames brauchen `position:relative; z-index:2`, sonst liegen sie unter dem Overlay und wirken ausgewaschen. (`<main>` macht das bereits, die Demo erbt das, wenn sie innerhalb von `<main>` bleibt — was sie im spezifizierten Einfuegepunkt tut.)
- Max Content Width: 820px auf `<main>`, effektive Inhaltsbreite 756px (`padding: 56px 32px 140px`)

**Schluesselgroessen:**
- Body: `font-size: 20px; line-height: 1.7` (auf `<body>`)
- Paragraphs (`<p>`): `font-size: 20px; line-height: 1.72; margin-bottom: 22px; max-width: 64ch; font-weight: 400`
- Blockquotes: `font-size: 26px; font-weight: 300; line-height: 1.35; padding-left: 28px; border-left: 2px solid var(--rust); font-style: italic; max-width: 60ch`
- `.mono` (JetBrains Mono Label-Utility, bereits vorhanden): `font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-dim)`
- Nav-Labels: `font-size: 10.5px; letter-spacing: 0.18em; uppercase` (Desktop), `9.5px / 0.14em` (<820px), `8px / 0.1em` (<640px)
- Section-Titles (`.section-title`): `font-size: 11px; letter-spacing: 0.3em; uppercase; color: var(--ink-dim)` mit zwei 60px-Linien links/rechts
- Chapter-Num (`.chapter-num`): `font-style: italic; font-weight: 300; font-size: 26px; color: var(--rust)`
- Chapter-Title: `font-weight: 400; font-size: clamp(38px, 4.5vw, 52px); line-height: 1.05`

Fuer die Kontextzeilen der Demo-Frames siehe "Generelle Design-Regeln" weiter unten; sie folgen dem Section-Titles-Muster (11px, 0.3em, uppercase, `--ink-dim`).

### Fehlerfarben (auf warmem Papier-Hintergrund)

Die Fehlerfarben muessen auf `--paper` (#F6F1E6) und `--paper-warm` (#EFE6D1) funktionieren. Sie muessen sich untereinander UND von `--rust` klar unterscheiden. Gedaempft, nicht grell. Passend zum warmen, analogen Gesamteindruck der Seite.

| Kategorie | Farbrichtung | Hinweis |
|-----------|-------------|---------|
| Grammar | Rot, verwandt mit `--rust` | Kann `--rust` selbst sein oder ein leicht hellerer/dunklerer Ton davon. Natuerlichste Wahl, weil Rotstift-Korrektur universell verstanden wird |
| Vocabulary | Petrol/Blaugruen | Kuehler Gegenpart zum warmen Papier. Muss auf `--paper-warm` lesbar bleiben |
| Content | Ocker/Bernstein | Warm, aber dunkler als `--paper-deep`. Harmoniert mit dem Papierton, hebt sich aber klar ab |

Exakte Hex-Werte muessen im Browser auf der echten Seite getestet werden. Unterstreichungen als `border-bottom` oder `text-decoration` mit den jeweiligen Farben, nicht als Hintergrund-Highlight.

### Generelle Design-Regeln
- Keine Emojis im UI
- Keine Em-Dashes
- Kein Bold (font-weight: 400, wie auf der gesamten Homepage)
- Kontextzeilen: JetBrains Mono, `--ink-dim`, uppercase, 10.5-11px, letter-spacing 0.18-0.3em (wie Nav/Labels der Homepage)
- Schuelertext: Cormorant Garamond, `--ink`, 20px
- Annotationen/Erklaerungen: Cormorant Garamond, `--ink`, Erklaerung kann 22-24px sein fuer visuelle Hierarchie
- Kennungen/Metadata: JetBrains Mono, `--ink-dim`
- Uebungs-Optionen: Klare Buttons mit `1px solid var(--rule)`, Hover `color: var(--rust)`
- Karten/Flaechen: `--paper-warm` als Hintergrund, `1px solid var(--rule)` als Rahmen
- Trenner zwischen Frames: `hr-soft` Muster der Homepage uebernehmen

---

## Mobile-Spezifikation (Gesamtuebersicht)

Mobile ist nicht "Desktop aber schmaler". Jeder Frame hat angepasstes Verhalten.

### Generelle Mobile-Regeln
- Mindest-Tap-Target: 44x44px (Apple HIG)
- Kein Modal, kein Overlay, kein Popup. Alles Inline.
- Content-Padding: 16px links/rechts
- Scroll-Animationen: Gleiche Trigger wie Desktop (scroll-position-basiert), aber reduzierte Komplexitaet bei Animationen (weniger parallax, kuerzere Transitions)
- Text-Groessen: Body mindestens 16px (iOS-Zoom-Prevention)

### Frame-spezifische Mobile-Anpassungen

| Frame | Desktop | Mobile |
|-------|---------|--------|
| Entry | Zentrierter Text mit Scroll-Indicator | Identisch |
| 1 (Text) | Karte mit Padding | Full-Width-Karte, Kennung einzeilig, 12px |
| 2 (Analyse) | Unterstreichungen + Pills nebeneinander | Pills gestapelt (eine pro Zeile) |
| 3 (Annotation) | Drei Layer sichtbar | Erklaerung offen, Quick Fix + Regel als Tap-to-expand |
| 4 (Uebung) | Inline-Feedback | Identisch, aber 44px Tap-Targets, 16px Abstand zwischen Uebungen |
| 5 (Before/After) | Nebeneinander | Uebereinander, Optional Swipe-Geste |
| 6 (Skala) | 4-5 Spalten Grid | 3 Spalten, ggf. nur 12 Elemente + "and 11 more" |

---

## Inhaltliche Regeln fuer die Implementierung

### Texte
- Schuelertext ist synthetisch (basiert auf echten Mustern, kein realer Schueler)
- Anonymisierte Kennung verwenden (#2025-IT3A-07)
- Schulname ist immer redacted

### Uebungen
- IMMER im IT/Business-Kontext
- Saetze die ein IT-Azubi in der Arbeitswelt tatsaechlich schreiben wuerde
- Sofortiges Inline-Feedback (richtig/falsch + kurze Erklaerung)
- Nicht mehr als 3 Uebungen in der Scroll-Demo
- Keine Grauzonen bei den Antworten (jede Uebung hat eine eindeutig richtige Antwort)

### Ton der Annotationen
- Zweite Person ("your subject", "you used this three times")
- Warm, nicht herablassend
- Konkret, nicht generisch
- Bezug auf den GANZEN Text, nicht nur den einzelnen Fehler ("This came up three times")
- Keine KI-Sprache ("The subject necessitates", "It is important to note")
- Keine Niveaustufen (A1, B1, B2 etc.)
- Keine Em-Dashes

---

## Abgrenzung: Was die Scroll-Demo NICHT ist

- Nicht die vollstaendige Feedback-Seite. Die hat 10 Fehler, alle Details, Worksheet-Link, GDPR-Notice. Die Demo zeigt 4-5 Fehler, eine Annotation, eine Uebung.
- Nicht das vollstaendige Worksheet. Das hat 5 Bloom-Level, Answer Key, Reflection. Die Demo zeigt 3 Uebungen aus einer Kategorie.
- Nicht das vollstaendige Progress-Dashboard. Das hat XP-Bar, Radar-Chart, Badges, Timeline. Die Demo zeigt Before/After + 3 Zahlen.
- Die vollen Versionen bleiben im GitHub-Repo (MATE-DEMO) und koennen verlinkt werden.

---

## Offene Punkte

### Durch den Abgleich mit index.html geklaert (nicht mehr offen)

- ~~Scroll-Technologie~~ → **GSAP 3.12.5 + ScrollTrigger**, mit `pin: true` und `scrub: 1` fuer Szene 1 und Szene 2, IntersectionObserver nur fuer Szene 3 (Grid-Eintritt). Frueher in dieser Liste stand "IntersectionObserver, kein GSAP" — das war ein Architektur-Missverstaendnis und ist revidiert. Details in "Integration in die bestehende Seite" > "Scroll-Technologie-Entscheidung" und in "Architektur der Szenen".
- ~~Einfuegepunkt in der HTML-Datei~~ → Innerhalb `section.chapter#kaleido`, nach `.stack`-Div (Zeile 399 `</div>`), vor `</section>` (Zeile 400). Demo-Container: `<div class="kaleido-demo reveal" id="kaleido-demo">`.
- ~~Performance-Hooks~~ → `effects.js` liefert bereits `data-motion` und `data-perf` am `<html>`-Element. Demo konsumiert diese, fragt nicht selbst `matchMedia` an.
- ~~Accessibility: Reduced-Motion~~ → Exakt ueber `document.documentElement.dataset.motion === 'reduced'` pruefen. Verhalten in "Scroll-Technologie-Entscheidung" spezifiziert.
- ~~CSS- und JS-Ablage~~ → CSS in den bestehenden Inline-`<style>`-Block von `index.html`, JS als neue Funktion `initKaleidoDemo()` in `scripts/effects.js` innerhalb der vorhandenen IIFE.

### Weiterhin offen, Entscheidung vor oder waehrend der Implementierung

1. **Fehlerfarben (Hex-Werte):** Die drei Kategorie-Farben (Grammar/Vocabulary/Content) muessen im Browser auf der echten Seite getestet werden, auf `--paper` und `--paper-warm` Hintergrund. Genug Kontrast fuer Lesbarkeit, gedaempft genug fuer den analogen Look. Ablage als neue CSS-Variablen `--err-grammar`, `--err-vocab`, `--err-content` in `:root`. Grammar kann eine Spielart von `--rust` sein (leicht heller oder dunkler). Vocabulary: gedaempftes Petrol/Blaugruen. Content: gedaempftes Ocker/Bernstein, dunkler als `--paper-deep`.
2. **Glow-Effekt (Frame 5):** Exakte Animationsparameter (Farbe, Dauer, Intensitaet) muessen auf dem warmen Papier-Hintergrund getestet werden. `--rust` mit rgba-Opazitaet als Ausgangspunkt. 1.5s Fade ist in der Frame-5-Spec festgelegt, die Opazitaet nicht. Kandidat: `background: radial-gradient(..., rgba(159,58,31,0.14), transparent)` oder `box-shadow: 0 0 24px rgba(159,58,31,0.18)` — im Browser vergleichen.
3. **Grid-Daten (Frame 6):** Die 23 Fehlerverteilungs-Profile muessen erstellt werden. Realistisch, nicht random. Drei Muster abdecken: viel Grammar / wenig Content (z.B. DaZ-Lerner), viel Content / wenig Grammar (inhaltlich schwach, sprachlich ok), gleichmaessig verteilt. Datenstruktur: JSON-Array mit `{id, grammar, vocab, content}` in Werten 0-10, im JS inline. Eintrag #07 ist der Schueler aus der Demo und wird visuell hervorgehoben.
4. **"Full Demo" Link:** Ziel-URL? Das GitHub-Repo `https://github.com/SvenjaBorgwardt/MATE-DEMO` (Referenz-Dateien unten) ist die wahrscheinlichste Option. Vor Implementierung bestaetigen, ob das Repo oeffentlich ist oder ob eine gehostete Version gemeint ist.
5. **Pin-Laengen der Szenen:** Szene 1 ist mit ~350vh (`end: '+=350%'`) vorspezifiziert, Szene 2 mit ~200vh. Diese Werte muessen im Browser am lebenden Entwurf feinjustiert werden — zu kurz wirkt hektisch, zu lang wird langatmig. Anhaltspunkt: ein entspannter Scroll-Durchlauf von Szene 1 von Beginn bis Uebergang zu Szene 2 sollte 8-12 Sekunden dauern.
6. **Tab-Reihenfolge und ARIA fuer Frame 4:** Die Uebungen brauchen `<button>`-Elemente mit `aria-pressed` oder `role="radio"` fuer Screen-Reader. Exakte ARIA-Struktur vor Implementierung festlegen.
7. **Interaktion der Entry-Transition mit Reveal-Hook:** Die Entry-Transition "See it work." ist zentrierter Text, der beim Scrollen ausfadet. Mechanik: Scroll-linked (Opacity folgt Scroll-Position innerhalb der 80vh-Zone) oder IntersectionObserver (ausfaden, sobald die Zone den Viewport verlaesst)? Empfehlung: `IntersectionObserver` mit threshold-Arrays, weil es zu der gewaehlten Scroll-Technologie-Entscheidung passt. Bei `data-motion="reduced"` sofort sichtbar, nicht animiert.

---

## Fertigstellungskriterien

Die Demo gilt als abgenommen, wenn:

- Bei `prefers-reduced-motion: reduce` ist ScrollTrigger nicht registriert, keine Pins, kein Scrub. Alle Szenen-Endzustaende werden sofort sichtbar gerendert: Schuelertext mit allen Unterstreichungen und Pills, geoeffnete Annotation, Uebung im Defaultzustand, Before- und After-Absatz beide vollstaendig sichtbar, Grid komplett.
- Lighthouse Accessibility Score auf der Seite mit aktivierter Demo: 100. Keine neuen Axe-Violations.
- Szene 1 pinnt sauber: kein Zittern beim Einrasten, kein Sprung beim Aufloesen, Pin-Punkt passt zum oberen Viewport-Rand (mit Raum fuer Dimensionen-Streifen und Kontextzeile). Messbar auf iPhone SE / Chrome-Devtools-Performance mit aktiviertem CPU-Throttle 4x.
- Alle interaktiven Elemente (Uebungs-Buttons in Frame 4, ggf. Grid-Elemente in Frame 6) sind per Tab erreichbar, per Enter/Space aktivierbar, und haben sichtbare `:focus-visible`-States mit `--rust`-Outline.
- Chrome DevTools Console bleibt frei von neuen Meldungen durch die Demo.
- Alle sichtbaren Demo-Texte sind Englisch. Abnahme-Check: grep auf die Demo-Strings im finalen HTML ergibt keinen deutschen Satz und keine deutschen UI-Labels. (Referenzen auf Deutsch als Thema in englischer Prosa sind erlaubt — siehe Sprachregel.)
- Bei Viewport-Breite 375px rollt die Demo ohne horizontales Overflow.
- Bei `data-perf="low"` bleiben Pins aktiv, aber `scrub: false` (step-basiert). Keine Stagger-Delays, Elemente erscheinen gleichzeitig innerhalb ihres Beat-Fensters. Glow-Effekte entfallen. Frame-5-Morph wird durch harten Before/After-Wechsel ersetzt.
- Scene 1 und Scene 2 sind via GSAP ScrollTrigger implementiert, Scene 3 via IntersectionObserver. Keine vermischten Mechaniken innerhalb einer Szene.
- Der dramaturgische Bogen (Frame 1 Aufschlag → Frame 6 Pullback) ist im Scroll-Fluss ohne Erklaerung nachvollziehbar. Test: jemand, der das Konzept nicht kennt, soll die Demo durchscrollen und anschliessend in einem Satz sagen koennen, was Kaleido leistet.

---

## Referenz-Dateien

- GitHub Repo: https://github.com/SvenjaBorgwardt/MATE-DEMO
- `index.html` (= MATE_Feedback): Vollstaendiges Schueler-Feedback mit 10 Click-to-Reveal Korrekturen
- `MATE_Worksheet_2025-IT3A-07.html`: Worksheet mit Bloom's Taxonomy Scaffolding (5 Level)
- `MATE_Progress_2025-IT3A-07.html`: Gamifiziertes Progress-Dashboard (XP, Charts, Badges, Before/After)
- `MATE_Teacher_Dashboard.html`: Lehrer-Ansicht (Klassenuebersicht)

---

*Obsidian-Ablage: MyVault/Projekte/borgwardt-me/Kaleido-Scroll-Demo-Konzept-v2.md*
