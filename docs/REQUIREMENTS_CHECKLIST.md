# STEM2Connect AI Hackathon 2026 — Complete Requirements Checklist

Source: official Devpost pages (overview + /rules, read live 21 Nov 2026) and the Samajh plan
(`Samajh_STEM2Connect_Complete_Plan.pdf`). Live Devpost pages govern if anything differs.
Project: **Samajh** — Education track, solo, Daim Ali.
Deadline: **Sat 29 Nov 2026, 11:59 PM EST = Sun 30 Nov 2026, 9:59 AM PKT** — EXTENDED by Devpost email 21 Nov 2026 13:02 PKT ("The submission deadline has been extended to November 29th"). Original deadline was 21 Nov 11:59 PM EST. Late submissions are not accepted.

Status key: ✅ Done · ⏳ Pending · ⚠️ Honest limit (stated in README/Devpost, not hidden)

---

## 1. Eligibility — all must hold

- [x] ✅ Student aged 13+, currently enrolled (university student, Multan)
- [x] ✅ Solo entrant (team of up to 6 allowed; solo is allowed)
- [x] ✅ Only one team per participant; only one project per team
- [x] ✅ No coding experience required — small working project is enough
- [x] ✅ Not STEM2Connect staff, mentor or judge
- [x] ✅ Registered on Devpost (rolling registration, until the deadline)
- [ ] ⏳ Optional but strongly recommended: stem2connect.org registration form

## 2. Tracks — pick exactly one primary

- [x] ✅ **Education** (primary) — learning, accessibility, tutoring, academic organization
- [ ] Other tracks NOT used: Healthcare, Sustainability, Scientific Research, Community Impact
- [x] ✅ Track stated in README, Devpost draft and app ("Education track")

## 3. Build window

- [x] ✅ Project created 11 Oct – 21 Nov 2026 (built 21 Nov, inside the window)
- [x] ✅ Original work only — no copied code, no copied textbook text
- [x] ✅ Open-source libraries / fonts credited in README (Google Fonts only; no datasets, no third-party libraries)

## 4. What to build

- [x] ✅ Simple, functional project that addresses a real problem in one track
- [x] ✅ A website (static single-page web app — allowed: "website, app, chatbot, data tool, or something else")
- [x] ✅ It works and can be demonstrated — not slides, mockups or a concept alone
- [x] ✅ Runs on any OS/device — open `index.html`, no install, no server, no key
- [x] ✅ No harmful, offensive or misleading content
- [x] ✅ No personal data collected without consent — no accounts, nothing stored; in AI mode the passage is sent to Pollinations to be explained (stated in the app before first use), offline mode sends nothing anywhere

## 5. Samajh features (plan §5.3, F1–F10) — all built and QA-passed

- [x] ✅ F1 Input & options — paste 30–2,500 chars or pick a sample; level (Class 9–10 / Intermediate / University); language (13 languages: Simple English, Roman Urdu, Urdu script, Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian, Chinese); clear inline errors
- [x] ✅ F2 Simple explanation — plain-language restatement + one-line takeaway; numbers, formulas and units kept exactly as written
- [x] ✅ F3 Bilingual glossary — 4–8 key terms, each with English meaning + meaning in the chosen language (8 terms on all samples; unseeded terms show English only, never a guessed translation)
- [x] ✅ F4 Quiz with evidence — 5 multiple-choice questions from the passage only, 4 options each, correct index, one-line reason, evidence sentence copied exactly from the passage; immediate feedback + final score
- [x] ✅ F5 Flashcards — from glossary terms, flip, "Know it / Again", session-only progress (QA fix: progress resets on re-run)
- [x] ✅ F6 Evidence check — normalised check (lowercase, collapse whitespace, strip quotes); green "Found in passage" or amber "Could not verify — check yourself" badge on every item; "Show in passage" highlights the sentence
- [x] ✅ F7 AI mode + offline mode — real AI feature: Pollinations text API (free, no key) writes the explanation/takeaway in the chosen language; number check discards bad AI output; offline engine takes over automatically on failure (measured 21 Nov: 6/9 AI, 3/9 fallback, 0 numbers changed); AI toggle in the UI; visible mode chip with the reason
- [x] ✅ F8 Privacy & AI disclosure — notice visible before first use (AI mode sends the passage to Pollinations; offline mode sends nothing); no personal info
- [x] ✅ F9 Sample passages — 3 original passages: Ohm's law, Photosynthesis, Newton's second law (arithmetic checked: 12 V ÷ 4 Ω = 3 A; 10 N ÷ 2 kg = 5 m/s²; 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂)
- [x] ✅ F10 Download study sheet — .md file with explanation, terms and quiz (QA fix: uses Urdu-script meanings when Urdu is selected)

