/**
 * Exam Configuration
 *
 * NEET standard: 45 Physics + 45 Chemistry + 90 Biology = 180 questions
 *
 * The randomizer will pick exactly these counts from the bank each session.
 * Increase bank size by adding more questions to questionBank.js.
 *
 * questionsPerSubject must always be <= bank size for that subject.
 */

export const EXAM_CONFIG = {
  durationMinutes: 180,

  subjects: {
    physics: {
      label: 'Physics',
      questionsPerExam: 45,
    },
    chemistry: {
      label: 'Chemistry',
      questionsPerExam: 45,
    },
    biology: {
      label: 'Biology',
      questionsPerExam: 90,
    },
  },

  // Marking scheme
  marking: {
    correct: 4,
    wrong: -1,
    unattempted: 0,
  },

  // Whether to also shuffle the order of answer options
  // (correct index is remapped so scoring stays accurate)
  shuffleOptions: true,
};

export const SUBJECTS = Object.keys(EXAM_CONFIG.subjects);

export const totalQuestionsPerExam = SUBJECTS.reduce(
  (sum, s) => sum + EXAM_CONFIG.subjects[s].questionsPerExam,
  0
);
