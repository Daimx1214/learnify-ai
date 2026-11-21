# Devpost draft: Learnify AI (DRAFT ONLY, do not submit from here)

Fill in the bracketed links, then paste into the Devpost form and submit there. Primary track: **Education**.

## Project name

Learnify AI

## Tagline

Turn Every Paragraph into Knowledge.

## The problem

I have watched students read every word of an English textbook paragraph and still miss the idea. Translating the whole page word for word does not fix it, and a generic chatbot can sound confident while being wrong. Learnify AI is for students anywhere who study STEM in English but think in their own language. The hackathon is international, so the app speaks 13 languages, from Urdu and Hindi to Spanish, French and Arabic. No student test was run before the deadline, so no student quotes are claimed. Testing with real students is the first next step.

## What it does

Paste a STEM paragraph (30 to 2,500 characters) or tap a sample: Ohm's law, photosynthesis, Newton's second law, Pythagoras' theorem or cells. Pick a level (Class 9-10, Intermediate or University) and a language: Simple English, Roman Urdu, Urdu script, Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian or Chinese. Then tap Explain, and Learnify AI gives you a simple explanation with a one-line takeaway in your chosen language. Numbers and formulas stay exactly as written. In offline mode the explanation stays in English. You also get a bilingual glossary of 4 to 8 key terms in your language, a 5-question quiz in your language where every answer shows the exact sentence from the passage that proves it, with a green "Found in passage" badge the app actually checks, flashcards from the glossary with session-only progress, and a downloadable study sheet (.md). Urdu and Arabic lay out right-to-left. It works with no key, no account and no internet connection for the engine itself.

## How it uses AI

The app has a real integrated AI feature. The explanation and one-line takeaway are written by the Pollinations text API (model "openai", free, no API key, no sign-up), in the student's chosen language. I prompt the AI to use only facts, numbers and formulas from the passage, and Learnify AI checks its output before showing it. Any number or formula not in the passage throws the AI explanation away. For languages written in a non-Latin script the text must actually be in that script, and the other way round, an English request must come back in Latin script. A failed call or a rejected output is retried once, and the offline explanation is used instead. The quiz and glossary are always built offline by the rule-based engine: extractive sentences, a checked seed glossary that never guesses a translation, and cloze questions that blank a key term out of its own sentence. The evidence check normalises case, whitespace and quotes, then requires the evidence sentence to appear in the passage. I measured it live on 5 passages, in five runs on 21 Nov. Run 1: AI used in 6 of 9, offline fallback in 3 (transient API failures, but the student still got a correct result). Run 2: AI used in 8 of 9, fallback in 1. Run 3, all 13 languages: AI used in 26 of 39, fallback in 13. Run 4, all 13 languages and 5 samples, with the retry and language check: AI used in 63 of 65, fallback in 2. Run 5, same setup plus the English script check: AI used in 59 of 65, fallback in 6. In total, 935 of 935 quiz items verified, 75 of 75 unique answers checked correct by hand, and 0 explanations changed a number or formula in all 187 runs. AI answers take about 0.3 to 7 seconds, the offline engine about 1 to 2 ms. One Roman Urdu AI explanation had a garbled phrase, one cells/english explanation came back in Urdu script (that is what made me add the English script check), and one Hindi cells explanation had a grammar slip. Numbers and formulas were still exact in every case, and the quiz, which is built offline, was unaffected. Full numbers: `eval/results.md`.

## AI tools disclosure

In-product AI: the Pollinations text API (model "openai", free, no API key, no sign-up) writes the explanation and one-line takeaway. The quiz and glossary are always built offline. In AI mode the passage is sent to Pollinations to be explained. Untick AI mode for a fully offline run. AI coding assistant: Muse (Meta's Muse Spark) helped write the code. I ran and tested the code before submitting, fixed the bugs the tests found, and wrote the sample passages for this project. Full log: `docs/AI_LOG.md`.

## What I learned

The evidence check only works after normalising case, spaces and quotes. The top-scoring sentences missed the worked example until I taught the engine to include it. Cloze distractors can be ambiguous even when the answer is right. One Newton question had two sensible answers, and I fixed it by excluding generic words from distractors. Urdu script needs line-height 2.0 and right-to-left layout, and Arabic needs the same. A seeded shuffle is what makes the engine testable at all.

## What's next

A more reliable paid AI provider behind the same adapter with the same evidence check. Teacher mode. Photo input for textbook pages. Spaced repetition for flashcards. And a proper test with 3 real students.

## Built with

HTML, CSS, JavaScript (no framework, no build step, no server). Fonts: Source Serif 4, Noto Sans, Noto Nastaliq Urdu, Noto Naskh Arabic, Noto Sans Bengali, Noto Sans Devanagari, Noto Sans SC.

## Links

- GitHub: https://github.com/Daimx1214/learnify-ai
- Live site: https://daimx1214.github.io/learnify-ai/
- Demo video: https://www.youtube.com/watch?v=vswKBBOw1RE (4:02, unlisted)
