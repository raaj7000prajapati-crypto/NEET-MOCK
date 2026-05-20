# How to Add Questions to the Bank

The entire question pool lives in a single file:

```
src/questionBank.js
```

## Format

Each subject (`physics`, `chemistry`, `biology`) is an array of question objects:

```js
export const questionBank = {
  physics: [
    {
      id: 1,               // must be globally unique across ALL subjects
      subject: "physics",
      topic: "Kinematics", // free-form topic label
      question: "A particle moves...\n(multi-line supported)",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 2,          // 0-indexed (0=A, 1=B, 2=C, 3=D)
    },
    // ...
  ],
  chemistry: [ /* same shape */ ],
  biology:   [ /* same shape */ ],
};
```

## Rules

| Rule | Details |
|------|---------|
| **Unique IDs** | Every question must have a globally unique `id` integer. Don't reuse IDs across subjects. |
| **Exactly 4 options** | Each `options` array must have exactly 4 entries. |
| **correct is 0-indexed** | `correct: 0` means option A is correct. |
| **Bank ≥ exam quota** | The bank must have at least as many questions as `questionsPerExam` in `examConfig.js`. |

## Changing how many questions appear per exam

Edit `src/examConfig.js`:

```js
subjects: {
  physics:   { label: 'Physics',   questionsPerExam: 45  },
  chemistry: { label: 'Chemistry', questionsPerExam: 45  },
  biology:   { label: 'Biology',   questionsPerExam: 90  },
},
```

## Parsing raw text files

Use the included `parse_questions.cjs` script as a starting point:

```bash
node parse_questions.cjs
```

It reads `raw_questions.txt` and outputs a JS data file you can merge
into `questionBank.js`. Just make sure IDs are globally unique before merging.

## Disabling option shuffling

In `src/examConfig.js`:

```js
shuffleOptions: false,   // options appear in original A/B/C/D order
```
