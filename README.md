# Baseline

Globales Webflow-Framework von **Double Play Studio**: Animationen, Formulare, Slider, Modals und mehr. Alles läuft über Attribute, die du in Webflow setzt.

Diese Single Source of Truth wird per jsDelivr in jedes Projekt geladen. Jedes Projekt ist auf eine feste Version gepinnt.

---

## Einbindung in Webflow

| Wo | Was | Datei |
|---|---|---|
| Site Settings → Custom Code → **Head** | Baseline-CSS | [`webflow/head.html`](webflow/head.html) |
| Site Settings → Custom Code → **Footer** | Libraries + Baseline-JS | [`webflow/footer.html`](webflow/footer.html) |
| Embed in der globalen Component | Typo-Clamps, Designer-Fixes | [`webflow/embed.html`](webflow/embed.html) |

```html
<!-- Head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/doubleplaystudio/baseline@1.0.0/dist/baseline.min.css">

<!-- Footer, nach allen Libraries -->
<script src="https://cdn.jsdelivr.net/gh/doubleplaystudio/baseline@1.0.0/dist/baseline.min.js"></script>
```

> **Immer eine feste Version angeben** (`@1.0.0`), niemals `@latest` oder `@main`. Sonst kann ein Update für Projekt C unbemerkt Projekt A verändern.

**Warum das Embed in Webflow bleibt:** Der Designer rendert nur Embeds, keinen Head- oder Footer-Code. Alles, was im Canvas korrekt aussehen muss, gehört deshalb ins Embed oder in native Webflow-Variablen.

---

## Attribute – Übersicht

### Reveal (Text- & Block-Animationen)

| Attribut | Wirkung | Typischer Einsatz |
|---|---|---|
| `split-letter` | Buchstabe für Buchstabe von unten | Headlines |
| `split-lines` | Zeile für Zeile von unten | Paragraphen |
| `fade-block` | Einfaden | Buttons, Bilder, Cards |

**Trigger** (auf dem Element oder einem Parent):

| Attribut | Startet … | Typischer Einsatz |
|---|---|---|
| *(keins)* | beim Scrollen (85 % Viewport) | Standard |
| `trigger="load"` | sofort beim Laden | Hero auf Subpages |
| `trigger="preloader"` | sobald der Preloader rausfährt | Hero auf der Homepage |

Ohne Preloader auf der Seite verhält sich `trigger="preloader"` wie `load`.

**Optional:** `data-delay="0.2"` (Sekunden, nur auf dem Element selbst).

```html
<section trigger="preloader">
  <h1 split-letter>Headline</h1>
  <p split-lines data-delay="0.3">Subline …</p>
  <a fade-block data-delay="0.6">Button</a>
</section>
```

### Weitere Module

| Modul | Wichtigste Attribute | Datei |
|---|---|---|
| Nav Underline | `underline="true"` auf `.nav-link-txt` / `.nav-link-txt-transparent` | `nav-underline.js` |
| Footer Underline | `underline="true"` auf `.footer-link` | `footer-underline.js` |
| Counter | `counter="true"`, `data-count`, `counter-delay`, `counter-trigger="load"`, `counter-tip="true"` | `counter.js` |
| Stroke | `animate-stroke="true"` auf `.stroke` | `stroke.js` |
| Tab Checkbox | Checkbox in `.tab-item` | `tab-checkbox.js` |
| Forms | `data-form-validate`, `data-validate`, `data-radiocheck-group`, `data-submit` | `forms.js` |
| Live-Uhr | `data-current-time="Europe/Berlin"` + `-hours`, `-minutes`, `-seconds`, `-timezone` | `current-time.js` |
| Swiper | `data-swiper-group`, `data-swiper-wrap`, `data-swiper-prev/next`, `data-desktop` | `swiper.js` |
| Flickity | `data-flickity-type="cards"`, `data-flickity-list`, `-item`, `-control`, `-dot`, `-desktop-cols` | `flickity.js` |
| Jahr | `id="year"` | `footer-year.js` |
| Modal | `data-modal-target`, `data-modal-name`, `data-modal-group-status`, `data-modal-close` | `modal.js` |
| Preloader | `data-load-wrap`, `-container`, `-bg`, `-progress`, `-logo`, `-text`, `-reset` | `preloader.js` |
| Copy Email | `.copy-email-button`, `data-copy-email`, `data-copy-email-element` | `copy-email.js` |
| Page Transition | `.page-transition` | `page-transition.js` |
| Marquee | `data-draggable-marquee-init`, `-collection`, `-list`, `data-duration`, `data-direction` | `marquee.js` |
| Bouncy Tabs | `data-bouncy-tabs-init`, `-nav`, `-button`, `-indicator`, `-panel` … | `bouncy-tabs.js` |

