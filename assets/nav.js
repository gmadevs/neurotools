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
   "subcategory" (vedi assets/site-config.js). Ogni categoria diventa un
   menu a tendina nella navbar; le sottocategorie diventano sezioni dentro
   il menu.
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

  function buildNav() {
    var root = document.documentElement.getAttribute('data-root');
    if (root === null) root = '.';
    if (root.endsWith('/')) root = root.slice(0, -1);

    var siteTitle = window.SITE_TITLE || 'Home';
    var currentPath = window.location.pathname;
    var isInfoActive = currentPath.endsWith('info.html');

    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.innerHTML =
      '<div class="site-nav-inner">' +
        '<a class="site-nav-home" href="' + root + '/index.html">' + escapeHtml(siteTitle) + '</a>' +
        '<a href="' + root + '/info.html" class="site-nav-info-link' + (isInfoActive ? ' active' : '') + '"' +
        (isInfoActive ? ' aria-current="page"' : '') + '>Info</a>' +
      '</div>';

    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