## 6. AI rules (important)

- [x] ✅ AI coding assistants allowed WITH disclosure — disclosed in README and Devpost draft, full log in `docs/AI_LOG.md` (Muse helped write code; tested on Daim's behalf; Daim's own review still pending)
- [x] ✅ In-product AI: **Pollinations text API** (free, no key) writes the explanation + takeaway; the quiz and glossary are always built offline. In AI mode the passage is sent to Pollinations; untick AI mode for a fully offline run that sends nothing anywhere. Disclosed in README, Devpost draft, the app itself and `docs/AI_LOG.md`
- [x] ✅ Integrated AI feature present — Pollinations (free, no key) explains in the chosen language; disclosed in README, Devpost draft and the app itself; the API-credit exception no longer needs to be relied on, and the offline fallback is kept and measured
- [x] ✅ AI feature is strongly recommended — compensated by the evidence check, the offline baseline, and the measured comparison in README/eval
- [x] ✅ Simply fetching data from an ordinary API does NOT count as AI — Samajh does not do that
- [x] ✅ Prompt-injection guard in design — passage treated as data, never as instructions (system prompt in plan §10.4; offline engine has no prompt to inject)

## 7. Submission requirements — all five are required, missing any one = not eligible

- [x] ✅ 1. Public GitHub repository — source code + README (what it does, how to run it, which AI tools it uses). Repo: https://github.com/Daimx1214/samajh — PUBLIC, main branch, MIT. Live site link and demo video link are in the README.
- [x] ✅ 2. Demo video — YouTube, **4:02 (under 6 minutes)**, unlisted, shows the project working (not just slides). https://www.youtube.com/watch?v=vswKBBOw1RE — upload verified, playback confirmed. Link is in the README + Devpost draft.
- [ ] ⏳ 3. Project description — Devpost form completed: name, problem, how it solves it, how it uses AI, what was learned, what to build next. Draft ready in `docs/DEVPOST_DRAFT.md`. Not submitted yet.
- [x] ✅ 4. Track selection — Education, stated in the additional-details question / public description (draft)
- [x] ✅ 5. Team members — solo: Daim Ali only, added on the submission
- [ ] ⏳ Saving a draft does NOT enter the hackathon — must click Submit, then reopen and verify status is "submitted", not draft
- [ ] ⏳ Re-read Devpost /rules and /updates once more before submitting

## 8. Judging criteria — 5 categories, 20% each

- [x] ✅ Problem and Impact (20%) — clear local problem (English STEM text is hard for Urdu-thinking students), real user group, before/after example in hero
- [x] ✅ Use of AI (20%) — disclosed coding assistance + offline baseline + evidence check + measured comparison (45/45 verified, 0 numbers changed)
- [x] ✅ Functionality (20%) — works as shown; 40/40 tests pass; offline fallback so it never breaks on camera; live browser click-through passed (quiz 5/5, evidence highlight, flashcards, download); demo video recorded from the live site
- [ ] ⚠️ Learning and Growth (20%) — concrete "what I learned" in README/Devpost (5 points, incl. real bugs found); **no student test run yet (0 students, not 3)** — honestly stated everywhere; weakens this score but is not a disqualifier
- [ ] ⏳ Presentation (20%) — demo video recorded + uploaded (4:02, unlisted) + Demo Day presentation (see §10)

Tie-break: higher Problem and Impact score wins. All judging decisions are final.

## 9. Prizes

- No cash prizes. Exactly 3 winning projects overall, one prize per project.
- 1st Place (Gold): Gold Certificate + mentorship/programme connections + spotlight post & story + 3 extra .xyz domains (free first year)
- 2nd Place (Silver): Silver Certificate + mentorship + spotlight post + 2 extra .xyz domains
- 3rd Place (Bronze): Bronze Certificate + mentorship + spotlight post + 1 extra .xyz domain
- .xyz domain for eligible submitting teams (up to 44): one free .xyz domain for the first year, first-come first-served, subject to availability; boilerplate/bare-minimum code is NOT eligible. Claim instructions shared privately with eligible teams.
- Participation certificate: on request, if you submit a complete project AND present on Demo Day.

