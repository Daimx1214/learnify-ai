# Samajh: STEM, in the language you think in

STEM2Connect AI Hackathon 2026. Primary track: **Education**. Solo entrant: Daim Ali (university student, Multan).

GitHub: https://github.com/Daimx1214/samajh

Live site: https://daimx1214.github.io/samajh/

Demo video: https://www.youtube.com/watch?v=vswKBBOw1RE (4:02, unlisted)

## What it does

Paste a STEM paragraph. Samajh explains it in your chosen language — 13 languages: Simple English, Roman Urdu, Urdu script, Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian and Chinese — using a free AI (Pollinations, no key), lists the key terms in your language, and gives a 5-question quiz where every answer shows the sentence from your passage that proves it — and the app checks that the sentence really exists in the passage. There is also a flashcard deck built from the glossary, and a downloadable study sheet (.md). If the AI call fails, the offline engine takes over automatically and the explanation re-uses your own sentences. The hackathon is international, so any student anywhere can pick their own language and use it themselves.

The problem: a student can read every word of an English textbook paragraph and still miss the idea. Translating the whole page word for word does not fix it, and a generic chatbot can sound confident while being wrong. Samajh keeps every answer tied to a sentence the student can check.

## How to run

No build step, no server, no key. It is a static site:

```sh
# Option 1 — open the file directly
open index.html

# Option 2 — serve it locally (recommended, so the sample files load by fetch)
python3 -m http.server 8000
# then open http://localhost:8000
```

Tests and evaluation (Node 18+; no dependencies):

```sh
node --test tests/samajh.test.mjs   # 50 tests
node eval/run_eval.mjs              # 5 samples × 13 languages, writes eval/results.md
node eval/run_ai_eval.mjs           # same 65 runs with AI mode on (live Pollinations calls), prints the AI-mode summary
```

## AI tools and services used (disclosure)

**Inside the product: a real AI feature.** The explanation and one-line takeaway are written by the Pollinations text API (model "openai", free, no API key, no sign-up). Before the AI text is shown, Samajh checks it: any number or formula not in the passage discards it, and for languages written in a non-Latin script (Urdu, Arabic, Hindi, Bengali, Chinese) the text must actually be in that script — an English explanation for Arabic is discarded too. The AI call is retried once on a transient failure. The quiz and glossary are always built offline by the rule-based engine in `samajh.js` (extractive sentences, a checked seed glossary, cloze questions), so the AI never invents a quiz answer or a translation. If the AI call fails, the offline engine takes over automatically — measured live 21 Nov 2026 across 5 runs (187 runs total): AI used in 162, offline fallback in 25, 0 numbers changed, quiz 935/935 verified (see `eval/results.md`). A fourth live run (65 runs, with the retry and the language check) is in progress. AI mode can be switched off in the UI for a fully offline run that sends nothing anywhere. Full log: `docs/AI_LOG.md`.

