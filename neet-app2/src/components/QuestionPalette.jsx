import styles from './QuestionPalette.module.css';

const SUBJECTS = ['physics', 'chemistry', 'biology'];

const STATUS_COLOR = {
  answered: 'var(--success)',
  marked: 'var(--accent)',
  markedAnswered: 'var(--warn)',
  visited: 'var(--danger)',
};

const LEGEND = [
  { key: 'answered', label: 'Answered', color: 'var(--success)' },
  { key: 'markedAnswered', label: 'Ans + Marked', color: 'var(--warn)' },
  { key: 'marked', label: 'Marked', color: 'var(--accent)' },
  { key: 'visited', label: 'Not Answered', color: 'var(--danger)' },
  { key: 'notVisited', label: 'Not Visited', color: 'var(--text-3)' },
];

export default function QuestionPalette({
  questions, currentSubject, currentIndex,
  answers, status, onJump, onClose, onSubmit,
}) {
  return (
    <div className={styles.palette}>
      <div className={styles.header}>
        <h3 className={styles.title}>Question Palette</h3>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close palette">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className={styles.legend}>
        {LEGEND.map(({ key, label, color }) => (
          <div key={key} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.subjects}>
        {SUBJECTS.map(subj => {
          const qs = questions[subj] || [];
          const answeredCount = qs.filter(q =>
            status[q.id] === 'answered' || status[q.id] === 'markedAnswered'
          ).length;

          return (
            <div key={subj} className={styles.subjectSection}>
              <div className={styles.subjectHeader}>
                <span className={styles.subjectName}>{subj.charAt(0).toUpperCase() + subj.slice(1)}</span>
                <span className={styles.subjectCount}>{answeredCount}/{qs.length}</span>
              </div>
              <div className={styles.grid}>
                {qs.map((q, idx) => {
                  const s = status[q.id];
                  const isCurrent = currentSubject === subj && currentIndex === idx;
                  const bg = STATUS_COLOR[s] || 'transparent';
                  const border = isCurrent ? 'var(--primary)' : (s ? 'transparent' : 'var(--border)');

                  return (
                    <button
                      key={q.id}
                      className={`${styles.qBtn} ${isCurrent ? styles.qBtnCurrent : ''}`}
                      style={{
                        background: bg,
                        borderColor: border,
                        color: s ? '#fff' : 'var(--text-2)',
                      }}
                      onClick={() => { onJump(subj, idx); onClose?.(); }}
                      title={`Q${idx + 1}: ${s || 'Not Visited'}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.submitBtn} onClick={onSubmit}>
          Submit Test
        </button>
      </div>
    </div>
  );
}
