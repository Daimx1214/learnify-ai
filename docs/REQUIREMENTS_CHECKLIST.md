# STEM2Connect AI Hackathon 2026 — Complete Requirements Checklist

Source: official Devpost pages (overview + /rules, read live 21 Nov 2026) and the Samajh plan
(`Samajh_STEM2Connect_Complete_Plan.pdf`). Live Devpost pages govern if anything differs.
Project: **Samajh** — Education track, solo, Daim Ali.
Deadline: **Sat 21 Nov 2026, 11:59 PM EST = Sun 22 Nov 2026, 9:59 AM PKT**. Late submissions are not accepted.

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
- [x] ✅ No personal data collected without consent — no accounts, nothing stored, text never leaves the browser

## 5. Samajh features (plan §5.3, F1–F10) — all built and QA-passed

- [x] ✅ F1 Input & options — paste 30–2,500 chars or pick a sample; level (Class 9–10 / Intermediate / University); language (Simple English / Roman Urdu / Urdu script); clear inline errors
- [x] ✅ F2 Simple explanation — plain-language restatement + one-line takeaway; numbers, formulas and units kept exactly as written
- [x] ✅ F3 Bilingual glossary — 4–8 key terms, each with English meaning + meaning in the chosen language (8 terms on all samples; unseeded terms show English only, never a guessed translation)
- [x] ✅ F4 Quiz with evidence — 5 multiple-choice questions from the passage only, 4 options each, correct index, one-line reason, evidence sentence copied exactly from the passage; immediate feedback + final score
- [x] ✅ F5 Flashcards — from glossary terms, flip, "Know it / Again", session-only progress (QA fix: progress resets on re-run)
- [x] ✅ F6 Evidence check — normalised check (lowercase, collapse whitespace, strip quotes); green "Found in passage" or amber "Could not verify — check yourself" badge on every item; "Show in passage" highlights the sentence
- [x] ✅ F7 AI mode + offline mode — real AI feature: Pollinations text API (free, no key) writes the explanation/takeaway in the chosen language; number check discards bad AI output; offline engine takes over automatically on failure (measured 21 Nov: 6/9 AI, 3/9 fallback, 0 numbers changed); AI toggle in the UI; visible mode chip with the reason
- [x] ✅ F8 Privacy & AI disclosure — notice visible before first use; no personal info; text sent nowhere
- [x] ✅ F9 Sample passages — 3 original passages: Ohm's law, Photosynthesis, Newton's second law (arithmetic checked: 12 V ÷ 4 Ω = 3 A; 10 N ÷ 2 kg = 5 m/s²; 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂)
- [x] ✅ F10 Download study sheet — .md file with explanation, terms and quiz (QA fix: uses Urdu-script meanings when Urdu is selected)

## 6. AI rules (important)

- [x] ✅ AI coding assistants allowed WITH disclosure — disclosed in README and Devpost draft, full log in `docs/AI_LOG.md` (Muse helped write code; tested on Daim's behalf; Daim's own review still pending)
- [x] ✅ In-product AI: **none** — offline rule-based engine only; no API key, no external call, no text leaves the browser
- [x] ✅ Integrated AI feature present — Pollinations (free, no key) explains in the chosen language; disclosed in README, Devpost draft and the app itself; the API-credit exception no longer needs to be relied on, and the offline fallback is kept and measured
- [x] ✅ AI feature is strongly recommended — compensated by the evidence check, the offline baseline, and the measured comparison in README/eval
- [x] ✅ Simply fetching data from an ordinary API does NOT count as AI — Samajh does not do that
- [x] ✅ Prompt-injection guard in design — passage treated as data, never as instructions (system prompt in plan §10.4; offline engine has no prompt to inject)

## 7. Submission requirements — all five are required, missing any one = not eligible