## 10. Schedule

- [x] ✅ 11 Oct 2026 — program & hacking period began
- [x] ✅ 17 Oct 2026 — Devpost submissions opened
- [x] ✅ 21 Nov 2026 13:02 PKT — Devpost email: deadline EXTENDED to 29 Nov 2026
- [ ] ⏳ **30 Nov 2026, 9:59 AM PKT — submission deadline (target: submit 60–90 min early)**
- [ ] ⏳ Judges review complete submissions (dates move with the extension — check Devpost /updates)
- [ ] ⏳ **Demo Day — was Tue 24 Nov 2026 (EST) before the extension; new date to confirm in the STEM2Connect AI Hackathon Discord.** Times, meeting links, order and prerecorded instructions are announced in the Discord — check Discord for your slot.

## 11. Measured results (real numbers only, 21 Nov 2026)

- Tests: **40/40 pass, 0 fail** (`node --test tests/samajh.test.mjs`) — 18 original + 9 added in the second fix round + 8 added with AI mode (fake-fetch AI tests) + 7 added with the 13-language round (seed completeness, localized quiz/deck/study sheet, AI prompt per language)
- Eval: 3 samples × 13 languages = 39 runs — **195/195 quiz items evidence-verified (100%)**, **45/45 unique quiz answers manually checked correct**, **0 explanations changed a number/formula**, median engine time **about 1–2 ms (varies run to run; latest median of medians 1.15 ms)**
- AI mode (measured live, three runs on 21 Nov): run 1 — AI 6/9, fallback 3/9; run 2 — AI 8/9, fallback 1/9; run 3 (all 13 languages) — AI 26/39, fallback 13/39; **0 numbers changed in 57 runs, quiz 285/285 verified**, AI answers in about 0.3–7 s. One Roman Urdu AI explanation had a garbled phrase; numbers still exact.
- Student clarity rating: **not measured** (no student test)
- Serving check: live site https://daimx1214.github.io/samajh/ HTTP 200; repo public at https://github.com/Daimx1214/samajh; demo video https://www.youtube.com/watch?v=vswKBBOw1RE (4:02, unlisted, playback verified). In AI mode the app calls text.pollinations.ai (free, no key); offline mode sends nothing anywhere. No keys, no personal data (secrets scan: zero hits)

## 12. Honest limits — must stay in README / Devpost / video (do not hide)

- AI mode sends the passage to the free Pollinations text API; untick AI mode for a fully offline run. The free AI sometimes fails (17 fallbacks in 57 measured runs) and its Roman Urdu wording can be rough — numbers and formulas are checked, never trusted blindly.
- In offline mode the explanation stays in English (extractive sentences from the passage); only glossary and quiz wording are in the chosen language.
- Cloze questions test sentence-matching, not deep comprehension.
- No student test run (0 students).
- Urdu seed-glossary spellings have not been personally verified by Daim yet.
- New-language glossary meanings (beyond Urdu and Roman Urdu) are standard dictionary translations of common STEM terms, not yet reviewed by native speakers.

## 13. QA fixes already applied (21 Nov, re-tested)

1. Photosynthesis explanation now always includes the definition sentence.
2. Flashcard progress resets on re-run (was stale).
3. A stale precise median was replaced with "about 1–2 ms (varies run to run)" in README, index.html, Devpost draft, AI_LOG.
4. Hero/lede/label no longer overclaim translation — now "explains it in simple English, with key terms and quiz in Roman Urdu or Urdu script".
5. Study sheet now uses Urdu-script meanings when Urdu is selected.
6. A false personal-attribution claim was fixed to neutral wording — Daim's own review is still pending.

Second fix round (21 Nov, re-tested — 27/27 tests, eval 45/45, all 45 quiz items re-read by hand):

