# Neuro-tools

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-live-brightgreen?logo=github)](https://gmadevs.github.io/neurotools/)
[![License: CC0-1.0](https://img.shields.io/badge/License-CC0%201.0-lightgrey.svg)](LICENSE)
[![Made with HTML](https://img.shields.io/badge/Made%20with-HTML%2FCSS%2FJS-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/gmadevs/neurotools/pulls)

> Raccolta di strumenti clinici basati su evidenza per la neuroradiologia generale, pediatrica e neonatale, pubblicati come sito statico tramite GitHub Pages.

---

## Panoramica

**Neuro-tools** è una raccolta open-source di strumenti clinici che girano interamente nel browser — senza backend, senza login, senza raccolta di dati. Ogni strumento è autonomo e basato su riferimenti bibliografici pubblicati.

Gli strumenti sono organizzati per categoria clinica e compaiono automaticamente nella barra di navigazione e nella home page non appena vengono registrati nel file di configurazione centrale.

---

## Strumenti disponibili

| Strumento | Categoria | Riferimento |
|-----------|-----------|-------------|
| [Suture Craniche](tools/suture-craniche.html) | Ecografia Pediatrica | Rozovsky et al., 2018 |

---

## Struttura del progetto

```
.
├── index.html              ← Home page (card generate automaticamente)
├── assets/
│   ├── site-config.js      ← Registro centrale di tutti gli strumenti
│   ├── nav.css             ← Stili della navbar
│   └── nav.js              ← Script di iniezione della navbar
└── tools/
    └── suture-craniche.html
```

### Come funziona

`assets/site-config.js` è la **fonte delle tools**: contiene l'array `SITE_TOOLS` con titolo, descrizione, categoria, sottocategoria opzionale e URL di ogni strumento.

- `nav.js` legge quell'array e **costruisce automaticamente la navbar** su ogni pagina.
- `index.html` legge lo stesso array e **genera automaticamente le card** della home, raggruppate per categoria e sottocategoria.

Per aggiungere un nuovo strumento bastano due passi: creare la pagina HTML e aggiungere una riga in `site-config.js`. Nessuna modifica manuale alla navbar o alla home.

---

## Aggiungere un nuovo strumento

1. Creare un nuovo file in `tools/`, ad esempio `tools/nuovo-strumento.html`.
2. Includere gli asset condivisi nel `<head>`:
   ```html
   <link rel="stylesheet" href="../assets/nav.css">
   <script src="../assets/site-config.js"></script>
   <script src="../assets/nav.js"></script>
   ```
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

Rilasciato sotto licenza [CC0 1.0 Universal](LICENSE) — dominio pubblico, nessuna restrizione d'uso.
