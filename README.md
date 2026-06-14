# I miei strumenti clinici – sito statico per GitHub Pages

## Struttura del progetto

```
.
├── index.html              ← pagina iniziale (landing page)
├── assets/
│   ├── site-config.js      ← elenco di tutti gli strumenti (titolo, descrizione, link)
│   ├── nav.css              ← stile della barra di navigazione
│   └── nav.js               ← script che inietta la navbar in ogni pagina
└── tools/
    └── suture-craniche.html ← il tuo strumento (e qui aggiungerai i prossimi)
```

## Come funziona

- `assets/site-config.js` è la **fonte unica di verità**: contiene un array
  `SITE_TOOLS` con titolo, breve descrizione, categoria, sottocategoria
  (opzionale) e percorso di ogni pagina/strumento.
- `assets/nav.js` legge quell'elenco e costruisce automaticamente la barra di
  navigazione in alto, in ogni pagina che lo include. Ogni `category` diventa
  una voce con menu a tendina; se alcuni strumenti hanno anche una
  `subcategory`, questa appare come intestazione di sezione dentro il menu.
- `index.html` legge lo stesso elenco e genera automaticamente le card della
  home page, raggruppate allo stesso modo (categoria → eventuale
  sottocategoria).

Quindi per aggiungere un nuovo strumento **non devi toccare la navbar né la
home a mano**: basta aggiungere una riga in `site-config.js`.

### Categorie e sottocategorie

```js
{
  id: "suture-craniche",
  title: "Suture Craniche",
  description: "...",
  url: "tools/suture-craniche.html",
  category: "Neonatologia",     // voce di primo livello (menu a tendina)
  subcategory: "Encefalo"        // voce di secondo livello (sezione nel menu)
}
```

- Strumenti con la stessa `category` vengono raggruppati sotto lo stesso
  menu a tendina nella navbar.
- Se uno strumento non ha `subcategory`, compare direttamente in cima al
  menu della sua categoria.
- Se più strumenti condividono la stessa `subcategory`, vengono mostrati
  insieme sotto un'intestazione di sezione all'interno del menu.
- Funziona a qualsiasi numero di livelli "categoria → sottocategoria → voci";
  non è previsto un terzo livello, ma in genere due bastano e avanzano per
  restare navigabili.

## Come pubblicare su GitHub Pages

1. Crea un nuovo repository su GitHub (es. `strumenti-clinici`), pubblico o
   privato (GitHub Pages è gratuito anche per repo privati su account
   personali, ma per i privati Pages è disponibile solo con GitHub Pro/Team/
   Enterprise — su un repo pubblico funziona sempre con qualsiasi piano).
2. Carica questi file mantenendo la struttura delle cartelle (puoi fare
   "Add file → Upload files" da browser, oppure con git):
   ```
   git init
   git add .
   git commit -m "Primo deploy del sito"
   git branch -M main
   git remote add origin https://github.com/<tuo-utente>/<tuo-repo>.git
   git push -u origin main
   ```
3. Nel repository, vai su **Settings → Pages**.
4. In "Build and deployment", scegli come **Source**: `Deploy from a branch`.
5. Seleziona il branch `main` e la cartella `/ (root)`, poi **Save**.
6. Dopo circa un minuto il sito sarà visibile su:
   ```
   https://<tuo-utente>.github.io/<tuo-repo>/
   ```

## Come aggiungere un nuovo strumento

1. Crea il nuovo file dentro `tools/`, ad esempio `tools/nuovo-strumento.html`.
2. All'inizio del file, nel tag `<html>`, imposta `data-root=".."` (perché il
   file è dentro una sottocartella) e includi nel `<head>`:
   ```html
   <link rel="stylesheet" href="../assets/nav.css">
   <script src="../assets/site-config.js"></script>
   <script src="../assets/nav.js"></script>
   ```
   (puoi copiare queste righe da `tools/suture-craniche.html`)
3. Apri `assets/site-config.js` e aggiungi una nuova voce all'array
   `SITE_TOOLS`, ad esempio:
   ```js
   ,{
     id: "nuovo-strumento",
     title: "Nome dello strumento",
     description: "Breve descrizione di cosa fa.",
     url: "tools/nuovo-strumento.html",
     category: "Categoria"
   }
   ```
4. Fatto: lo strumento apparirà automaticamente nella navbar (su tutte le
   pagine) e nella home page, raggruppato per categoria.

## Note

- La navbar è "statica" (non `fixed`), quindi non serve aggiungere padding
  per evitare sovrapposizioni con il contenuto della pagina.
- Lo stile della navbar è volutamente neutro (sfondo scuro) così convive bene
  con le palette di colore diverse che ogni singola pagina può avere.
- Ogni categoria con più di una voce si apre come menu a tendina al click
  (si chiude cliccando altrove, su un'altra categoria, o con Esc).
- Su schermi piccoli (sotto 720px) tutta la navbar diventa un menu a
  comparsa con l'icona ☰, e le categorie diventano sezioni a fisarmonica.
