# Changelog

Alle Änderungen an Baseline, neueste zuerst.
Versionen nach dem Schema `MAJOR.MINOR.PATCH`:

- **PATCH** (`1.0.1`): Bugfix, bestehende Seiten verhalten sich gleich
- **MINOR** (`1.1.0`): neues Modul oder neue Option, abwärtskompatibel
- **MAJOR** (`2.0.0`): bestehende Seiten müssen angepasst werden (Attribut umbenannt, Verhalten geändert)

Zum Zurückrollen in Webflow einfach die vorherige Versionsnummer in Head und Footer eintragen.

---

## [1.2.0] – 2026-11-02

### Neu
- Modul **Nav Theme**: Navigation wird transparent mit heller Schrift, solange eine Section mit `data-nav-transparent` dahinter liegt (z. B. Video-Hero). Ist ein Dropdown oder das Mobile-Menü offen, fällt die Nav auf ihren Default zurück. Steuerung nur über Attribute (`data-nav`, `data-nav-bar`, `data-nav-fg`, `data-nav-dropdown`), Webflow-Interactions bleiben unberührt. Helle Farbe per `--nav-transparent-fg`. Übergänge asymmetrisch: in die Hero fast sofort (kein Aufblitzen), zurück weich. Funktioniert auch mit Snap Scrolling in einem Container
- Bouncy Tabs: `data-bouncy-tabs-auto` auf dem Wrapper. Sekunden pro Tab, `"false"` oder `"0"` schaltet das Auto-Rotate ab (Default weiterhin 5 s)
- Page Transition: `data-no-transition` auf einem Link schließt ihn aus

### Verbessert
- Underline: Attribut `underline` jetzt ohne Wert, `underline="true"` funktioniert weiterhin
- Stroke: Attribut `animate-stroke` jetzt ohne Wert und ohne Pflicht-Klasse `.stroke`, `animate-stroke="true"` auf `.stroke` funktioniert weiterhin

### Behoben
- Page Transition startete bei Ankerlinks auf dieselbe Seite (`/#id`, z. B. aus Webflow-Links auf Page Sections). Diese Links, `tel:`, `target="_blank"` und Download-Links lösen jetzt keine Transition mehr aus

Bestehende Seiten verhalten sich unverändert.

---

## [1.1.0] – 2026-10-25

### Neu
- Preloader: `data-load-mode="custom"` auf `[data-load-wrap]`. Baseline spielt dann keine eigene Loader-Animation ab, das Projekt bringt seinen eigenen Loader mit (z. B. Lottie, Video)
- `window.Baseline.preloaderDone()`: startet alles mit `trigger="preloader"`. Wird vom Projekt-Code aufgerufen, sobald der eigene Loader rausfährt
- Reveal: Sicherheitsnetz für `trigger="preloader"` per `data-load-timeout` (ms) auf dem Wrapper einstellbar, Default weiterhin 8000

Bestehende Seiten verhalten sich unverändert.

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
