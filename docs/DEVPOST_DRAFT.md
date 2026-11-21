# Devpost draft — Samajh (DRAFT ONLY, do not submit from here)

Fill in the bracketed links, then paste into the Devpost form and submit there. Primary track: **Education**.

## Project name

Samajh

## Tagline

Understand English STEM paragraphs in your own language — 13 languages, key terms and quiz included — then test yourself with answers that point to the exact sentence.

## The problem

A student can read every word of an English textbook paragraph and still miss the idea. Translating the whole page word for word does not fix it, and a generic chatbot can sound confident while being wrong. Samajh is for students anywhere who study STEM in English but think in their own language — the hackathon is international, so the app speaks 13 languages, from Urdu and Hindi to Spanish, French and Arabic. (No student test was run before the deadline, so no student quotes are claimed — testing with real students is the first next step.)

## What it does

Paste a STEM paragraph (30–2,500 characters) or tap a sample — Ohm's law, photosynthesis, or Newton's second law. Pick a level (Class 9–10 / Intermediate / University) and a language — Simple English, Roman Urdu, Urdu script, Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian or Chinese — tap Explain, and Samajh returns: a simple explanation with a one-line takeaway in your chosen language (numbers and formulas kept exactly as written — in offline mode the explanation stays in English); a bilingual glossary of 4–8 key terms in your language; a 5-question quiz in your language where every answer shows the exact sentence from the passage that proves it, with a green "Found in passage" badge the app actually checks; flashcards from the glossary with session-only progress; and a downloadable study sheet (.md). Urdu and Arabic lay out right-to-left. It works with no key, no account and no internet connection for the engine itself.

## How it uses AI

The app has a real integrated AI feature: the explanation and one-line takeaway are written by the Pollinations text API (model "openai", free, no API key, no sign-up), in the student's chosen language. The AI is prompted to use only facts, numbers and formulas from the passage, and Samajh checks its output before showing it — any number or formula not in the passage discards the AI explanation and the offline one is used instead. The quiz and glossary are always built offline by the rule-based engine (extractive sentences, a checked seed glossary that never guesses a translation, cloze questions blanking a key term out of its own sentence). The evidence check normalises case, whitespace and quotes, then requires the evidence sentence to appear in the passage. Measured live on 3 passages (three runs on 21 Nov): run 1 — AI used in 6 of 9, offline fallback in 3 (transient API failures — the student still got a correct result); run 2 (re-check) — AI used in 8 of 9, fallback in 1; run 3 (all 13 languages) — AI used in 26 of 39, fallback in 13. 285 of 285 quiz items verified, 45 of 45 unique answers checked correct by hand, 0 explanations changed a number or formula in all 57 runs, AI answers in about 0.3–7 s, offline engine about 1–2 ms. One Roman Urdu AI explanation had a garbled phrase, but its numbers and formulas were still exact and the quiz (built offline) was unaffected. Full numbers: `eval/results.md`.

## AI tools disclosure

In-product AI: the Pollinations text API (model "openai", free, no API key, no sign-up) writes the explanation and one-line takeaway; the quiz and glossary are always built offline. In AI mode the passage is sent to Pollinations to be explained; untick AI mode for a fully offline run. AI coding assistant: Muse (Meta's Muse Spark) helped write the code; the code was run and tested before submission, the bugs the tests found were fixed, and the sample passages were written for this project. Full log: `docs/AI_LOG.md`.

## What I learned

The evidence check only works after normalising case, spaces and quotes; the top-scoring sentences missed the worked example until the engine was taught to include it; cloze distractors can be ambiguous even when the answer is right (one Newton question had two sensible answers — fixed by excluding generic words from distractors); Urdu script needs line-height 2.0 and right-to-left layout (and Arabic the same); and a seeded shuffle is what makes the engine testable at all.

## What's next

A more reliable paid AI provider behind the same adapter with the same evidence check; teacher mode; photo input for textbook pages; spaced repetition for flashcards; and a proper test with 3 real students.

## Built with

HTML, CSS, JavaScript (no framework, no build step, no server). Fonts: Source Serif 4, Noto Sans, Noto Nastaliq Urdu, Noto Naskh Arabic, Noto Sans Bengali, Noto Sans Devanagari, Noto Sans SC.

## Links

- GitHub: https://github.com/Daimx1214/samajh
- Live site: https://daimx1214.github.io/samajh/
- Demo video: https://www.youtube.com/watch?v=vswKBBOw1RE (4:02, unlisted)
