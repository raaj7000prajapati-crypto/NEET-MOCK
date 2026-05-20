/**
 * examBuilder.js
 *
 * Builds a randomized exam from the question bank using a seeded PRNG
 * (Mulberry32). The seed is stored in localStorage so the same candidate
 * always gets the same paper if they reload mid-exam, but each new session
 * gets a different paper.
 *
 * Also optionally shuffles option order per question (remapping correct index).
 */

import { questionBank } from './questionBank';
import { EXAM_CONFIG, SUBJECTS } from './examConfig';

// ── Seeded PRNG (Mulberry32) ──────────────────────────────────────────────────
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle using a seeded rand function
function shuffle(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Main builder ──────────────────────────────────────────────────────────────

/**
 * Builds a full exam paper from the bank.
 * @param {number} seed - Integer seed for reproducibility
 * @returns {{ physics: Question[], chemistry: Question[], biology: Question[] }}
 */
export function buildExam(seed) {
  const rand = mulberry32(seed);
  const result = {};

  for (const subj of SUBJECTS) {
    const pool = questionBank[subj] ?? [];
    const count = EXAM_CONFIG.subjects[subj].questionsPerExam;

    if (pool.length < count) {
      console.warn(
        `[examBuilder] Bank has only ${pool.length} ${subj} questions but exam needs ${count}. Using all.`
      );
    }

    // Shuffle the pool, then take the first `count`
    const shuffled = shuffle(pool, rand);
    const picked = shuffled.slice(0, count);

    // Optionally shuffle options (remap correct index)
    result[subj] = picked.map((q) => {
      if (!EXAM_CONFIG.shuffleOptions) return q;

      const optionIndices = shuffle([0, 1, 2, 3], rand);
      const newOptions = optionIndices.map((i) => q.options[i]);
      const newCorrect = optionIndices.indexOf(q.correct);

      return { ...q, options: newOptions, correct: newCorrect };
    });
  }

  return result;
}

/**
 * Generates a random integer seed and stores it.
 * Call once at the start of each new exam session.
 */
export function createSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

/**
 * Returns bank size info — useful for the config UI.
 */
export function getBankStats() {
  return SUBJECTS.reduce((acc, s) => {
    acc[s] = {
      inBank: questionBank[s]?.length ?? 0,
      neededPerExam: EXAM_CONFIG.subjects[s].questionsPerExam,
    };
    return acc;
  }, {});
}