**AI coding assistant:** Muse (Meta's Muse Spark) helped write the code in this repo. The code was run and tested before submission (50/50 tests; all 75 unique quiz items checked by hand — see "Results"), the quiz and explanation bugs the tests found were fixed, and the five sample passages were written for this project. The full log is in `docs/AI_LOG.md`.

**What the offline engine cannot do:** it cannot translate a whole passage into your language — it re-uses sentences from the passage in English, and gives the glossary and quiz wording in the chosen language. In AI mode the explanation is written in your chosen language. The app says this plainly before first use.

**Languages:** 13 — Simple English, Roman Urdu, Urdu script, Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian, Chinese. Every seed glossary term has a checked meaning in every language (a unit test enforces this); a term outside the seed shows English only, never a guessed translation. Urdu and Arabic lay out right-to-left. The new-language meanings (beyond Urdu and Roman Urdu) are standard dictionary translations of common STEM terms and have not yet been reviewed by native speakers.

## How the evidence check works

`normalise()` lower-cases a sentence, collapses whitespace and strips quote characters; `checkEvidence()` then requires the normalised evidence sentence to appear in the normalised passage. Each quiz item shows a green "✓ Found in passage" badge or an amber "⚠ Could not verify — check yourself" badge, and clicking a verified badge highlights the sentence in the original passage. Unverified items are flagged, not counted as verified. In the offline engine the evidence is always the sentence the question was blanked from, so it verifies by design — the check still runs on every item, and the unit tests prove a fake sentence is flagged.

## Results (measured, 21 November 2026)

Offline engine and AI mode, both measured. 5 sample passages × 13 languages = 65 runs each (offline) and 187 AI runs across five live runs; each offline run timed 5 times, median shown. Full tables: `eval/results.md`. Quiz correctness was checked by reading every unique item in `eval/quiz_dump.md` by hand (75 unique items; the 13-language runs reuse the same items with localized question/reason wording).

| Measure | Offline mode | AI mode (live, Pollinations) |
|---|---|---|
| Quiz items with evidence verified | 325 of 325 (100%) | 935 of 935 (100%, five runs) |
| Quiz answers manually checked as correct | 45 of 45 unique items (100%) | 45 of 45 unique items (100%) |
| Explanations that changed a number or formula | 0 of 65 runs | 0 of 187 runs |
| AI used vs offline fallback | — | Run 1: AI 6/9, fallback 3/9. Run 2 (re-check): AI 8/9, fallback 1/9. Run 3 (13 languages): AI 26/39, fallback 13/39. Run 4 (13 languages, 5 samples, retry + language check): AI 63/65, fallback 2/65. Run 5 (same, retry-after-rejection + English script check): AI 59/65, fallback 6/65 |
| Median time to result | about 1–2 ms (engine only; the page shows a 400 ms loading state — the exact median varies run to run, see eval/results.md) | about 0.3–7 s per explanation (API call; fallback is instant) |
| Student clarity rating (1–5) | not measured | not measured |

Honest failure found and fixed during the check: the first Newton quiz had an ambiguous item — "a 2 kg ______" with "object" as a distractor, which also fits the blank. Generic words (object, law) are now never used as distractors, and short fragments are never used as filler options. All 45 items were re-checked after the fix.

Second fix round (21 Nov): the number warning is now wired into the Explain tab (amber, icon + words) and tested with a hand-built result — it never triggers in offline mode, because the explanation is extractive. New tests cover Urdu-script input rejection, prompt-injection passages, quiz scoring, flashcard reset and Urdu study-sheet meanings (33 tests total, all passing — 8 more were added with AI mode for the fake-fetch AI tests). Newton quiz reuse was spread: with 4 sentences for 5 questions one sentence is still used twice, but no longer Q1's sentence.

Third fix round (21 Nov evening): the hackathon is international, so Samajh grew from 3 languages to 13 — Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian and Chinese, with the full seed glossary translated for every term, localized quiz questions/reasons, localized flashcard progress, right-to-left layout for Urdu and Arabic, and the AI prompted to explain in the chosen language. 7 new tests (40 total, all passing) enforce that every seed term has a meaning in every language. Measured again: offline 39 runs, 195/195 quiz verified, 0 numbers changed; AI run 3 across all 13 languages, AI 26/39, fallback 13/39, 0 numbers changed, quiz 195/195.

Fourth fix round (21 Nov evening, after the gap list): level now changes the offline explanation — Class 9 keeps it short (definition + worked example), University uses the most sentences. The whole tool chrome (hero, labels, tabs, buttons, quiz feedback, flashcards) is now in all 13 languages, with a script audit test that every translation is written in its own language's script. The AI prompt now says every sentence must be in the chosen language; a script check discards an English explanation for a non-Latin language; and a failed AI call is retried once. Two more sample passages were added — Pythagoras' theorem (3² + 4² = 25) and cells (37 trillion cells, 10 micrometres) — with 12 new seed terms in all 13 languages (45 terms total). 12 new tests (52 total, all passing). Measured again: offline 65 runs, 325/325 quiz verified, 0 numbers changed; all 75 unique quiz items read by hand, 75/75 correct (one weak item: cells Q5 blanks the filler word "about" — unambiguous, but it tests a filler word, not understanding). AI runs 4–5 (65 runs each, with the retry, the language check and the English script check): AI 63/65 then 59/65, 0 numbers changed, quiz 325/325 each time.

Limitation: these are cloze questions, not deep-comprehension questions — the answer is found by matching the sentence, which is the point of the evidence check, but it does not test whether the student understood the idea in their own words. No student test was run before the deadline (0 students, not 3).

## What I learned

1. **An evidence check is only as good as its normalisation.** Case, extra spaces and curly quotes all had to be stripped before comparing, or true sentences failed the check.
2. **The top-scoring sentences are not always the most useful ones.** The first extractive explanation missed the worked example (12 V, 4 ohm, 3 A) because definition sentences score higher. The engine now always includes the best sentence carrying a number.
3. **Cloze distractors can be ambiguous even when the answer is "correct".** "A 2 kg object" fits the Newton blank as well as "trolley" does. Fixing it meant excluding generic words from distractors, not just checking the answer.
4. **Urdu script needs room.** Noto Nastaliq Urdu needs line-height 2.0 and `dir="rtl"`, or the text overlaps and reads badly.
5. **Determinism matters for testing.** Shuffling quiz options with a seeded shuffle (not `Math.random()`) is what makes the offline engine testable at all.

## What I would build next

1. A more reliable paid AI provider behind the same adapter, with the same evidence check on its output (Pollinations is free and sometimes fails — it fell back 17 times in 57 measured runs).
2. Teacher mode (a teacher pastes a passage and gets a printable sheet).
3. Photo input for textbook pages, and spaced repetition for flashcards.
4. A real student test: 3 students, 10 minutes each, with their (anonymous, consented) feedback.

## Privacy

No accounts. Nothing is stored — results live in memory in the tab and disappear when it closes. In AI mode (on by default) your passage is sent to the free Pollinations text API to be explained; nothing is stored by Samajh. Untick AI mode for a fully offline run that sends nothing anywhere. Do not paste personal information.

## Credits

- Fonts: Source Serif 4, Noto Sans, Noto Nastaliq Urdu, Noto Naskh Arabic, Noto Sans Bengali, Noto Sans Devanagari, Noto Sans SC, Noto Sans Mono (Google Fonts, open licences).
- No datasets, no third-party libraries, no copied text. The five sample passages are original, written for this project; their arithmetic was checked (12 V ÷ 4 ohm = 3 A; 10 N ÷ 2 kg = 5 m/s²; 6CO2 + 6H2O → C6H12O6 + 6O2; 3² + 4² = 9 + 16 = 25; 37 trillion cells, 10 micrometres across).
- Design palette: cobalt and Kashi teal on paper cream, after Multan tilework.

## Licence

MIT — see `LICENSE`. Built between 11 and 21 November 2026 by Daim Ali.
