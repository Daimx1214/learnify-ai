# Devpost draft — Samajh (DRAFT ONLY, do not submit from here)

Fill in the bracketed links, then paste into the Devpost form and submit there. Primary track: **Education**.

## Project name

Samajh

## Tagline

Understand English STEM paragraphs — key terms and quiz in Roman Urdu or Urdu — then test yourself with answers that point to the exact sentence.

## The problem

A student can read every word of an English textbook paragraph and still miss the idea. Translating the whole page word for word does not fix it, and a generic chatbot can sound confident while being wrong. Samajh is for secondary, intermediate and university students in Pakistan who study STEM in English but think in Urdu. (No student test was run before the deadline, so no student quotes are claimed — testing with real students is the first next step.)

## What it does

Paste a STEM paragraph (30–2,500 characters) or tap a sample — Ohm's law, photosynthesis, or Newton's second law. Pick a level (Class 9–10 / Intermediate / University) and a language (Simple English / Roman Urdu / Urdu script), tap Explain, and Samajh returns: a simple English explanation with a one-line takeaway (numbers and formulas kept exactly as written — in offline mode the explanation stays in English); a bilingual glossary of 4–8 key terms; a 5-question quiz where every answer shows the exact sentence from the passage that proves it, with a green "Found in passage" badge the app actually checks; flashcards from the glossary with session-only progress; and a downloadable study sheet (.md). It works with no key, no account and no internet connection for the engine itself.

## How it uses AI

No AI service runs inside this build — this is the hackathon's API-credit exception, stated honestly. The engine is a rule-based offline program: it scores sentences by term frequency, builds a glossary from repeated content words plus a small checked seed list (never guessing a translation), and makes cloze quiz questions by blanking a key term out of its own sentence. The evidence check normalises case, whitespace and quotes, then requires the evidence sentence to appear in the passage. A provider adapter stub (`PROVIDER=none`) is documented in the code so a future LLM can plug in behind the same check. Measured on 3 passages × 3 languages (9 runs): 45 of 45 quiz items verified, 45 of 45 answers checked correct by hand, 0 explanations changed a number or formula, median engine time about 1–2 ms (varies run to run). Full numbers: `eval/results.md`.

## AI tools disclosure

In-product AI: none (offline rule-based engine only, as above). AI coding assistant: Muse (Meta's Muse Spark) helped write the code; the code was run and tested before submission, the bugs the tests found were fixed, and the sample passages were written for this project. Full log: `docs/AI_LOG.md`.

## What I learned

The evidence check only works after normalising case, spaces and quotes; the top-scoring sentences missed the worked example until the engine was taught to include it; cloze distractors can be ambiguous even when the answer is right (one Newton question had two sensible answers — fixed by excluding generic words from distractors); Urdu script needs line-height 2.0 and right-to-left layout; and a seeded shuffle is what makes the engine testable at all.

## What's next

A real AI provider behind the documented adapter with the same evidence check; teacher mode; photo input for textbook pages; spaced repetition for flashcards; and a proper test with 3 real students.

## Built with

HTML, CSS, JavaScript (no framework, no build step, no server). Fonts: Source Serif 4, Noto Sans, Noto Nastaliq Urdu.

## Links

- GitHub: https://github.com/Daimx1214/samajh
- Demo video: [TODO — YouTube/Vimeo link once recorded]
