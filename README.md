# Samajh: STEM, in the language you think in

STEM2Connect AI Hackathon 2026. Primary track: **Education**. Solo entrant: Daim Ali (university student, Multan).

Demo video: [TODO — to be added after recording]

## What it does

Paste a STEM paragraph. Samajh explains it in simple English and lists the key terms in both languages — in offline mode the explanation stays in English, while the glossary and quiz use your chosen language (Roman Urdu or Urdu script). Every quiz answer shows the sentence from your passage that proves it — and the app checks that the sentence really exists in the passage. There is also a flashcard deck built from the glossary, and a downloadable study sheet (.md).

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
node --test tests/samajh.test.mjs   # 27 tests
node eval/run_eval.mjs              # 3 samples × 3 languages, writes eval/results.md
```

## AI tools and services used (disclosure)

**Inside the product: none.** There is no AI service in this build. The engine is a rule-based offline program in `samajh.js`: it scores sentences by non-stopword term frequency, takes the top sentences as the explanation, builds a glossary from repeated content words plus a small checked seed list, and makes cloze quiz questions by blanking a key term out of its own sentence. No API key exists, no text leaves the browser, and no external API is called. This is the hackathon's API-credit exception, stated honestly in the app, here, and in `docs/AI_LOG.md`. A provider adapter stub is documented in `samajh.js` (`PROVIDER = 'none'`, `getProviderInfo()`, `callProvider()`), so a future LLM can plug in behind the same evidence check — none is connected now.

**AI coding assistant:** Muse (Meta's Muse Spark) helped write the code in this repo. The code was run and tested before submission (27/27 tests; all 45 quiz items checked by hand — see "Results"), the quiz and explanation bugs the tests found were fixed, and the three sample passages were written for this project. The full log is in `docs/AI_LOG.md`.

**What the offline engine cannot do:** it cannot translate a whole passage into Roman Urdu or Urdu script — it re-uses sentences from the passage in English, and gives the glossary and quiz wording in the chosen language. The app says this plainly before first use.

## How the evidence check works

`normalise()` lower-cases a sentence, collapses whitespace and strips quote characters; `checkEvidence()` then requires the normalised evidence sentence to appear in the normalised passage. Each quiz item shows a green "✓ Found in passage" badge or an amber "⚠ Could not verify — check yourself" badge, and clicking a verified badge highlights the sentence in the original passage. Unverified items are flagged, not counted as verified. In the offline engine the evidence is always the sentence the question was blanked from, so it verifies by design — the check still runs on every item, and the unit tests prove a fake sentence is flagged.

## Results (measured, 21 November 2026)

Offline engine only. 3 sample passages × 3 languages = 9 runs; each run timed 5 times, median shown. Full table: `eval/results.md`. Quiz correctness was checked by reading every item in `eval/quiz_dump.md` by hand.

| Measure | Offline mode |
|---|---|
| Quiz items with evidence verified | 45 of 45 (100%) |
| Quiz answers manually checked as correct | 45 of 45 (100%) |
| Explanations that changed a number or formula | 0 of 9 runs |
| Median time to result | about 1–2 ms (engine only; the page shows a 400 ms loading state — the exact median varies run to run, see eval/results.md) |
| Student clarity rating (1–5) | not measured |
| AI mode | not measured (no provider connected) |

Honest failure found and fixed during the check: the first Newton quiz had an ambiguous item — "a 2 kg ______" with "object" as a distractor, which also fits the blank. Generic words (object, law) are now never used as distractors, and short fragments are never used as filler options. All 45 items were re-checked after the fix.

Second fix round (21 Nov): the number warning is now wired into the Explain tab (amber, icon + words) and tested with a hand-built result — it never triggers in offline mode, because the explanation is extractive. New tests cover Urdu-script input rejection, prompt-injection passages, quiz scoring, flashcard reset and Urdu study-sheet meanings (27 tests total, all passing). Newton quiz reuse was spread: with 4 sentences for 5 questions one sentence is still used twice, but no longer Q1's sentence.

Limitation: these are cloze questions, not deep-comprehension questions — the answer is found by matching the sentence, which is the point of the evidence check, but it does not test whether the student understood the idea in their own words. No student test was run before the deadline (0 students, not 3).

## What I learned

1. **An evidence check is only as good as its normalisation.** Case, extra spaces and curly quotes all had to be stripped before comparing, or true sentences failed the check.
2. **The top-scoring sentences are not always the most useful ones.** The first extractive explanation missed the worked example (12 V, 4 ohm, 3 A) because definition sentences score higher. The engine now always includes the best sentence carrying a number.
3. **Cloze distractors can be ambiguous even when the answer is "correct".** "A 2 kg object" fits the Newton blank as well as "trolley" does. Fixing it meant excluding generic words from distractors, not just checking the answer.
4. **Urdu script needs room.** Noto Nastaliq Urdu needs line-height 2.0 and `dir="rtl"`, or the text overlaps and reads badly.
5. **Determinism matters for testing.** Shuffling quiz options with a seeded shuffle (not `Math.random()`) is what makes the offline engine testable at all.

## What I would build next

1. A real AI provider behind the documented adapter, with the same evidence check on its output.
2. Teacher mode (a teacher pastes a passage and gets a printable sheet).
3. Photo input for textbook pages, and spaced repetition for flashcards.
4. A real student test: 3 students, 10 minutes each, with their (anonymous, consented) feedback.

## Privacy

No accounts. Nothing is stored — results live in memory in the tab and disappear when it closes. The pasted text is never sent anywhere, because there is no server and no AI provider connected. Do not paste personal information.

## Credits

- Fonts: Source Serif 4, Noto Sans, Noto Nastaliq Urdu, Noto Sans Mono (Google Fonts, open licences).
- No datasets, no third-party libraries, no copied text. The three sample passages are original, written for this project; their arithmetic was checked (12 V ÷ 4 ohm = 3 A; 10 N ÷ 2 kg = 5 m/s²; 6CO2 + 6H2O → C6H12O6 + 6O2).
- Design palette: cobalt and Kashi teal on paper cream, after Multan tilework.

## Licence

MIT — see `LICENSE`. Built between 11 and 21 November 2026 by Daim Ali.
