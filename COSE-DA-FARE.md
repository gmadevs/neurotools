# Cose da fare

Appunti di lavoro: cosa manca, in che ordine, e — soprattutto — **perché** le
cose sono come sono. Le decisioni non ovvie sono spiegate: senza la ragione,
fra sei mesi sembrano arbitrarie e qualcuno le disfa.

---

## Prima di pubblicare l'APK

- [ ] **Legare `VERSIONE` di `sw.js` al rilascio.** È l'unica cosa che
      l'impianto chiede di ricordare a mano: se non la alzi, i browser
      continuano a servire css e js dalla cache e la modifica non arriva.
      Durante lo sviluppo è già successo — il tema scuro sembrava non
      funzionare, era la cache. Va automatizzato prima dello store, perché in
      un'app installata l'utente non ha il ricaricamento forzato del browser.
- [ ] **Screenshot per la scheda Play** (almeno due, telefono). Icona 512 e
      feature graphic 1024×500 ci sono già in `assets/img/`.
- [ ] **Health apps policy di Play**: gli strumenti clinici richiedono una
      dichiarazione. Il `.disclaimer-note` in coda al referto è il tipo di
      contenuto che chiedono.
- [ ] **Provare su un telefono vero**, non solo in emulazione: la tastiera che
      compare per i campi con `inputmode="decimal"` cambia da IME a IME, ed è
      il motivo per cui esiste quell'attributo.

## Impalcatura condivisa (in corso)

Il costo che cresce con ogni strumento nuovo non è la navigazione — quella sta
in 508 righe centralizzate e cambiarla costa uguale con 7 o con 30 tool. È il
contorno ricopiato dentro ogni file.

- [x] copia negli appunti → `assets/report-actions.js`
- [x] macchinario del tutorial → `assets/tutorial.js` (−370 righe)
- [ ] **scheletro del referto**: `.report-card`, `.report-actions`, stato
      vuoto. Presente in 8 tool su 10.
- [ ] **tabella dei centili**: 4 tool su 10 disegnano la stessa tabella.
- [ ] **`diagnosis-box`**: 4 tool su 10, stessa struttura e stesse classi.
- [ ] **modale della guida**: `.guide-overlay` con le stesse tre funzioni sta
      ormai in **4 tool** (biometria fetale, MRPI, stenosi carotidea, ASPECTS)
      e cambia solo cosa c'è dentro. È il candidato più maturo, e il più
      trascurato: era già duplicato prima che ne aggiungessi altri due.
- [ ] Arrivare a un **template per un nuovo strumento**: un tool nuovo
      dovrebbe essere i suoi dati normativi e la sua logica, non 800 righe di
      contorno. L'MRPI ne è la prova al costo pieno: 250 righe di CSS del
      contorno (modale tutorial, modale guida, tabelle, badge) ricopiate prima
      di scrivere una riga di calcolo. La stenosi carotidea le ha ricopiate
      una seconda volta e l'ASPECTS una terza: il costo non è più un aneddoto,
      è la regola.

## Strumenti da fare

- [ ] **pc-ASPECTS** (circolo posteriore, punteggio su 10 con pesi diversi:
      2 punti per mesencefalo e ponte, 1 per talami, cervelletto e territori
      della cerebrale posteriore). Il macchinario dell'ASPECTS — mappa a
      poligoni, clic con tolleranza sul più vicino, elenco di caselle
      sincronizzato — vale identico: cambiano le sagome e il fatto che le
      regioni non valgono tutte un punto.
      Attenzione a una differenza: il pc-ASPECTS ha regioni **su entrambi i
      lati** (talami e cervelletto si contano a destra e a sinistra), quindi
      il mezzo emisfero dell'ASPECTS lì non si applica e il disegno torna a
      essere una sezione intera.

## Quando il catalogo cresce

Da fare **adesso** perché costano poco e pagano dopo:

- [ ] **Campo `keywords` in `site-config.js`.** Oggi la ricerca guarda titolo,
      descrizione, categoria e sottocategoria. Chi digita "pituitaria" non
      trova l'ipofisi. A 30 strumenti la ricerca *è* la navigazione, e senza
      sinonimi fallisce in silenzio.
- [ ] **Recenti in cima alla home**, automatici, ultimi 3–4 usati. Con pochi
      strumenti battono i preferiti: nessuna curatela da parte dell'utente e
      azzeccano quasi sempre, perché in un turno si usano due tool dieci volte.
- [ ] **Versione dell'app e "forza aggiornamento" in `info.html`.** Non è un
      vezzo: con un service worker attivo, se un collega dice "a me esce un
      valore diverso" la prima domanda è quale versione ha in cache.

Da decidere **verso i 15 strumenti**, non prima:

