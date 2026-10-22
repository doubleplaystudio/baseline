# Changelog

Alle Änderungen an Baseline, neueste zuerst.
Versionen nach dem Schema `MAJOR.MINOR.PATCH`:

- **PATCH** (`1.0.1`): Bugfix, bestehende Seiten verhalten sich gleich
- **MINOR** (`1.1.0`): neues Modul oder neue Option, abwärtskompatibel
- **MAJOR** (`2.0.0`): bestehende Seiten müssen angepasst werden (Attribut umbenannt, Verhalten geändert)

Zum Zurückrollen in Webflow einfach die vorherige Versionsnummer in Head und Footer eintragen.

---

## [1.0.0] – 2026-10-22

Erste Version im Repo. Der bisherige Custom Code aus Webflow ist in Module aufgeteilt.

### Neu
- Struktur: ein Modul pro Datei (`src/modules/`), CSS gespiegelt (`src/css/`)
- Build mit esbuild nach `dist/` (JS ca. 22 KB, CSS ca. 8 KB, minifiziert)
- GitHub Action baut `dist/` automatisch bei Änderungen in `src/`
- README mit Attribut-Übersicht, Regeln für neue Module und Versions-Workflow
- `webflow/`: Snippets für Head, Footer und Embed
- Modul **Reveal**: `split-letter`, `split-lines`, `fade-block` mit Trigger `load` / `preloader` / Scroll und `data-delay`
- Preloader sendet ein Signal an Reveal (`trigger="preloader"`)
- Lenis ist mit ScrollTrigger synchronisiert
- Reduced Motion: CSS-Transitions aus, Reveal-Elemente sofort sichtbar

### Verbessert
- Jedes Modul startet zentral und isoliert: ein Fehler stoppt die anderen nicht (`[Baseline] … failed` in der Konsole)
- Guards in allen Modulen: Module ohne passende Elemente brechen sofort ab
- Ohne GSAP bleiben Reveal-Elemente sichtbar (Fallback)

### Behoben
- Nav-Underline: Absturz, wenn kein Parent-Link existiert
- Modal: Absturz bei fehlendem Ziel-Modal
- Copy Email: Absturz ohne `data-copy-email-element`
- Forms: Absturz bei leerer Radio-/Checkbox-Gruppe

### Entfernt
- Ungenutzter Barba-Transition-Code
- Doppelter CSS-Block für die Footer-Underline