- [ ] ⏳ 1. Public GitHub repository — source code + README (what it does, how to run it, which AI tools it uses). **Repo built, QA-passed and committed locally (one commit, repo-local identity Daim Ali, no remote yet); push BLOCKED waiting for Daim's 8-char GitHub sudo code** (email 21 Nov 16:42 PKT to his Gmail). Suggested repo name: `samajh`.
- [ ] ⏳ 2. Demo video — YouTube or Vimeo, **6 minutes or less**, public or unlisted, shows the project working (not just slides). Script ready in `docs/VIDEO_SCRIPT.md` (5:00–5:30). Not recorded yet.
- [ ] ⏳ 3. Project description — Devpost form completed: name, problem, how it solves it, how it uses AI, what was learned, what to build next. Draft ready in `docs/DEVPOST_DRAFT.md`. Not submitted yet.
- [x] ✅ 4. Track selection — Education, stated in the additional-details question / public description (draft)
- [x] ✅ 5. Team members — solo: Daim Ali only, added on the submission
- [ ] ⏳ Saving a draft does NOT enter the hackathon — must click Submit, then reopen and verify status is "submitted", not draft
- [ ] ⏳ Re-read Devpost /rules and /updates once more before submitting

## 8. Judging criteria — 5 categories, 20% each

- [x] ✅ Problem and Impact (20%) — clear local problem (English STEM text is hard for Urdu-thinking students), real user group, before/after example in hero
- [x] ✅ Use of AI (20%) — disclosed coding assistance + offline baseline + evidence check + measured comparison (45/45 verified, 0 numbers changed)
- [x] ✅ Functionality (20%) — works as shown; 27/27 tests pass; offline fallback so it never breaks on camera; fresh-copy run verified (27/27 in /tmp copy, eval 45/45)
- [ ] ⚠️ Learning and Growth (20%) — concrete "what I learned" in README/Devpost (5 points, incl. real bugs found); **no student test run yet (0 students, not 3)** — honestly stated everywhere; weakens this score but is not a disqualifier
- [ ] ⏳ Presentation (20%) — demo video (script ready, not recorded) + Demo Day presentation (see §10)

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
- [ ] ⏳ **22 Nov 2026, 9:59 AM PKT — submission deadline (target: submit 60–90 min early)**
- [ ] ⏳ 22–24 Nov 2026 — judges review complete submissions
- [ ] ⏳ **Tue 24 Nov 2026 (EST) — Demo Day (live or prerecorded) + winners announced.** Times, meeting links, order and prerecorded instructions are announced in the STEM2Connect AI Hackathon Discord — check Discord for your slot.

## 11. Measured results (real numbers only, 21 Nov 2026)

- Tests: **27/27 pass, 0 fail** (`node --test tests/samajh.test.mjs`) — 18 original + 9 added in the second fix round (number warning, Urdu-script input, prompt injection, quiz scoring, flashcard reset, Urdu study sheet); fresh-copy check also 27/27
- Eval: 3 samples × 3 languages = 9 runs — **45/45 quiz items evidence-verified (100%)**, **45/45 quiz answers manually checked correct**, **0 explanations changed a number/formula**, median engine time **about 1–2 ms (varies run to run; latest medians of medians 1.19 and 1.26 ms, observed range 1.05–1.73 ms)**
- Student clarity rating: **not measured** (no student test)
- AI mode: **not measured** (no provider connected)
- Serving check: index.html, style.css, app.js, samajh.js, all 3 samples — all HTTP 200; only external URLs are Google Fonts; only fetch is local samples; no keys, no personal data (secrets scan: zero hits)

## 12. Honest limits — must stay in README / Devpost / video (do not hide)

- Offline mode only; no in-product AI service.
- Explanation stays in English (extractive sentences from the passage); only glossary and quiz wording are in Roman Urdu / Urdu script.
- Cloze questions test sentence-matching, not deep comprehension.
- No student test run (0 students).
- No live hosting — local run + video are the evidence.
- One local git commit (no remote yet; push pending on Daim's code).

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

## 14. What is left — in order

1. **Daim sends the 8-char GitHub sudo code** (email 21 Nov 16:42 PKT) → CLI authorises → push the already-committed `samajh` repo (public) → verify it opens logged-out, add repo URL to README + Devpost draft.
2. **Live browser click-through** before recording: tabs, one full quiz pass, "Show in passage", flashcard reset, download.
3. **Record the demo video** (script ready, 5:00–5:30), upload unlisted to YouTube/Vimeo, add the link to README + Devpost draft.
4. **Daim's own review** (review-before-submit rule): especially the Urdu seed-glossary spellings and the "What I learned" wording.
5. **Submit on Devpost** by 22 Nov 9:59 AM PKT (aim 60–90 min early), reopen and verify "submitted", not draft.
6. **Demo Day, Tue 24 Nov**: check Discord for slot/link; present live or prerecorded; then request the Certificate of Participation and follow the private .xyz domain instructions.
