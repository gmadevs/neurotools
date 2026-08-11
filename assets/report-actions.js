/* ==========================================================================
   COPIA DEL REFERTO NEGLI APPUNTI — CONDIVISA
   --------------------------------------------------------------------------
   Il testo del referto lo costruisce ogni strumento per conto suo, ed è
   giusto così: cambia da tool a tool. Quello che era copiato sette volte è
   solo la coda — scrivere negli appunti e dare conferma sul pulsante — e le
   sette copie non erano identiche:

     - sei chiamavano navigator.clipboard.writeText senza verificarlo prima:
       fuori da un contesto sicuro (apertura del file da disco, prova da IP
       di rete locale) l'oggetto non esiste e partiva un'eccezione invece del
       ripiego sulla textarea;
     - phvd lo verificava ma non aveva .catch: se la scrittura veniva negata
       dai permessi non succedeva niente, senza che l'utente lo sapesse.

   Qui il ripiego c'è sempre, e se falliscono entrambe le strade l'utente
   viene avvisato: su un referto da incollare nel PACS, un "copiato" che non
   ha copiato è peggio di un errore.

   Uso:
     <script src="ROOT/assets/report-actions.js"></script>
     copiaPerPACS(testo, document.getElementById('btnCopy'));
   ========================================================================== */

(function () {
  'use strict';

  var ATTESA = 2500;

  function conferma(btn, testo, classe) {
    if (!btn) return;
    if (btn.dataset.testoOriginale === undefined) {
      btn.dataset.testoOriginale = btn.textContent;
    }
    btn.textContent = testo;
    if (classe) btn.classList.add(classe);
    clearTimeout(btn._timerCopia);
    btn._timerCopia = setTimeout(function () {
      btn.textContent = btn.dataset.testoOriginale;
      btn.classList.remove('copied');
    }, ATTESA);
  }

  /* Ripiego per contesti non sicuri: execCommand è deprecato ma è l'unica
     strada quando navigator.clipboard non c'è. */
  function conTextarea(testo) {
    try {
      var ta = document.createElement('textarea');
      ta.value = testo;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  window.copiaPerPACS = function (testo, btn) {
    if (!testo) return;

    function riuscito() { conferma(btn, '✓ Copiato!', 'copied'); }
    function fallito() {
      conferma(btn, '✗ Copia non riuscita');
      /* l'utente deve poterlo prendere lo stesso */
      window.prompt('Copia manualmente il referto (Ctrl+C / Cmd+C):', testo);
    }

    if (navigator.clipboard && navigator.clipboard.writeText &&
        window.isSecureContext !== false) {
      navigator.clipboard.writeText(testo).then(riuscito, function () {
        if (conTextarea(testo)) riuscito(); else fallito();
      });
      return;
    }

    if (conTextarea(testo)) riuscito(); else fallito();
  };
})();
