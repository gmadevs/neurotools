/* ==========================================================================
   SERVICE WORKER — IL SITO FUNZIONA SENZA RETE
   --------------------------------------------------------------------------
   Serve perché questi strumenti si usano in sala RM e in TIN, dove la rete
   non è un dato acquisito, e perché installata come app non c'è la barra
   degli indirizzi: senza rete l'utente vedrebbe una pagina di errore a tutto
   schermo dentro quella che per lui è un'app, indistinguibile da un crash.

   Due strategie diverse, di proposito:

   - le PAGINE vanno prima in rete, e ricadono sulla copia solo se la rete
     non risponde. Sono calcolatori clinici: se un valore di riferimento
     viene corretto, la correzione deve arrivare al primo caricamento utile,
     non al secondo. La copia in cache è la rete di sicurezza, non la fonte.

   - tutto il RESTO (css, js, font, icone) viene dalla cache e si aggiorna in
     sottofondo. Sono file che cambiano solo insieme a un rilascio, e
     prenderli dalla cache è ciò che rende l'avvio immediato.

   PER RILASCIARE UNA MODIFICA: alzare VERSIONE qui sotto. Senza, i file
   statici restano quelli in cache e la modifica non arriva.
   ========================================================================== */

const VERSIONE = 'neurotools-v17';

/* Percorsi relativi al service worker: così valgono sia su dominio proprio
   sia sotto il sottopercorso di GitHub Pages (/neurotools/). */
const PRECACHE = [
  './',
  './index.html',
  './info.html',
  './tools/aspects.html',
  './tools/biometria-fetale-rm.html',
  './tools/boston-caa-v2.html',
  './tools/doppler-cerebrale-neonatale.html',
  './tools/ipofisi-rm-pediatrica.html',
  './tools/mrpi.html',
  './tools/phvd.html',
  './tools/rano-2.0.html',
  './tools/stenosi-carotidea.html',
  './tools/suture-craniche.html',
  './assets/base.css',
  './assets/nav.css',
  './assets/nav.js',
  './assets/site-config.js',
  './assets/mobile-result.js',
  './assets/app.js',
  './assets/report-actions.js',
  './assets/tutorial.js',
  './assets/fonts/ibm-plex-mono-400-latin-ext.woff2',
  './assets/fonts/ibm-plex-mono-400-latin.woff2',
  './assets/fonts/ibm-plex-mono-600-latin-ext.woff2',
  './assets/fonts/ibm-plex-mono-600-latin.woff2',
  './assets/fonts/ibm-plex-sans-italic-latin-ext.woff2',
  './assets/fonts/ibm-plex-sans-italic-latin.woff2',
  './assets/fonts/ibm-plex-sans-latin-ext.woff2',
  './assets/fonts/ibm-plex-sans-latin.woff2',
  './assets/img/logo-mark.png',
  './assets/img/favicon-32.png',
  './assets/img/apple-touch-icon.png',
  './assets/img/og-cover.png',
  './assets/img/biometria-fetale-misure-2d.jpg',
  './assets/img/mrpi-misure.jpg',
  './about.jpeg',
  './favicon.ico',
  './site.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(VERSIONE)
      /* addAll fallisce in blocco se un solo file manca: si mette in cache uno
         per uno, così un asset rinominato non lascia l'app senza offline. */
      .then(function (cache) {
        return Promise.all(PRECACHE.map(function (url) {
          return cache.add(url).catch(function () {
            console.warn('[sw] non precaricato:', url);
          });
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (nomi) {
        return Promise.all(nomi
          .filter(function (n) { return n !== VERSIONE; })
          .map(function (n) { return caches.delete(n); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;

  /* Solo GET dello stesso sito: le richieste altrui non si intercettano. */
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  /* PAGINE — prima la rete */
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          const copia = res.clone();
          caches.open(VERSIONE).then(function (c) { c.put(req, copia); });
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (hit) {
            return hit || caches.match('./index.html');
          });
        })
    );
    return;
  }

  /* RESTO — prima la cache, aggiornamento in sottofondo */
  e.respondWith(
    caches.match(req).then(function (hit) {
      const rete = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          const copia = res.clone();
          caches.open(VERSIONE).then(function (c) { c.put(req, copia); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || rete;
    })
  );
});
