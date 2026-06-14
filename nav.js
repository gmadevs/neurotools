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

    var tools = window.SITE_TOOLS || [];
    var siteTitle = window.SITE_TITLE || 'Home';
    var currentFile = window.location.pathname.split('/').pop();

    var tree = buildTree(tools);

    function linkHtml(t) {
      var isActive = t.url.split('/').pop() === currentFile;
      return '<a href="' + root + '/' + escapeHtml(t.url) + '"' +
             (isActive ? ' class="active" aria-current="page"' : '') +
             '>' + escapeHtml(t.title) + '</a>';
    }

    function categoryContainsActive(group) {
      var all = group.direct.concat(
        group.subcats.reduce(function (acc, s) { return acc.concat(group.bySubcat[s]); }, [])
      );
      return all.some(function (t) { return t.url.split('/').pop() === currentFile; });
    }

    var categoriesHtml = tree.map(function (entry) {
      var group = entry.group;
      var isActiveCat = categoryContainsActive(group);

      var menuHtml = '';
      group.direct.forEach(function (t) { menuHtml += linkHtml(t); });
      group.subcats.forEach(function (sub) {
        menuHtml += '<div class="subcat-label">' + escapeHtml(sub) + '</div>';
        group.bySubcat[sub].forEach(function (t) { menuHtml += linkHtml(t); });
      });

      return (
        '<div class="nav-category">' +
          '<button class="cat-trigger' + (isActiveCat ? ' active' : '') + '" aria-expanded="false">' +
            escapeHtml(entry.name) +
            '<svg class="caret" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 3 L5 7 L9 3" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<div class="nav-dropdown">' + menuHtml + '</div>' +
        '</div>'
      );
    }).join('');

    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.innerHTML =
      '<div class="site-nav-inner">' +
        '<a class="site-nav-home" href="' + root + '/index.html">' + escapeHtml(siteTitle) + '</a>' +
        '<button class="site-nav-toggle" aria-label="Apri menu" aria-expanded="false">&#9776;</button>' +
        '<div class="site-nav-links">' + categoriesHtml + '</div>' +
      '</div>';

    document.body.insertBefore(nav, document.body.firstChild);

    // ── interazioni ──
    var mainToggle = nav.querySelector('.site-nav-toggle');
    var links = nav.querySelector('.site-nav-links');
    mainToggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      mainToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    var triggers = nav.querySelectorAll('.cat-trigger');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var category = btn.closest('.nav-category');
        var willOpen = !category.classList.contains('open');

        // chiudi tutte le altre categorie aperte
        nav.querySelectorAll('.nav-category.open').forEach(function (c) {
          c.classList.remove('open');
          c.querySelector('.cat-trigger').setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
          category.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // chiudi i menu cliccando fuori dalla navbar
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) {
        nav.querySelectorAll('.nav-category.open').forEach(function (c) {
          c.classList.remove('open');
          c.querySelector('.cat-trigger').setAttribute('aria-expanded', 'false');
        });
      }
    });

    // chiudi i menu con tasto Esc
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        nav.querySelectorAll('.nav-category.open').forEach(function (c) {
          c.classList.remove('open');
          c.querySelector('.cat-trigger').setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
