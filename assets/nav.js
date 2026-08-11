/* ==========================================================================
   NAVBAR INIETTATA AUTOMATICAMENTE — con categorie e sottocategorie
   --------------------------------------------------------------------------
   Ogni pagina deve solo includere, dentro <head>:

     <link rel="stylesheet" href="ROOT/assets/nav.css">
     <script src="ROOT/assets/site-config.js"></script>
     <script src="ROOT/assets/nav.js"></script>

   dove ROOT è il percorso relativo verso la cartella che contiene index.html:
     - per index.html stesso:        ROOT = "."
     - per le pagine in /tools/:      ROOT = ".."

   Lo script legge il percorso ROOT dall'attributo data-root sul tag <html>,
   ad esempio: <html lang="it" data-root="..">

   Gli strumenti vengono raggruppati per "category" e, se presente, per
   "subcategory" (vedi assets/site-config.js). Ogni categoria diventa un menu
   a tendina; le sottocategorie diventano sezioni dentro il menu. Su schermo
   stretto i menu diventano una fisarmonica dietro il pulsante ☰.

   Lo strumento aperto è segnato come attivo, nel menu e sulla categoria che
   lo contiene: da un tool si arriva a un altro in un tocco, non tornando
   prima alla home.
   ========================================================================== */

(function () {

  function buildTree(tools) {
    var categories = [];
    var byCategory = {};

    tools.forEach(function (t) {
      var cat = t.category || 'Altro';
      if (!byCategory[cat]) {
        byCategory[cat] = { direct: [], subcats: [], bySubcat: {} };
        categories.push(cat);
      }
      var group = byCategory[cat];

      if (t.subcategory) {
        if (!group.bySubcat[t.subcategory]) {
          group.bySubcat[t.subcategory] = [];
          group.subcats.push(t.subcategory);
        }
        group.bySubcat[t.subcategory].push(t);
      } else {
        group.direct.push(t);
      }
    });

    return categories.map(function (cat) {
      return { name: cat, group: byCategory[cat] };
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  /* Confronta l'ultimo segmento del percorso: funziona sia in locale sia
     sotto il sottopercorso di GitHub Pages, dove i percorsi assoluti no. */
  function isCurrent(url) {
    var file = url.split('/').pop();
    var here = window.location.pathname.split('/').pop();
    return file === here && here !== '' && here !== 'index.html';
  }

  function linkHtml(root, t) {
    var attivo = isCurrent(t.url);
    return '<a href="' + root + '/' + escapeHtml(t.url) + '"' +
           (attivo ? ' class="active" aria-current="page"' : '') + '>' +
           escapeHtml(t.title) + '</a>';
  }

  function categoryHtml(root, voce, indice) {
    var g = voce.group;
    var contiene = false;
    var dentro = '';

    g.direct.forEach(function (t) {
      if (isCurrent(t.url)) contiene = true;
      dentro += linkHtml(root, t);
    });

    g.subcats.forEach(function (sub) {
      dentro += '<div class="subcat-label">' + escapeHtml(sub) + '</div>';
      g.bySubcat[sub].forEach(function (t) {
        if (isCurrent(t.url)) contiene = true;
        dentro += linkHtml(root, t);
      });
    });

    var id = 'nav-dropdown-' + indice;
    return '<div class="nav-category">' +
             '<button type="button" class="cat-trigger' + (contiene ? ' active' : '') + '"' +
               ' aria-expanded="false" aria-controls="' + id + '">' +
               escapeHtml(voce.name) +
               '<span class="caret" aria-hidden="true">▾</span>' +
             '</button>' +
             '<div class="nav-dropdown" id="' + id + '">' + dentro + '</div>' +
           '</div>';
  }

  function buildNav() {
    var root = document.documentElement.getAttribute('data-root');
    if (root === null) root = '.';
    if (root.endsWith('/')) root = root.slice(0, -1);

    var siteTitle = window.SITE_TITLE || 'Home';
    var isInfoActive = window.location.pathname.endsWith('info.html');
    var albero = buildTree(window.SITE_TOOLS || []);

    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.innerHTML =
      '<div class="site-nav-inner">' +
        '<a class="site-nav-home" href="' + root + '/index.html">' +
          '<img class="site-nav-logo" src="' + root + '/assets/img/logo-mark.png" alt="" width="23" height="26">' +
          '<span>' + escapeHtml(siteTitle) + '</span>' +
        '</a>' +
        '<button type="button" class="site-nav-toggle" aria-expanded="false"' +
          ' aria-controls="site-nav-links" aria-label="Apri il menu">☰</button>' +
        '<div class="site-nav-links" id="site-nav-links">' +
          albero.map(function (v, i) { return categoryHtml(root, v, i); }).join('') +
        '</div>' +
        '<a href="' + root + '/info.html" class="site-nav-info-link' + (isInfoActive ? ' active' : '') + '"' +
        (isInfoActive ? ' aria-current="page"' : '') + '>Info</a>' +
      '</div>';

    document.body.insertBefore(nav, document.body.firstChild);
    wireNav(nav);
  }

  function wireNav(nav) {
    var links = nav.querySelector('.site-nav-links');
    var toggle = nav.querySelector('.site-nav-toggle');
    var categorie = Array.prototype.slice.call(nav.querySelectorAll('.nav-category'));

    function chiudiTutte(tranne) {
      categorie.forEach(function (c) {
        if (c === tranne) return;
        c.classList.remove('open');
        c.querySelector('.cat-trigger').setAttribute('aria-expanded', 'false');
      });
    }

    categorie.forEach(function (c) {
      var trigger = c.querySelector('.cat-trigger');
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var apri = !c.classList.contains('open');
        chiudiTutte(c);
        c.classList.toggle('open', apri);
        trigger.setAttribute('aria-expanded', String(apri));
      });
    });

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var apri = !links.classList.contains('open');
      links.classList.toggle('open', apri);
      toggle.setAttribute('aria-expanded', String(apri));
      toggle.setAttribute('aria-label', apri ? 'Chiudi il menu' : 'Apri il menu');
      if (!apri) chiudiTutte(null);
    });

    document.addEventListener('click', function (e) {
      if (nav.contains(e.target)) return;
      chiudiTutte(null);
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      /* se c'è una modale aperta tocca a lei: se ne occupa app.js */
      if (document.querySelector('.tutorial-overlay.open, .guide-overlay.open')) return;
      chiudiTutte(null);
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
