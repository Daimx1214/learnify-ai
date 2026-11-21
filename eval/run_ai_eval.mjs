import { readFileSync } from 'node:fs';
import { aiEngine, checkNumbers, LANGUAGES } from '../samajh.js';
const samples = ['ohm','photosynthesis','newton2','pythagoras','cells'].map(n => [n, readFileSync(`samples/${n}.txt`,'utf8').trim()]);
let aiUsed=0, fallback=0, changedRuns=0, verified=0, total=0;
for (const [name, text] of samples) {
  for (const lang of Object.keys(LANGUAGES)) {
    const t0 = Date.now();
    const r = await aiEngine(text, 'class9', lang);
    const ms = Date.now()-t0;
    const changed = checkNumbers(text, r.explanation);
    if (r.mode==='ai') aiUsed++; else fallback++;
    if (changed.length) changedRuns++;
    verified += r.verifiedCount; total += r.totalQuiz;
    console.log(`${name} / ${lang}: mode=${r.mode} ms=${ms} changed=[${changed}] quiz=${r.verifiedCount}/${r.totalQuiz} | ${r.explanation.slice(0,90)}`);
  }
}
console.log(`SUMMARY ai=${aiUsed} fallback=${fallback} changedRuns=${changedRuns} quiz=${verified}/${total}`);