- [ ] Struttura tipo MDCalc: barra in fondo, preferiti, categorie.
      **Attenzione:** sulle pagine degli strumenti il fondo dello schermo è già
      occupato da `.result-bar` (`mobile-result.js`), che mostra il verdetto
      mentre si compila un modulo lungo. Due barre impilate significano
      perdere quella — quindi barra di navigazione solo sulle pagine di
      navigazione, non dentro i tool.
- [ ] Tassonomia delle categorie. Oggi sono 4; a 30 strumenti dipende da
      *quali* saranno. Sono stringhe in `site-config.js`, rinominabili quando
      si vuole: nessuna fretta.
- [ ] Preferiti: hanno senso quando trovare uno strumento diventa un problema.

## Accessibilità

- [x] Ogni campo ha un nome accessibile (erano 58 senza) e i nomi sono univoci
      (17 erano duplicati: "PSV" compariva due volte senza distinguere ACA da
      MCA, "Chiusa" otto volte).
- [ ] **Contrasto del pulsante "Copia Testo per PACS" al buio.** `.btn-copy` è
      `#fff` su `var(--ok)`, e al buio `--ok` diventa un verde chiaro
      (`#7ed3a6`): bianco su verde chiaro sta intorno a 1.8:1, sotto ogni
      soglia. Riguarda tutti e otto gli strumenti, che ricopiano la stessa
      regola, quindi la correzione va fatta una volta in `base.css` — testo
      scuro sul verde chiaro al buio, non un verde diverso: il colore è il
      segnale che l'azione è andata a buon fine. Stessa verifica su
      `.btn-copy.copied` (`#555`) e su `.btn-copy:hover` (`#145a38`), che sono
      valori fissi e al buio non seguono il tema.
- [ ] Le etichette corte restano corte: "Anteriore", "Media", "Posteriore" si
      capiscono solo con l'intestazione di gruppo sopra. Dove non basta si è
      usato `aria-label`, ma la strada pulita sarebbe `fieldset`/`legend` per
      i gruppi di misure. **Attenzione:** in un `fieldset` con `display: grid`
      la `legend` non diventa una cella della griglia — resta la casella
      speciale del browser e la disposizione salta. Nelle righe destro/sinistro
      di `mrpi.html` per questo è rimasto `div` + `aria-label`.
- [ ] Provare davvero con TalkBack su Android, non solo con i controlli
      automatici.

---

## Decisioni prese, e perché

**Memoria dei campi in `sessionStorage`, non `localStorage`.** Il problema da
risolvere era Android che sospende l'app mentre si legge una misura sul PACS, e
per quello basta la sessione. Nei campi però passano data di nascita e misure
di un paziente: su una postazione di reparto condivisa `localStorage` le
lascerebbe sul disco a tempo indeterminato, leggibili da chi apre l'app dopo.
Se un giorno serve la persistenza vera, va deciso con quel problema in mente.

**Le pagine vanno prima in rete, gli asset prima dalla cache.** Sono
calcolatori clinici: se un valore di riferimento viene corretto, la correzione
deve arrivare al primo caricamento utile, non al secondo. La cache è la rete di
sicurezza, non la fonte.

**Due token per l'accento: `--accent` e `--accent-ink`.** Un blu che regge come
superficie sparisce come testo su fondo scuro. Non vanno riunificati.

**Soglia di tocco su `pointer: coarse`, non sulla larghezza.** Un tablet in
orizzontale supera i 640px ma si usa col dito lo stesso.

**Niente `prompt()` nei percorsi di errore.** In una TWA e in diverse webview
non è supportato e lancia: fallirebbe proprio il percorso d'errore. Il ripiego
della copia seleziona il testo nella pagina.

**`initTutorial(TUTORIAL_STEPS)` esplicito.** Le dichiarazioni `const` in cima
a uno `<script>` classico creano un binding lessicale che *non* compare su
`window`: un file condiviso non può leggerle da solo.

**Il maiuscolo spaziato solo sulle etichette di sezione di primo livello.** A
11–12px in mono spaziato diventa texture e si legge più lentamente.

**Misure in `rem`, mai in `px`.** La voce "Dimensioni carattere" di Android
scala i `rem`. L'unica eccezione è `max(16px, 1rem)` sugli input, che tiene
insieme la difesa contro lo zoom di iOS e lo scaling di Android.

---

## Trappole in cui sono già cascato

- **La cache del service worker durante lo sviluppo.** Modifichi un css, non
  cambia niente, pensi di aver sbagliato il css. Alza `VERSIONE`.
- **Regole automatiche sulle label.** Associare "la label al primo campo che
  segue" ha dato `for="extraNotes"` a una label che conteneva già la propria
  checkbox. Dopo un passaggio automatico su markup, va verificato che nessuna
  label che contiene un controllo ne indichi un altro.
- **Far partire un task su un worktree dal ramo sbagliato.** Se il lavoro è su
  un branch, il task va fatto partire da lì: altrimenti produce un diff contro
  file che non esistono più.
