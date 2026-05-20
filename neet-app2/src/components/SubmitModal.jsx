import styles from './SubmitModal.module.css';

const SUBJECTS = ['physics', 'chemistry', 'biology'];

export default function SubmitModal({ questions, answers, status, onCancel, onConfirm }) {
  const stats = SUBJECTS.map(subj => {
    const qs = questions[subj] || [];
    const answered = qs.filter(q => answers[q.id] !== undefined).length;
    const marked = qs.filter(q => status[q.id] === 'marked' || status[q.id] === 'markedAnswered').length;
    const unattempted = qs.length - answered;
    return { subj, total: qs.length, answered, marked, unattempted };
  });

  const totals = stats.reduce((acc, s) => ({
    answered: acc.answered + s.answered,
    marked: acc.marked + s.marked,
    unattempted: acc.unattempted + s.unattempted,
    total: acc.total + s.total,
  }), { answered: 0, marked: 0, unattempted: 0, total: 0 });

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.icon}>⚠️</div>
          <h2 className={styles.title}>Submit Examination?</h2>
          <p className={styles.subtitle}>This action cannot be undone. Review your attempt summary below.</p>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Total Questions</span>
            <span className={styles.summaryValue}>{totals.total}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summarySuccess}`}>
            <span className={styles.summaryLabel}>✅ Answered</span>
            <span className={styles.summaryValue}>{totals.answered}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryWarn}`}>
            <span className={styles.summaryLabel}>🔖 Marked for Review</span>
            <span className={styles.summaryValue}>{totals.marked}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.summaryDanger}`}>
            <span className={styles.summaryLabel}>⭕ Not Attempted</span>
            <span className={styles.summaryValue}>{totals.unattempted}</span>
          </div>
        </div>

        <div className={styles.subjectBreakdown}>
          {stats.map(({ subj, total, answered, unattempted }) => (
            <div key={subj} className={styles.subjectRow}>
              <span className={styles.subjectName}>{subj.charAt(0).toUpperCase() + subj.slice(1)}</span>
              <div className={styles.subjectBar}>
                <div
                  className={styles.subjectBarFill}
                  style={{ width: `${(answered / total) * 100}%` }}
                />
              </div>
              <span className={styles.subjectStat}>{answered}/{total}</span>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel}>Continue Test</button>
          <button className={styles.submitBtn} onClick={onConfirm}>Yes, Submit</button>
        </div>
      </div>
    </div>
  );
}
