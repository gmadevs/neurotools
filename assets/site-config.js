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
    title: "Suture craniche",
    description: "Referto ecografico per la valutazione delle suture craniche",
    url: "tools/suture-craniche.html",
    category: "Pediatrica",
    subcategory: "Ecografia"
  }

  ,{
    id: "doppler-cerebrale-neonatale",
    title: "Doppler neonatale",
    description: "Valori doppler (ACA e MCA) nel prematuro, con centili per GA e età postnatale",
    url: "tools/doppler-cerebrale-neonatale.html",
    category: "Pediatrica",
    subcategory: "Ecografia"
  }

  ,{
    id: "ipofisi-rm-pediatrica",
    title: "Biometria ipofisi",
    description: "Centili per le misure RM dell'ipofisi (altezza, larghezza, volume, rapporto PS/BA) dal neonato all'adolescente",
    url: "tools/ipofisi-rm-pediatrica.html",
    category: "Pediatrica",
    subcategory: "Risonanza Magnetica"
  }

  ,{
    id: "rano-2.0",
    title: "RANO 2.0",
    description: "Calcolatore della risposta radiologica secondo i criteri RANO 2.0, con supporto per misure 2D e volumetria 3D.",
    url: "tools/rano-2.0.html",
    category: "Neuro-oncologia"
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
