# Bombers Test App — Tasques pendents

## CRÍTIC (l'app no funciona sense això)

### 1. `src/data/questions.json` ✅ FET (2026-06-28)
**Fitxer creat amb 21 temes × 15 preguntes = 315 preguntes en català.** Totes les preguntes
validades (estructura, opcions a/b/c/d, resposta correcta vàlida). Distribució de respostes
correctes equilibrada (a:78 / b:79 / c:79 / d:79). El placeholder s'ha eliminat.
T1 i T2 basats en el temari extret (`pdf_text.txt`); T3–T21 generats amb material estàndard
de l'oposició (el PDF original és escanejat i no se'n va poder extreure text per a aquests temes).

> Requisit original (per referència):
> Necessita 21 temes × 15 preguntes = **315 preguntes** en català.

Estructura requerida:
```json
{
  "topics": [
    {
      "id": 1,
      "name": "T1 – Legislació: Constitució i Estatut",
      "shortName": "Constitució i Estatut",
      "icon": "⚖️",
      "questions": [
        {
          "id": "t1_q1",
          "question": "Quan va entrar en vigor la Constitució espanyola?",
          "options": { "a": "...", "b": "...", "c": "...", "d": "..." },
          "correct": "c",
          "explanation": "La CE va entrar en vigor el 29 de desembre de 1978..."
        }
      ]
    }
  ]
}
```

Temes a cobrir:
- T1: Constitució espanyola + Estatut d'Autonomia de Catalunya
- T2: Funció pública / Personal (Grups A/B/C1/C2, règim disciplinari)
- T3: Prevenció de riscos laborals (LPRL 31/1995)
- T4: Protecció civil i SPEIS (Llei 5/1994, Llei 4/1997, CECAT, 112)
- T5: Física aplicada (SI, Newton, Pascal, Bernoulli, gasos, termodinàmica)
- T6: Física del foc (triangle/tetràedre, classes A/B/C/D/F, flashover, backdraft, BLEVE)
- T7: Agents extintors (aigua, escuma, pols, CO2, agents nets)
- T8: Instal·lacions de PCI (BIE, extintors, sprinklers, detecció automàtica)
- T9: Construcció i materials (resistència al foc, REI, RF, sectorització)
- T10: Matèries perilloses (ADR, ONU, NFPA 704, fitxes de seguretat)
- T11: Primers auxilis (RCP, desfibrilació, traumatismes, hemorràgies)
- T12: Equips de protecció individual (EPI, ERA, traje de proximitat)
- T13: Eines i equipament (escales, mànecs, motoserra, bombes)
- T14: Vehicles d'extinció (autopompes, autoescales, VRI, tancs)
- T15: Riscos naturals (inundació, sisme, nevades, vents forts)
- T16: Riscos tecnològics (SEVESO, plans d'emergència industrial)
- T17: Riscos en el transport (accident de trànsit, ferroviaris, aeris)
- T18: Salvament aquàtic (cordes, flotadors, busseig, rescats)
- T19: Rescat en alçada (cordes, descensors, ancoratges, ESAR)
- T20: Riscos NRBQ (Nuclear, Radiològic, Biològic, Químic)
- T21: Comunicacions i SEM (Tetra, codis, coordinació emergències)

---

## MILLORES DE DISSENY

### 2. Imatge de fons HD ✅ FET (2026-06-28)
- `assets/bg-bombers.jpg` — foto real de Bombers de Catalunya (unitat de l'Escala) tractada
  amb tonalitat ambre i enfosquida. Aplicada al menú amb overlay cinemàtic + glow d'espurnes.
- Crèdit: Javierito92, CC BY 3.0 (veure `CREDITS.md`).

### 3. Disseny professional (tema "Tactical Ember") ✅ FET (2026-06-28)
- Tipografies bundle offline: **Oswald** (títols) + **Inter** (text) a `assets/fonts/`.
- Paleta fosca near-black + ember/amber, glassmorphism, glow i accents angulars.
- Menú redissenyat (consola de vidre, icones SVG, sense emojis infantils).
- Estil aplicat de forma coherent a totes les pantalles (nivells, exàmens, estadístiques, quiz, resultats).
- Enllaços externs s'obren al navegador del sistema (`main.js` shell.openExternal).
- Crèdit "Fet per FurneDesigns" → https://furnedesigns.com

### 3b. Secció "Preguntes fallades" (repàs) ✅ FET (2026-06-28)
- Les preguntes fallades es guarden a `progress.failedQuestions` i es treuen en encertar-les.
- Nou botó al menú (amb comptador) → `App.startReview()` repassa fins a 20 fallades.

---

## OPCIONAL

### 4. Icona de l'app ✅ FET (2026-06-28)
- Icona de flama generada: `assets/icon.png` (256×256), `assets/icon.ico` (multi-mida 16→256) i `assets/flame.svg` (font editable)
- Referenciada a `package.json` (`build.win.icon`) i a la finestra (`main.js` → BrowserWindow `icon`)
- Embeguda a l'EXE durant el build (rcedit)

### 5. Build final
```bash
cd C:\Users\furne\projects\bombers-app
npm run build          # → portable EXE
npm run build-installer  # → instal·lador NSIS
```
Output a la carpeta `dist/`

---

## ESTAT ACTUAL

| Fitxer | Estat |
|--------|-------|
| `main.js` | ✅ Complet |
| `preload.js` | ✅ Complet |
| `src/index.html` | ✅ Complet |
| `src/styles.css` | ✅ Complet |
| `src/app.js` | ✅ Complet |
| `src/data/questions.json` | ✅ Complet (315 preguntes) |
| `assets/icon.png` / `icon.ico` | ✅ Fet (flama) |
| `assets/bg-bombers.jpg` | ✅ Fet (foto tractada) |
| `assets/fonts/` (Oswald + Inter) | ✅ Fet |
| Secció preguntes fallades | ✅ Fet |
| Enllaços externs al navegador | ✅ Fet |
| EXE final (portable) | ✅ Fet → `dist/Bombers Test - Generalitat de Catalunya 1.0.0.exe` (68 MB) |
| Instal·lador NSIS | ❌ Opcional (`npm run build-installer`) |
