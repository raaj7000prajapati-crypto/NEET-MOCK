import styles from './InstructionsPage.module.css';

const LEGEND = [
  { color: '#34d399', label: 'Answered', desc: 'You have answered the question.' },
  { color: '#f87171', label: 'Not Answered', desc: 'Visited but not answered.' },
  { color: '#a78bfa', label: 'Marked for Review', desc: 'Flagged for later review.' },
  { color: '#fbbf24', label: 'Answered & Marked', desc: 'Answered but also flagged.' },
  { color: '#475569', label: 'Not Visited', desc: 'Not yet opened.' },
];

export default function InstructionsPage({ candidate, testName, onBack, onStart }) {
  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.glow} />
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.back} onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <div className={styles.candidateChip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>{candidate.name}</span>
            <span className={styles.chipDot}>·</span>
            <span className={styles.chipRoll}>{candidate.rollNumber}</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <h1>📋 Exam Instructions</h1>
            <span className={styles.testLabel}>{testName}</span>
          </div>

          <div className={styles.sections}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>General Rules</h2>
              <ul className={styles.list}>
                <li>This paper contains <strong>3 sections</strong>: Physics, Chemistry, and Biology (Botany + Zoology).</li>
                <li>Total duration is <strong>3 hours (180 minutes)</strong>. Timer starts once you click "Start Test".</li>
                <li>Each correct answer carries <strong>+4 marks</strong>. Each wrong answer deducts <strong>1 mark</strong>. Unattempted questions carry <strong>0 marks</strong>.</li>
                <li>Do not refresh or close the browser tab during the test — your progress is auto-saved and you can resume.</li>
                <li>You may navigate freely between sections and questions at any time.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Question Navigation</h2>
              <ul className={styles.list}>
                <li>Use the <strong>Question Palette</strong> on the right to jump to any question directly.</li>
                <li>Use <strong>Prev / Next</strong> buttons to navigate sequentially.</li>
                <li>Click <strong>Mark for Review</strong> to flag a question — you can still answer it and return later.</li>
                <li>Click <strong>Clear Response</strong> to remove your selected answer.</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Question Status Legend</h2>
              <div className={styles.legend}>
                {LEGEND.map(({ color, label, desc }) => (
                  <div key={label} className={styles.legendItem}>
                    <div className={styles.legendDot} style={{ background: color }} />
                    <div>
                      <span className={styles.legendLabel}>{label}</span>
                      <span className={styles.legendDesc}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.warning}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Once submitted, you cannot change your answers. Submit only when you are ready.</span>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.footerInfo}>
              <span>180 Questions</span>
              <span className={styles.footerDot}>·</span>
              <span>3 Hours</span>
              <span className={styles.footerDot}>·</span>
              <span>720 Max Marks</span>
            </div>
            <button className={styles.startBtn} onClick={onStart}>
              Start Examination
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
