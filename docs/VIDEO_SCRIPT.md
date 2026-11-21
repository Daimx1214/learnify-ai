# Demo video script — Samajh (aim 5:00–5:30, hard limit 6:00)

Record with OBS Studio, 1080p, clear microphone, quiet room. Show the app really running, not slides. Upload to YouTube or Vimeo as unlisted and check it plays while logged out. Use your own voice.

## 0:00–0:30 — Problem

On screen: a dense English STEM paragraph (the Ohm's law sample, full text).
Say (in your own words): "Many students can read every word of an English textbook paragraph and still miss the idea. Translating the whole page word for word does not fix it — and a chatbot can sound confident while being wrong."

## 0:30–1:00 — Solution

On screen: Samajh hero and the privacy/AI notice strip.
Say: "Samajh explains a paragraph in simple English, with the key terms and quiz in the language you think in — Roman Urdu or Urdu script — then tests you with answers that prove themselves from the exact sentence."

## 1:00–2:45 — Live demo

On screen: Ohm's law sample, Roman Urdu selected. Tap Explain.
Walk through one full pass, slowly enough to read:
1. The explanation and one-line takeaway; point out that V = I × R and 12 V / 4 ohm / 3 A are exactly as written.
2. Terms tab: current = barqi rau, resistance = muzahmat.
3. Quiz tab: answer one question right, then **get one question wrong on purpose** — show the reason, the evidence sentence, and the green "Found in passage" badge. Click "Show in passage" and show the sentence highlight in the original.
4. Cards tab: flip one flashcard, tap "Know it".

## 2:45–3:30 — Reliability (offline mode)

On screen: the Offline mode chip and the notice strip.
Say: "There is no AI key in this build, so Samajh runs on a rule-based offline engine. If the AI service fails or credits run out, it still works — that is the API-credit exception, and the app says so honestly instead of pretending to be an AI."

## 3:30–4:15 — AI and honesty

On screen: the README "AI tools" section and the results table in `eval/results.md`.
Say: "No AI service runs inside the product. An AI coding assistant helped write the code; I read it, ran it and tested it. Measured on 3 passages × 3 languages: 45 of 45 quiz items verified, 45 of 45 answers checked correct by hand, 0 explanations changed a number or formula. I also found a real bug — one quiz question had two sensible answers — and fixed it. No student test was run yet, so I claim no student rating."

## 4:15–5:00 — Learning

On screen: `docs/AI_LOG.md` or the fixed quiz code.
Say three concrete things: (1) the evidence check only works after normalising case, spaces and quotes; (2) the top-scoring sentences missed the worked example until the engine was taught to include it; (3) cloze distractors can be ambiguous even when the answer is right. One thing I would do differently: test with real students earlier.

## 5:00–5:30 — Next and close

On screen: the "What I would build next" list and the repo URL.
Say: "Next: a real AI provider behind the same evidence check, teacher mode, and a proper student test. The code is at [repo URL]. Thank you."

## Recording checklist

- [ ] Under 6:00 including intro and outro (aim 5:00–5:30).
- [ ] Browser zoom large enough to read; quiz badges and the highlighted sentence are visible.
- [ ] The wrong answer is shown on purpose, with its reason and evidence.
- [ ] Uploaded as unlisted; link plays in a private window.
- [ ] Demo video link added to the README and the Devpost form.
