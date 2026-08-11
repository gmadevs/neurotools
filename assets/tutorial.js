/* ==========================================================================
   MODALE TUTORIAL — MACCHINARIO CONDIVISO
   --------------------------------------------------------------------------
   Il contenuto dei passi cambia da strumento a strumento ed è giusto che
   resti nel tool. Quello che era ricopiato sette volte è il macchinario che
   li mostra: apertura, chiusura, avanti/indietro, pallini di avanzamento.
   Le cinque funzioni erano identiche in tutti e sette i file — l'unica
   differenza, in suture-craniche, erano i nomi di due variabili locali.

   Uso, nel tool:

     <script src="../assets/tutorial.js"></script>
     ...
     const TUTORIAL_STEPS = [ { title: '…', body: '…' }, … ];
     initTutorial(TUTORIAL_STEPS);

   initTutorial esplicito e non lettura automatica di TUTORIAL_STEPS: le
   dichiarazioni con const in cima a uno <script> classico creano un binding
   lessicale globale, che NON compare su window. Passarlo a mano funziona in
   ogni caso e dice a chi legge da dove arrivano i dati.

   Il markup atteso (già presente in tutti i tool):
     #tutorialOverlay  .tutorial-overlay   contenitore, chiude se ci si clicca
     #stepBar                              pallini di avanzamento
     #tutorialBody                         corpo del passo
     #btnPrev #btnNext                     navigazione

   La chiusura col tasto Indietro di Android e con Escape la aggiunge
   assets/app.js, che osserva la classe .open: qui non serve saperlo.
   ========================================================================== */

(function () {
  'use strict';

  var passi = [];
  var corrente = 0;

  function el(id) { return document.getElementById(id); }

  function render() {
    var totale = passi.length;
    var i = corrente;
    var passo = passi[i];
    if (!passo) return;

    var bar = el('stepBar');
    if (bar) {
      bar.innerHTML = passi.map(function (_, idx) {
        var cls = idx < i ? 'done' : idx === i ? 'active' : '';
        return '<div class="step-dot ' + cls + '"></div>';
      }).join('');
    }

    var corpo = el('tutorialBody');
    if (corpo) {
      corpo.innerHTML =
        '<div class="step-number">Passo ' + (i + 1) + ' di ' + totale + '</div>' +
        '<h3>' + passo.title + '</h3>' +
        passo.body;
    }

    var prec = el('btnPrev');
    if (prec) prec.style.visibility = i === 0 ? 'hidden' : 'visible';

    var succ = el('btnNext');
    if (!succ) return;
    if (i === totale - 1) {
      succ.textContent = '✓ Ho capito';
      succ.className = 'btn-tut-next finish';
      succ.onclick = chiudi;
    } else {
      succ.innerHTML = 'Avanti &#8594;';
      succ.className = 'btn-tut-next';
      succ.onclick = function () { vai(1); };
    }
  }

  function apri() {
    corrente = 0;
    render();
    var ov = el('tutorialOverlay');
    if (ov) ov.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function chiudi() {
    var ov = el('tutorialOverlay');
    if (ov) ov.classList.remove('open');
    document.body.style.overflow = '';
  }

  function vai(dir) {
    var prossimo = corrente + dir;
    if (prossimo < 0 || prossimo >= passi.length) return;
    corrente = prossimo;
    render();
  }

  /* chiude solo se il clic è sullo sfondo, non dentro la modale */
  function clicSuSfondo(e) {
    if (e.target === el('tutorialOverlay')) chiudi();
  }

  window.initTutorial = function (elenco) { passi = elenco || []; };

  /* i tool le richiamano da onclick= nel markup: devono restare globali */
  window.openTutorial = apri;
  window.closeTutorial = chiudi;
  window.tutStep = vai;
  window.handleOverlayClick = clicSuSfondo;
})();
