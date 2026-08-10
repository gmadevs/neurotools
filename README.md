# Neuro-tools

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen?logo=github)](https://gmadevs.github.io/neurotools/)
[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
[![Made with HTML](https://img.shields.io/badge/Made%20with-HTML%2FCSS%2FJS-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gmadevs/neurotools/pulls)
[![GitHub last commit](https://img.shields.io/github/last-commit/gmadevs/neurotools?label=ultimo%20commit&logo=git)](https://github.com/gmadevs/neurotools/commits/main)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/gmadevs/neurotools?label=commit%2Fmese&logo=github)](https://github.com/gmadevs/neurotools/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/gmadevs/neurotools?label=dimensione&logo=github)](https://github.com/gmadevs/neurotools)
[![GitHub stars](https://img.shields.io/github/stars/gmadevs/neurotools?style=social)](https://github.com/gmadevs/neurotools/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/gmadevs/neurotools?style=social)](https://github.com/gmadevs/neurotools/forks)

> Raccolta di strumenti clinici basati su evidenza per la neuroradiologia generale, pediatrica e neonatale, pubblicati come sito statico tramite GitHub Pages.

---

## Panoramica

**Neuro-tools** è una raccolta open-source di strumenti clinici che girano interamente nel browser — senza backend, senza login, senza raccolta di dati. Ogni strumento è autonomo e basato su riferimenti bibliografici pubblicati.

Gli strumenti sono organizzati per categoria clinica e compaiono automaticamente nella barra di navigazione e nella home page non appena vengono registrati nel file di configurazione centrale.

---

## Struttura del progetto

```
.
├── index.html              ← Home page (elenco generato automaticamente)
├── info.html
├── assets/
│   ├── site-config.js      ← Registro centrale di tutti gli strumenti
│   ├── base.css            ← Fondamenta condivise: palette, tipografia,
│   │                         layout, form, referto, responsive, stampa
│   ├── fonts/              ← IBM Plex in locale (woff2, subset latin)
│   ├── nav.css             ← Stili della navbar
│   ├── nav.js              ← Script di iniezione della navbar
│   └── mobile-result.js    ← Barra risultato sticky su mobile
└── tools/
    └── suture-craniche.html
```

### Come funziona

`assets/site-config.js` è la **fonte delle tools**: contiene l'array `SITE_TOOLS` con titolo, descrizione, categoria, sottocategoria opzionale e URL di ogni strumento.

- `nav.js` legge quell'array e **costruisce automaticamente la navbar** su ogni pagina.
- `index.html` legge lo stesso array e **genera automaticamente l'elenco** della home, raggruppato per categoria e sottocategoria, con filtro per gruppo e ricerca.

Per aggiungere un nuovo strumento bastano due passi: creare la pagina HTML e aggiungere una riga in `site-config.js`. Nessuna modifica manuale alla navbar o alla home.

### Stili condivisi

`assets/base.css` contiene tutto ciò che è comune agli strumenti: palette, reset,
font, header, layout `.workspace`, campi del modulo, referto, modale del
tutorial, regole responsive e di stampa. Va incluso **prima** del `<style>` della
pagina, così che le regole specifiche dello strumento possano sovrascriverlo.

Un nuovo strumento non deve ridefinire nulla di tutto ciò: gli basta dichiarare
ciò che ha di suo. Le due misure che cambiano più spesso si regolano con le
variabili, senza riscrivere le regole:

```css
:root {
  --panel-w: 420px;    /* larghezza della colonna dei dati (default 400px) */
  --report-max: 780px; /* larghezza massima del referto  (default 720px)   */
}
```

**Convenzioni responsive** — un solo sistema di breakpoint per tutti gli
strumenti, definito in `base.css`:

| Larghezza | Comportamento |
|---|---|
| `> 900px` | Due colonne: dati a sinistra, risultato a destra |
| `≤ 900px` | Colonna singola, campi a piena larghezza |
| `≤ 640px` | Telefono: campi a 16px (evita lo zoom di iOS), aree di tocco da 44px, barra risultato sticky |

Le tabelle generate via JS vanno avvolte in `<div class="table-scroll">`, che le
fa scorrere orizzontalmente senza sfondare la pagina su schermi stretti.

### Font

IBM Plex è servito da `assets/fonts/` (subset `latin` e `latin-ext`, 148 KB in
tutto), non più via `@import` da Google Fonts: il sito funziona senza rete e non
c'è una richiesta a terzi in serie prima del primo disegno. Le regole
`@font-face` stanno in cima a `base.css`.

IBM Plex Sans diritto è un font **variabile**: un unico file copre i pesi 300,
400 e 600, per questo tre `@font-face` puntano allo stesso `.woff2`.

### Collegamenti alle fonti

Il rimando alla pubblicazione di riferimento nell'header è un link testuale, non
un badge immagine da `shields.io`:

```html
<a class="badge-link" href="https://pubmed.ncbi.nlm.nih.gov/…" target="_blank" rel="noopener">PubMed</a>
```

Si stila da sé a seconda del contesto — bianco traslucido dentro `<header>`,
azzurro su fondo chiaro altrove. Aggiungere `is-name` quando l'etichetta è un
nome proprio o un percorso, che non va maiuscolizzato.

Il sito **non carica alcuna risorsa da domini terzi**: font, immagini e stili
sono tutti locali. È la condizione perché la versione offline funzioni davvero.

### Avvertenza clinica

Ogni strumento mostra un'avvertenza in coda al risultato. I tool a referto usano
`<div class="disclaimer-note">` (stile in `base.css`), `rano-2.0` e
`boston-caa-v2` la propria `.footer-note`.

L'avvertenza compare a schermo e in stampa, ma **non** viene inclusa nel testo
copiato con «Copia Testo per PACS»: quello confluisce in un referto firmato dal
medico. Un nuovo strumento deve prevederne una.

### Barra risultato su mobile

`assets/mobile-result.js` mostra in fondo allo schermo il verdetto sintetico non
appena un risultato esiste, e lo nasconde quando il pannello del risultato è già
visibile. Serve perché in colonna singola il risultato finisce sotto tutto il
modulo. Lo script è generico: riconosce da solo `.diagnosis-box` (referto) e
`.result-main` / `.result-status` (calcolo). Se uno strumento espone il verdetto
altrove, glielo si indica senza toccare lo script:

```html
<div class="output-panel" data-result-summary=".mio-verdetto"> … </div>
```

---

## Aggiungere un nuovo strumento

1. Creare un nuovo file in `tools/`, ad esempio `tools/nuovo-strumento.html`.
2. Includere gli asset condivisi nel `<head>`:
   ```html
   <link rel="stylesheet" href="../assets/nav.css">
   <link rel="stylesheet" href="../assets/base.css">
   <script src="../assets/site-config.js"></script>
   <script src="../assets/nav.js"></script>
   <script src="../assets/mobile-result.js" defer></script>
   ```
   Il `<style>` della pagina va **dopo** `base.css`.
3. Aggiungere una voce a `SITE_TOOLS` in `assets/site-config.js`:
   ```js
   {
     id: "nuovo-strumento",
     title: "Nome dello strumento",
     description: "Breve descrizione di cosa fa.",
     url: "tools/nuovo-strumento.html",
     category: "Categoria",
     subcategory: "Sottocategoria"   // opzionale
   }
   ```
4. Fatto — lo strumento compare automaticamente nella navbar e in home page.

---

## Licenza

Quest'opera è distribuita sotto licenza [Creative Commons Attribuzione – Non Commerciale – Non Opere Derivate 4.0 Internazionale](LICENSE). [![CC BY-NC-ND 4.0](https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-nd/4.0/deed.it)
