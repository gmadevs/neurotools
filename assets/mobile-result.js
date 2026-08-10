/* ==========================================================================
   BARRA RISULTATO STICKY SU MOBILE
   --------------------------------------------------------------------------
   Su schermo stretto il workspace a due colonne diventa una colonna sola e
   il risultato finisce sotto tutto il modulo: su RANO 2.0 il pannello del
   referto iniziava a ~1500px di scroll. Si compilano i campi senza vedere
   nulla di ciò che si sta calcolando.

   Questo script mostra in fondo allo schermo una barra con il verdetto
   sintetico non appena un risultato esiste, e la nasconde da sola quando il
   pannello del risultato è già sotto gli occhi. Toccandola si scorre al
   referto completo.

   È volutamente generico: non conosce la logica dei singoli strumenti,
   osserva soltanto il pannello di output. Per includerlo basta:

     <script src="../assets/mobile-result.js" defer></script>

   Se uno strumento espone il verdetto in un elemento non previsto, si può
   indicarlo senza toccare questo file:

     <div class="output-panel" data-result-summary=".mio-verdetto"> ... </div>
   ========================================================================== */

(function () {
  'use strict';

  var MOBILE_QUERY = '(max-width: 640px)';

  /* Testi che i tool mostrano quando un risultato non c'è ancora: se la barra
     li ripetesse comparirebbe subito, prima che ci sia qualcosa da vedere. */
  var EMPTY = /^(—|–|-|n\/?d|in attesa[\s\S]*)$/i;

  var clean = function (el) {
    return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  };

  function init() {
    var panel = document.querySelector('.output-panel, .report-panel');
    if (!panel) return;

    var mq = window.matchMedia(MOBILE_QUERY);
    var bar = buildBar();
    document.body.appendChild(bar);

    var panelVisible = false;
    var lastText = null;

    /* --- lettura del verdetto ------------------------------------------ */

    function readSummary() {
      /* selettore indicato dallo strumento, se presente */
      var custom = panel.getAttribute('data-result-summary');
      if (custom) {
        var c = clean(panel.querySelector(custom));
        if (c && !EMPTY.test(c)) return { label: 'Risultato', value: c };
      }

      /* strumenti a referto: <div class="diagnosis-box"><h3>DIAGNOSI</h3><p>…</p> */
      var box = panel.querySelector('.diagnosis-box');
      if (box) {
        var verdict = clean(box.querySelector('p'));
        if (verdict && !EMPTY.test(verdict)) {
          return { label: clean(box.querySelector('h3')) || 'Risultato', value: verdict };
        }
      }

      /* strumenti a calcolo: .result-main è il valore, .result-status l'etichetta */
      var main = clean(panel.querySelector('.result-main'));
      if (main && !EMPTY.test(main)) {
        var status = clean(panel.querySelector('.result-status, .result-badge'));
        return {
          label: status && !EMPTY.test(status) ? status : 'Risultato',
          value: main
        };
      }

      /* nessun verdetto sintetico, ma il referto è stato generato */
      if (panel.querySelector('.report-card')) {
        return { label: 'Referto', value: 'Pronto' };
      }

      return null;
    }

    /* --- aggiornamento della barra ------------------------------------- */

    function update() {
      if (!mq.matches) {
        hide();
        return;
      }

      var summary = readSummary();
      if (!summary) {
        hide();
        return;
      }

      if (summary.value !== lastText) {
        bar.querySelector('.result-bar-label').textContent = summary.label;
        bar.querySelector('.result-bar-value').textContent = summary.value;
        lastText = summary.value;
      }

      /* se il risultato è già a schermo la barra è solo ingombro */
      if (panelVisible) hide();
      else show();
    }

    function show() {
      if (bar.classList.contains('visible')) return;
      bar.classList.add('visible');
      bar.removeAttribute('aria-hidden');
      /* riserva in fondo alla pagina lo spazio che la barra occupa */
      document.documentElement.style.setProperty(
        '--resultbar-h', bar.offsetHeight + 'px'
      );
    }

    function hide() {
      if (!bar.classList.contains('visible')) return;
      bar.classList.remove('visible');
      bar.setAttribute('aria-hidden', 'true');
      document.documentElement.style.setProperty('--resultbar-h', '0px');
    }

    /* --- osservatori ---------------------------------------------------- */

    /* il contenuto del referto è riscritto via innerHTML a ogni calcolo */
    new MutationObserver(update).observe(panel, {
      childList: true, subtree: true, characterData: true
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        panelVisible = entries[0].isIntersecting;
        update();
      }, { threshold: 0.15 }).observe(panel);
    }

    /* Safari < 14 non ha addEventListener su MediaQueryList */
    if (mq.addEventListener) mq.addEventListener('change', update);
    else if (mq.addListener) mq.addListener(update);

    bar.addEventListener('click', function () {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    update();
  }

  function buildBar() {
    var bar = document.createElement('button');
    bar.type = 'button';
    bar.className = 'result-bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML =
      '<span class="result-bar-text">' +
        '<span class="result-bar-label"></span>' +
        '<span class="result-bar-value"></span>' +
      '</span>' +
      '<span class="result-bar-cta">Vedi referto</span>';
    return bar;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
