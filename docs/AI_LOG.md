# AI_LOG — every AI-assistant use for Samajh

Rule followed: nothing the assistant wrote was submitted or claimed without being read, run and tested. Dates are PKT, 21 November 2026.

| Date | Tool | What was asked | What was accepted | What was changed / tested (via Muse, on Daim's behalf) |
|---|---|---|---|---|
| 21 Nov 2026 | Muse (Meta Muse Spark, subagent) | Build the complete Samajh static app from the plan PDF: core engine, UI, tests, evaluation, docs. | The full app structure: `samajh.js` offline engine, `index.html`/`style.css`/`app.js`, 18 Node tests, eval script, README and Devpost/video drafts. | Ran the tests; 2 failed on first run (quiz gave 4 items on Newton, explanation missed the 12 V example). Fixed the engine (two-pass quiz building, worked-example inclusion, generic-word distractor exclusion) and re-ran until 18/18 passed. |
| 21 Nov 2026 | Muse | Run the offline engine on 3 samples × 3 languages and record real results. | The eval script and its measured table (45/45 verified, 0 numbers changed, median engine time about 1–2 ms, varying run to run). | Read all 45 quiz items in `eval/quiz_dump.md` by hand; found the ambiguous Newton Q4 ("object" also fits "a 2 kg ______") and fixed the distractor rules; re-checked all 45 after the fix. |
| 21 Nov 2026 | Muse | Write the sample passages from plan §10.6. | The three passages as written in `samples/`. | Checked the arithmetic by hand: 12 V ÷ 4 ohm = 3 A, doubling resistance halves current; 10 N ÷ 2 kg = 5 m/s²; 6CO2 + 6H2O → C6H12O6 + 6O2. |
| 21 Nov 2026 | Muse (Meta Muse Spark, subagent) | Fix the open QA gaps: wire up the number warning, add tests for Urdu-script input / prompt injection / quiz scoring / flashcard reset / Urdu study sheet, spread Newton quiz sentence reuse, git init. | `checkNumbers()` / `numberWarningText()` / `scoreQuiz()` / flashcard-deck helpers in `samajh.js`, the amber warning in the Explain tab, the least-used-sentence quiz builder, and 9 new tests (27 total). | All 27 tests pass (fresh-copy check also 27/27); eval re-run twice, 45/45 verified, 0 numbers changed; read all 45 quiz items in `eval/quiz_dump.md` by hand again — all correct, Newton Q1/Q5 no longer share a sentence (one sentence is still used twice, because Newton has 4 sentences for 5 questions). One local git commit made, no remote added, nothing pushed. |
| 21 Nov 2026 | Muse | Write the Roman Urdu / Urdu-script seed glossary. | The seed entries in `samajh.js` (current = barqi rau, resistance = muzahmat, voltage = barqi dabao, force = quwwat, mass = kamiyat, acceleration = isra, energy = tawanai, photosynthesis = ziai taleef, plus the rest). | Daim is the Urdu speaker; the spellings are from the plan's checked seed list and his verification is pending before submission. Terms not in the seed show English only — the app never guesses a translation. |

## What no AI did

- No AI service runs inside the product. `PROVIDER = 'none'`; there is no API key, no model call, no text sent anywhere.
- No student test was run, so no student quotes or ratings are claimed anywhere.
- No statistics, citations or external facts were added. Everything measured is in `eval/results.md`.
