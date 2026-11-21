# Demo video script: Samajh (aim 5:00 to 5:30, hard limit 6:00)

Record with a screen recorder, 1280x720, quiet room. Show the app really running, not slides. Upload to YouTube as unlisted and check it plays while logged out. Narration is TTS from this script (Daim's own voice was not available for recording).

**Updated 21 Nov 2026 evening (v2): the app now has a real AI feature (Pollinations, free, no key). Sections 2:45 to 3:30, 3:30 to 4:15 and 5:00 to 5:30 were rewritten. The v1 wording ("no AI service runs inside the product", "next: a real AI provider") is no longer true. Note: this script still shows the old 4:02 video. It will be re-recorded only after everything is final.**

## 0:00 to 0:30: Problem

On screen: a dense English STEM paragraph (the Ohm's law sample, full text).
Say (in your own words): "Many students can read every word of an English textbook paragraph and still miss the idea. Translating the whole page word for word does not fix it, and a chatbot can sound confident while being wrong."

## 0:30 to 1:00: Solution

On screen: Samajh hero and the privacy/AI notice strip.
Say: "Samajh explains a paragraph in simple English, with the key terms and quiz in the language you think in, Roman Urdu or Urdu script, then tests you with answers that prove themselves from the exact sentence."

## 1:00 to 2:45: Live demo

On screen: Ohm's law sample, Roman Urdu selected. Tap Explain.
Walk through one full pass, slowly enough to read:
1. The explanation and one-line takeaway; point out that V = I x R and 12 V / 4 ohm / 3 A are exactly as written.
2. Terms tab: current is barqi rau, resistance is muzahmat.
3. Quiz tab: answer one question right, then **get one question wrong on purpose**. Show the reason, the evidence sentence, and the green "Found in passage" badge. Click "Show in passage" and show the sentence highlight in the original.
4. Cards tab: flip one flashcard, tap "Know it".

## 2:45 to 3:30: Reliability (offline fallback)

On screen: untick the AI-mode box, tap Explain again, and show the Offline mode chip.
Say: "The AI is a free service with no key, so it can fail. In my own test it failed 3 times out of 9. When it does, Samajh does not break: the offline engine takes over automatically, and the app says so honestly instead of pretending the AI answered."

## 3:30 to 4:15: AI and honesty

On screen: the README "AI tools" section and the results table in `eval/results.md`.
Say: "The explanation is written by a free AI, Pollinations, no key, no sign-up, and Samajh checks it before showing it. Any number that is not in your passage throws the AI text away. The quiz and glossary are always built offline, so the AI can never invent an answer. An AI coding assistant helped write the code. I read it, ran it and tested it. Measured live on 5 passages in 13 languages: the AI answered 162 of 187 runs, the offline engine covered the other 25, 935 of 935 quiz items verified, 75 of 75 answers checked correct by hand, 0 explanations changed a number or formula, and 53 of 53 tests pass. I also found real bugs, one quiz question had two sensible answers, and fixed them. No student test was run yet, so I claim no student rating."

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