Die vollständige Doku zu jedem Modul steht im Kopf der jeweiligen Datei in `src/modules/`.

---

## Aufbau

```
src/
├── index.js            ← Setup, Imports, Boot (modules-Liste)
├── core/
│   ├── utils.js        ← onReady, run (Fehler-Isolation)
│   ├── signals.js      ← Signale zwischen Modulen (Preloader → Reveal)
│   └── constants.js
├── modules/            ← ein Modul = eine Datei
└── css/
    ├── index.css       ← importiert alles in fester Reihenfolge
    ├── base.css        ← Page Transition, Loader
    ├── modules/        ← CSS zu den JS-Modulen, gleiche Namen
    ├── vendor/         ← Swiper, Flickity, Bunny
    └── a11y.css        ← Reduced Motion (immer zuletzt)
dist/                   ← gebaut, wird von Webflow geladen. Nicht von Hand bearbeiten.
webflow/                ← Snippets zum Kopieren nach Webflow
```

---

## Neues Modul anlegen

1. **Datei anlegen:** `src/modules/mein-modul.js`

   ```js
   /* =====================================================
      Mein Modul
      Attribute: data-mein-modul …
      ===================================================== */

   export function initMeinModul() {
     const items = document.querySelectorAll("[data-mein-modul]");
     if (!items.length) return; // Guard

     items.forEach((el) => {
       // …
     });
   }
   ```

2. **In `src/index.js` importieren und in die `modules`-Liste eintragen.**
3. **CSS (falls nötig):** `src/css/modules/mein-modul.css` anlegen und in `src/css/index.css` importieren.

### Regeln

- **Guard zuerst:** Ohne passende Elemente sofort `return`. Wird eine Library gebraucht: `if (typeof Swiper === "undefined") return;`
- **Kein eigenes `DOMContentLoaded`:** Das Timing übernimmt der Boot. Bei Code von Osmo, Codepen & Co. den Listener entfernen und nur die `init`-Funktion übernehmen.
- **Selektoren über `data-`Attribute, nicht über Webflow-Klassen.** Klassen werden im Designer umbenannt, Attribute bleiben. Pro Modul ein Präfix (`data-mein-modul-*`).
- **Styling ins CSS, nicht ins JS.** JS setzt nur Zustände (`data-status="active"`, `is--active`).
- **Neue GSAP-Plugins** in `src/index.js` bei `gsap.registerPlugin(...)` ergänzen und in `webflow/footer.html` laden.
- **Nichts global machen**, außer es ist gewollt: dann explizit `window.xyz = …`.
- **Reihenfolge in der Liste** spielt nur eine Rolle, wenn Module voneinander abhängen (z. B. Preloader vor Reveal).

### Testen

Konsole öffnen. Scheitert ein Modul, steht dort `[Baseline] initXyz failed`, und alle anderen Module laufen trotzdem weiter. Auch eine Seite **ohne** das neue Modul testen. Bleibt sie fehlerfrei, sitzt der Guard richtig.

---

## Workflow & Versionen

1. Änderung in `src/`, über GitHub im Browser (Taste `.`), lokal oder per Claude.
2. Push auf `main` → die GitHub Action baut `dist/` automatisch und committet es.
3. **Release:** Tag setzen (Releases → „Draft a new release“ → Tag `v1.1.0`).
4. Im Kundenprojekt die Version in **beiden** URLs (Head + Footer) hochsetzen, aber nur dort, wo du das Update willst.

| Änderung | Version | Beispiel |
|---|---|---|
| Bugfix, keine Auswirkung auf bestehende Seiten | dritte Stelle | `1.0.0` → `1.0.1` |
| Neues Modul / neue Option | zweite Stelle | `1.0.1` → `1.1.0` |
| Attribut umbenannt oder Verhalten geändert, alte Seiten brechen | erste Stelle | `1.1.0` → `2.0.0` |

**Lokal bauen (optional):**

```bash
npm install
npm run build   # einmal bauen
npm run watch   # JS bei jeder Änderung neu bauen
```

### Cache

jsDelivr cached Tags dauerhaft, `@1.0.0` liefert also immer genau diese Version. Deshalb **nie einen bestehenden Tag überschreiben**, sondern immer eine neue Version taggen.

---

## Bekannte Punkte

- **Bunny Player:** Das CSS liegt in Baseline (`css/vendor/bunny.css`), das JS noch lokal auf den Seiten, die den Player nutzen. Es ist ein Kandidat für ein eigenes Modul.
- **Tab Checkbox:** Die Farben werden per JS gesetzt. Sie könnten über `.tab-item:has(input:checked)` ins CSS wandern, dann entfällt das Modul.
- **Farben:** Die Hex-Werte sind noch im CSS verteilt. Später können sie als Tokens (`--bl-color-*`) zentral gesammelt und auf Webflow-Variablen gemappt werden.
