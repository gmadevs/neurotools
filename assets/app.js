/* ==========================================================================
   COMPORTAMENTI DA APP — CONDIVISI DA TUTTE LE PAGINE
   --------------------------------------------------------------------------
   Tre cose che servono quando il sito è installato come app e la barra del
   browser non c'è più. Vanno incluse nel <head> di ogni pagina, dopo nav.js:

     <script src="ROOT/assets/app.js"></script>

   1. registrazione del service worker (funzionamento senza rete)
   2. i campi compilati sopravvivono a una sospensione dell'app
   3. il tasto Indietro di Android chiude la modale invece di uscire

   È volutamente generico: non conosce la logica dei singoli strumenti.
   ========================================================================== */

(function () {
  'use strict';

  function root() {
    var r = document.documentElement.getAttribute('data-root');
    if (r === null) r = '.';
    return r.endsWith('/') ? r.slice(0, -1) : r;
  }

  /* ══ 1. SERVICE WORKER ═══════════════════════════════════════════════════ */

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(root() + '/sw.js').catch(function (e) {
        console.warn('[app] service worker non registrato:', e);
      });
    });
  }

  /* ══ 2. MEMORIA DEI CAMPI ════════════════════════════════════════════════
     In sessionStorage e NON in localStorage, deliberatamente.

     Il problema da risolvere è che Android sospende l'app mentre si va a
     leggere una misura sul PACS: si torna e il modulo è vuoto. Per quello
     basta la durata della sessione.

     Qui dentro passano però data di nascita e misure di un paziente. Su una
     postazione di reparto condivisa, localStorage le lascerebbe sul disco a
     tempo indeterminato, leggibili dal collega che apre l'app dopo: un dato
     clinico che sopravvive a chi l'ha inserito. sessionStorage tiene i campi
     finché l'app resta aperta e li butta alla chiusura, che è esattamente il
     confine giusto.
     --------------------------------------------------------------------- */

  var CHIAVE = 'neurotools:' + location.pathname;

  function campi() {
    return Array.prototype.filter.call(
      document.querySelectorAll('input, select, textarea'),
      function (el) {
        if (el.dataset.noMemory !== undefined) return false;
        if (el.type === 'button' || el.type === 'submit' || el.type === 'file') return false;
        return !!el.id;
      }
    );
  }

  function salva() {
    try {
      var dati = {};
      campi().forEach(function (el) {
        dati[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value;
      });
      sessionStorage.setItem(CHIAVE, JSON.stringify(dati));
    } catch (e) { /* quota piena o storage negato: si perde la memoria, non il tool */ }
  }

  function ripristina() {
    var dati;
    try {
      dati = JSON.parse(sessionStorage.getItem(CHIAVE) || 'null');
    } catch (e) { return; }
    if (!dati) return;

    var toccati = [];
    campi().forEach(function (el) {
      if (!(el.id in dati)) return;
      var v = dati[el.id];
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked === v) return;
        el.checked = v;
      } else {
        if (el.value === v || v === '') return;
        el.value = v;
      }
      toccati.push(el);
    });

    /* Gli strumenti ricalcolano su input/change: senza rilanciare gli eventi
       i campi tornerebbero pieni ma il referto resterebbe vuoto. */
    toccati.forEach(function (el) {
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function avviaMemoria() {
    /* Dopo l'inizializzazione degli strumenti: app.js sta nel <head>, quindi
       il suo DOMContentLoaded scatta prima di quello dei tool, e un ripristino
       anticipato verrebbe sovrascritto da chi azzera i campi all'avvio. */
    setTimeout(function () {
      ripristina();
      document.addEventListener('input', salva, true);
      document.addEventListener('change', salva, true);
      window.addEventListener('pagehide', salva);
    }, 0);
  }

  /* ══ 3. TASTO INDIETRO E MODALI ══════════════════════════════════════════
     Tutti gli strumenti aprono le modali aggiungendo .open all'overlay, quindi
     si può fare da qui senza toccarne il codice. Installata come app non c'è
     una X del browser: senza questo il gesto Indietro sulla modale del
     tutorial porta fuori dalla pagina invece di chiuderla.
     --------------------------------------------------------------------- */

  var SELETTORE = '.tutorial-overlay, .guide-overlay';
  var statoNostro = false;   /* abbiamo una voce nostra nella cronologia? */
  var stiamoTornando = false;

  function aperta() {
    return document.querySelector(SELETTORE + '.open');
  }

  /* Chi apre la modale blocca lo scroll della pagina sotto (overflow: hidden
     sul body). Chiudendo da qui — gesto Indietro o Escape — non passiamo dalla
     funzione di chiusura dello strumento, quindi quel blocco va tolto a mano:
     senza, la modale sparisce e la pagina resta immobile. */
  function chiudi(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function avviaModali() {
    var overlays = document.querySelectorAll(SELETTORE);
    if (!overlays.length) return;

    new MutationObserver(function () {
      var o = aperta();
      if (o && !statoNostro) {
        history.pushState({ ntModal: true }, '');
        statoNostro = true;
      } else if (!o && statoNostro && !stiamoTornando) {
        /* chiusa dal suo pulsante: si toglie anche la voce di cronologia,
           altrimenti il primo Indietro dopo la chiusura non farebbe nulla */
        stiamoTornando = true;
        history.back();
      }
    }).observe(document.body, {
      subtree: true, attributes: true, attributeFilter: ['class']
    });

    window.addEventListener('popstate', function () {
      var o = aperta();
      statoNostro = false;
      if (o) {
        stiamoTornando = true;
        chiudi(o);
      }
      stiamoTornando = false;
    });

    /* Escape: lo gestiva solo uno strumento su sette */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var o = aperta();
      if (o) { e.preventDefault(); chiudi(o); }
    });
  }

  function avvia() { avviaMemoria(); avviaModali(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', avvia);
  } else {
    avvia();
  }
})();
