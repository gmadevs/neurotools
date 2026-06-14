/* ==========================================================================
   CONFIGURAZIONE CENTRALE DEL SITO
   --------------------------------------------------------------------------
   Per aggiungere un nuovo strumento:
   1. Crea il file html dentro la cartella /tools/  (es. tools/nuovo-strumento.html)
   2. Aggiungi una riga qui sotto nell'array SITE_TOOLS
   3. Fatto: comparirà automaticamente nella navbar (raggruppato per
      categoria/sottocategoria) e nella home page.

   Campi:
   - id:          identificativo univoco (usato solo internamente)
   - title:       nome breve mostrato nei menu e nelle card
   - description: descrizione mostrata nella card della home
   - url:         percorso relativo alla ROOT del sito (a partire da index.html)
   - category:    voce di primo livello nella navbar (es. "Neonatologia")
   - subcategory: (opzionale) voce di secondo livello dentro la categoria
                   (es. "Encefalo"). Se omessa, lo strumento appare
                   direttamente nel menu della categoria, senza sotto-gruppo.

   L'ordine nell'array determina l'ordine di visualizzazione di categorie,
   sottocategorie e strumenti.
   ========================================================================== */

window.SITE_TITLE = "Neuro-tools";

window.SITE_TOOLS = [
  {
    id: "suture-craniche",
    title: "Suture Craniche",
    description: "Generatore di referto ecografico per le suture craniche, basato sui centili di Rozovsky et al. 2018.",
    url: "tools/suture-craniche.html",
    category: "Pediatrica",
    subcategory: "Ecografia"
  }

  /* Esempi per aggiungere nuovi strumenti, anche annidati:

  ,{
    id: "midollare-renale",
    title: "Ecografia Renale",
    description: "Valutazione della differenziazione cortico-midollare nel neonato.",
    url: "tools/eco-renale.html",
    category: "Neonatologia",
    subcategory: "Addome"
  }

  // Strumento senza sottocategoria: appare direttamente nel menu "Pediatria"
  ,{
    id: "crescita",
    title: "Curve di Crescita",
    description: "Calcolo dei percentili di peso, lunghezza e circonferenza cranica.",
    url: "tools/curve-crescita.html",
    category: "Pediatria"
  }
  */
];
