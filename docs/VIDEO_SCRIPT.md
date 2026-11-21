# Demo video script: Learnify AI (aim about 4:00 to 4:30, hard limit 6:00)

Record with a screen recorder, 1280x720, quiet room. Show the app really running, not slides. Upload to YouTube as unlisted and check it plays while logged out. Narration is TTS from this script (Daim's own voice was not available for recording).

**Updated 21 Nov 2026 evening (v3, final): the app is now Learnify AI, tagline "Turn Every Paragraph into Knowledge", with 13 languages and 5 samples. This is the final re-record. Sections 0:30 to 1:00 and 1:00 to 2:45 now show the language tour, the study sheet download and all five samples. Tests are now 54 of 54.**

## 0:00 to 0:30: Problem

On screen: a dense English STEM paragraph (the Ohm's law sample, full text).
Say (in your own words): "Many students can read every word of an English textbook paragraph and still miss the idea. Translating the whole page word for word does not fix it, and a chatbot can sound confident while being wrong."

## 0:30 to 1:00: Solution

On screen: Learnify AI hero and the privacy/AI notice strip. Before the hero, scroll to the tool and switch the language through Roman Urdu, Urdu script, Hindi, Arabic and Spanish, so the labels change on screen.
Say: "Learnify AI explains a paragraph in simple English, with the key terms and quiz in the language you think in, Roman Urdu or Urdu script, then tests you with answers that prove themselves from the exact sentence. It works in thirteen languages, from Urdu and Hindi to Spanish, French and Arabic, and five sample passages are built in, so you can try it without typing anything."

## 1:00 to 2:45: Live demo

On screen: Ohm's law sample, Roman Urdu selected. Tap Explain.
Walk through one full pass, slowly enough to read:
1. The explanation and one-line takeaway; point out that V = I x R and 12 V / 4 ohm / 3 A are exactly as written.
2. Terms tab: current is barqi rau, resistance is muzahmat.
3. Quiz tab: answer one question right, then **get one question wrong on purpose**. Show the reason, the evidence sentence, and the green "Found in passage" badge. Click "Show in passage" and show the sentence highlight in the original.
4. Cards tab: flip one flashcard, tap "Know it".
5. Explain tab: click "Download study sheet" and show the file downloading.
6. Click the other four sample buttons in turn, Photosynthesis, Newton's second law, Pythagoras' theorem, Cells, so all five samples are seen.
Say: "Here is Ohm's law in Roman Urdu. The explanation keeps the numbers exactly as written, 12 volts, 4 ohms, 3 amps. The terms tab shows each key word in Roman Urdu. In the quiz I answer the first question right, and the second one wrong on purpose, to show the reason and the evidence sentence. The green badge says the sentence was found in the passage, and Show in passage highlights it in the original text. The cards tab turns the terms into flashcards. I flip one and tap Know it. I also download the whole thing as a study sheet, the explanation, the terms and the quiz, in one file. And there are five samples built in: Ohm's law, photosynthesis, Newton's second law, Pythagoras, and cells."

## 2:45 to 3:30: Reliability (offline fallback)

On screen: untick the AI-mode box, tap Explain again, and show the Offline mode chip.
Say: "The AI is a free service with no key, so it can fail. In my own test it failed 3 times out of 9. When it does, Learnify AI does not break: the offline engine takes over automatically, and the app says so honestly instead of pretending the AI answered."

## 3:30 to 4:15: AI and honesty

On screen: the README "AI tools" section and the results table in `eval/results.md`.
Say: "The explanation is written by a free AI, Pollinations, no key, no sign-up, and Learnify AI checks it before showing it. Any number that is not in your passage throws the AI text away. The quiz and glossary are always built offline, so the AI can never invent an answer. An AI coding assistant helped write the code. I read it, ran it and tested it. Measured live on 5 passages in 13 languages: the AI answered 162 of 187 runs, the offline engine covered the other 25, 935 of 935 quiz items verified, 75 of 75 answers checked correct by hand, 0 explanations changed a number or formula, and 54 of 54 tests pass. I also found real bugs, one quiz question had two sensible answers, and fixed them. No student test was run yet, so I claim no student rating."

## 4:15 to 5:00: Learning

On screen: `docs/AI_LOG.md` or the fixed quiz code.
Say three concrete things: (1) the evidence check only works after normalising case, spaces and quotes; (2) the top-scoring sentences missed the worked example until the engine was taught to include it; (3) cloze distractors can be ambiguous even when the answer is right. One thing I would do differently: test with real students earlier.

## 5:00 to 5:30: Next and close

On screen: the "What I would build next" list and the repo URL.
Say: "Next: teacher mode, photo input so you can snap a textbook page, and a proper test with real students. The code and the live site are at the links below. Thank you."

## Recording checklist

- [ ] Under 6:00 including intro and outro (aim 5:00 to 5:30).
- [ ] Browser zoom large enough to read; quiz badges and the highlighted sentence are visible.
- [ ] The wrong answer is shown on purpose, with its reason and evidence.
- [ ] Uploaded as unlisted; link plays in a private window.
- [ ] Demo video link added to the README and the Devpost form.
