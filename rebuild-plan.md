# Umbauplan — Portfolio als "10/10" für einen Anthropic-Leser

**Ziel:** Die Seite soll für jemanden bei Anthropic, der zufällig auf Svenja landet,
in den ersten 30 Sekunden lesbar machen, wie gut die Arbeit ist — statt ihn danach
suchen zu lassen. Aktueller Stand: starke 8. Was die 10 kostet, ist nicht die
Substanz (die ist da), sondern die *Auffindbarkeit* und *Positionierung*.

**Arbeitsweise (Hausregeln):**
- Eine sichtbare Änderung nach der anderen, jede einzeln im Browser bestätigt — nie ein blinder Batch.
- Karussell-Karten werden **nicht** umgeordnet → die load-bearing Index-Ausrichtung
  (Karte ↔ `data-expand` ↔ `projectKeys` ↔ `hashToProject`) bleibt unangetastet.
- Keine neuen `:root`-Variablen, keine neuen Fonts. `prefers-reduced-motion` respektieren.
- Git läuft über Svenjas Mac (Commands von hier).

---

## Phase A — Copy-Pass ✅ UMGESETZT

Alle Textänderungen sind in `index.html` eingebaut. Hier die Zusammenfassung:

### A1 · Bio ✅
Reihenfolge gedreht: Mission → Werdegang → Persönlichkeit.
"All of them" → "Everything I build" (Antezedent gefixt).
Svenjas Formulierungen 1:1 beibehalten — nur Reihenfolge + Pronomen geändert.

### A2 · Nav + Footer ✅
Nav: "Open for Collaboration" → "Get in touch".
Footer: Neue Zeile über der Kontakt-Mail:
> I'm interested in how models behave with the people who use them — evals, model behaviour, AI that's actually good for learning. If that's your problem too, write me.

(Bewusst "interested in" statt "looking for work" — liest sich als intellektuelle Richtung, nicht als Jobsuche.)

### A3 · Mistral-Reframe ✅
Hybrid: konkrete Constraints ergänzt, Haltung beibehalten:
> Why Mistral, why a small model? The constraints were real: EU data residency, a tight budget, a classroom that can't go down. But beyond the constraints, I believe we need to build on infrastructure we actually control, not just consume APIs and hope the access stays. When export controls shift and models disappear, the question is whether you can build something that works without them.

### A4 · Sycophancy ✅
Feldbegriff bei erster Erwähnung von "anti-glaze" eingeführt:
"A1 (a stronger anti-glaze prompt — targeting what the field calls *sycophancy* — that explicitly tells the model to be critical)."

### A5 · Generalisierung — NICHT UMGESETZT (bewusst)
Der bestehende Hook macht das bereits gut. Zusätzliche Generalisierung würde den Spannungsbogen vorwegnehmen.

### A6 · "goes rogue" ✅
Karte (Z. 1143): "Minus the part where she goes rogue." — bleibt.
Expand (Z. 1419): "Minus the part where she turns on me." — "goes rogue" entfernt + "it" → "she" korrigiert.

---

## Phase B — Die eigentliche sichtbare Änderung (NOCH OFFEN)

**Braucht Browser-Check — einzeln umsetzen und im Browser bestätigen.**

### B1 · Research-Strip im Hero (P1, größter Hebel) — unter `build-intro`
Kompakte Zahlenzeile, die `.uth-keystrip`/`.uth-metric`-Styles wiederverwendet:
*+41.7pp Pressure Guard · 2× Claude on honest calibration · pre-registered eval*.
Macht die Strenge sofort sichtbar. Erst statisch bauen und prüfen.

### B2 · "Read the research →" Deep-Link
Button am Strip greift ins bestehende Karussell: `selectProject(0)` + `toggleStory()`
öffnen + zum `uth-divider` scrollen. Hooks existieren bereits, keine neue Architektur.
Separat prüfen (ändert Verhalten).

*Bewusst nicht empfohlen:* ein vierter Tab "Research" — dupliziert Inhalt, bricht die
3-Tab-Struktur, mehr Risiko für wenig Mehrwert.

---

## Phase C — Prüfbarkeit (NOCH OFFEN — hängt an Svenjas Mitarbeit)

### C1 · Eval-Harness + anonymisierten Datensatz veröffentlichen (P3)
Steht aktuell unter "what comes next" → in die Gegenwart ziehen. Sobald die
GitHub-URL existiert: Links an den Ergebnis-Tabellen, im Schluss-`stack` und in
"Out There → Recognition" verdrahten.

---

## Empfohlene Reihenfolge
1. ~~**Phase A** komplett~~ ✅ DONE
2. **B1 → B2** (je einzeln im Browser).
3. **C**, sobald die Repo öffentlich ist.

## Guardrails (nicht brechen)
- Karten-Reihenfolge & Index-Ausrichtung unverändert.
- Nur bestehende `:root`-Variablen und geladene Fonts.
- `prefers-reduced-motion` honorieren; Karten-Höhen-Equalize (`equalizeCards`) nicht stören.
- Demos mit festen IDs (`#compass-demo`, `#ute-demo`, `#ute-grid`, `#ute-cart`, …) nicht umbenennen.