7. **Number warning wired up** (`samajh.js`: `checkNumbers()` / `numberWarningText()`; `app.js` renders it; `index.html` + `style.css`: amber warning box in the Explain tab). It never triggers in offline mode — the explanation is extractive — and the test proves the path with a hand-built result containing a changed number.
8. **Test-matrix gaps closed**: T5 (Urdu-script passage rejected with a clear message, never crashes; a few Urdu words in an English passage are still fine), T12 (prompt-injection passage treated as data — schema holds, no injected word becomes an answer), quiz scoring (all right / mixed / all wrong), flashcard reset (pure deck helpers, tested), Urdu study-sheet meanings (tested per language).
9. **Newton quiz reuse spread**: the cloze builder now reuses the least-used sentence first. Newton has 4 sentences for 5 questions, so one sentence is still used twice — but it is now the definition sentence (Q3 mass, Q5 object), and Q1/Q5 no longer share a sentence.
10. **Quiz scoring and flashcard state made pure and testable** (`scoreQuiz()`, `createFlashcardDeck()` / `resetDeck()` / `deckProgress()`); `app.js` now uses them instead of inline logic.
11. **Urdu-script input validation added**: a passage mostly in Urdu script is rejected with a clear message explaining Samajh explains English paragraphs and Urdu is for terms/quiz.
12. **Git repo initialised locally**: one commit, repo-local identity Daim Ali, no remote, nothing pushed.

Third fix round (21 Nov evening — AI mode added, then a full QA re-check found stale pre-AI wording in the docs):

13. **Real AI mode added** (`PROVIDER = 'pollinations'`, `callProvider()`, `aiEngine()`, async `runPipeline()`; AI toggle + mode chip in the UI; number check discards bad AI output). Measured live twice: run 1 — AI 6/9, fallback 3/9; run 2 — AI 8/9, fallback 1/9; 0 numbers changed in 18 runs; quiz 90/90 verified. 8 new unit tests with a fake fetch — **33/33 tests pass**.
14. **Flashcard layout root cause fixed**: `.flash-inner` was an inline `<span>`, so the card faces collapsed narrow and overlapped the buttons below — the first recording attempt failed on the "Know it" click for this reason. Fixed with `display: block` (commit `ced6a00`); the re-recorded demo shows the card full-width.
15. **Demo video recorded, muxed and uploaded**: Playwright recording of the live site (3 attempts: flashcard click blocked, then GitHub `networkidle` timeout — fixed with `domcontentloaded` + try/finally so the video file always finalises), narration (242 s) muxed with ffmpeg, 4 frames visually verified, uploaded to YouTube unlisted (4:02, playback confirmed).
16. **Stale pre-AI wording removed from the docs** (found in the final QA pass): README said "27 tests", "AI mode: not measured (no provider connected)", "a real AI provider" as a next step, and "the pasted text is never sent anywhere"; the Devpost draft said "In-product AI: none"; `eval/results.md` said "AI mode: not measured"; this checklist still listed the old 22 Nov deadline, a blocked GitHub push, an unrecorded video and "no live hosting". All corrected to the measured numbers and the extended 30 Nov deadline.

Fourth fix round (21 Nov evening — 13 languages for the international hackathon):

17. **Languages grew from 3 to 13** (`LANGUAGES` registry in `samajh.js`: English, Roman Urdu, Urdu, Hindi, Bengali, Arabic, Spanish, French, Portuguese, German, Turkish, Indonesian, Chinese). Every one of the 33 seed glossary terms now has a meaning in every language (a unit test enforces no gaps); quiz questions/reasons, the "in simple words" intro, flashcard progress and the AI prompt are all per-language; Urdu and Arabic lay out right-to-left with the right fonts (Noto Naskh Arabic, Noto Sans Bengali/Devanagari/SC added). The language picker shows native names in regional groups. Validation now accepts all 13 languages and the non-Latin-script passage rejection covers Arabic script too (error code renamed `urdu_script` → `non_latin_script`).
18. **Re-measured across all 13 languages**: offline eval 39 runs — 195/195 quiz verified, 0 numbers changed; AI eval run 3 — AI 26/39, fallback 13/39, 0 numbers changed, quiz 195/195; every new language produced an AI explanation in that language at least once. 7 new unit tests — **40/40 tests pass**. README, Devpost draft, index.html trust table and this checklist updated to the new numbers.

## 14. What is left — in order

1. **Repo, live site and video — DONE**: public GitHub repo, GitHub Pages live, demo video on YouTube unlisted (links in README + Devpost draft).
2. **Daim's own review** (review-before-submit rule): especially the Urdu seed-glossary spellings, the new-language meanings, and the "What I learned" wording.
3. **Submit on Devpost** by 30 Nov 9:59 AM PKT (aim 60–90 min early), reopen and verify "submitted", not draft.
4. **Demo Day**: check Discord for the new date/slot/link (was 24 Nov before the extension); present live or prerecorded; then request the Certificate of Participation and follow the private .xyz domain instructions.
