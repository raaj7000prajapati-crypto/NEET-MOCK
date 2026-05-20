import { useState } from 'react';
import styles from './ResultPage.module.css';

const SUBJECTS = ['physics', 'chemistry', 'biology'];

export default function ResultPage({ questions, answers, candidate, testName, onReturnHome }) {
  const [filter, setFilter] = useState('all'); // all | correct | wrong | unattempted
  const [expandedSubj, setExpandedSubj] = useState('physics');

  const calcScore = () => {
    let score = 0, correct = 0, wrong = 0, unattempted = 0;
    SUBJECTS.forEach(subj => {
      (questions[subj] || []).forEach(q => {
        const ans = answers[q.id];
        if (ans === undefined) unattempted++;
        else if (ans === q.correct) { score += 4; correct++; }
        else { score -= 1; wrong++; }
      });
    });
    return { score, correct, wrong, unattempted };
  };

  const { score, correct, wrong, unattempted } = calcScore();
  const total = SUBJECTS.reduce((s, subj) => s + (questions[subj]?.length || 0), 0);
  const maxScore = total * 4;
  const percentage = Math.max(0, ((score / maxScore) * 100)).toFixed(1);
  const accuracy = correct > 0 ? ((correct / (correct + wrong)) * 100).toFixed(1) : '0.0';

  const getSubjectResult = (subj) => {
    let sc = 0, cr = 0, wr = 0, un = 0;
    (questions[subj] || []).forEach(q => {
      const ans = answers[q.id];
      if (ans === undefined) un++;
      else if (ans === q.correct) { sc += 4; cr++; }
      else { sc -= 1; wr++; }
    });
    return { score: sc, correct: cr, wrong: wr, unattempted: un, total: (questions[subj]||[]).length };
  };

  const getFilteredQuestions = (subj) => {
    return (questions[subj] || []).filter(q => {
      const ans = answers[q.id];
      if (filter === 'correct') return ans === q.correct;
      if (filter === 'wrong') return ans !== undefined && ans !== q.correct;
      if (filter === 'unattempted') return ans === undefined;
      return true;
    });
  };

  const getScoreColor = () => {
    if (score >= maxScore * 0.8) return 'var(--success)';
    if (score >= maxScore * 0.5) return 'var(--primary)';
    if (score >= 0) return 'var(--warn)';
    return 'var(--danger)';
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.glow} />
      </div>

      <div className={styles.container}>
        {/* Hero score card */}
        <div className={styles.scoreHero}>
          <div className={styles.scoreHeroLeft}>
            <div className={styles.candidateBadge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {candidate.name} · {candidate.rollNumber}
            </div>
            <h1 className={styles.resultTitle}>
              {score >= maxScore * 0.7 ? '🎉 Excellent Performance!' :
               score >= maxScore * 0.5 ? '👍 Good Attempt!' :
               score >= 0 ? '📚 Keep Practicing!' : '💪 Don\'t Give Up!'}
            </h1>
            <p className={styles.resultSubtitle}>{testName} · Results Summary</p>

            <div className={styles.scoreDisplay}>
              <span className={styles.scoreNum} style={{ color: getScoreColor() }}>{score}</span>
              <span className={styles.scoreDen}>/ {maxScore}</span>
            </div>
          </div>

          <div className={styles.scoreHeroRight}>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statVal} style={{ color: 'var(--success)' }}>{correct}</span>
                <span className={styles.statLbl}>Correct</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal} style={{ color: 'var(--danger)' }}>{wrong}</span>
                <span className={styles.statLbl}>Incorrect</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal} style={{ color: 'var(--text-3)' }}>{unattempted}</span>
                <span className={styles.statLbl}>Skipped</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal} style={{ color: 'var(--primary)' }}>{percentage}%</span>
                <span className={styles.statLbl}>Score %</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal} style={{ color: 'var(--accent)' }}>{accuracy}%</span>
                <span className={styles.statLbl}>Accuracy</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statVal}>{total}</span>
                <span className={styles.statLbl}>Attempted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className={styles.subjectCards}>
          {SUBJECTS.map(subj => {
            const res = getSubjectResult(subj);
            const pct = (res.correct / res.total) * 100;
            return (
              <div key={subj} className={styles.subjectCard}>
                <div className={styles.subjectCardHeader}>
                  <span className={styles.subjectCardName}>{subj.charAt(0).toUpperCase() + subj.slice(1)}</span>
                  <span className={styles.subjectCardScore} style={{
                    color: res.score >= 0 ? 'var(--success)' : 'var(--danger)'
                  }}>{res.score > 0 ? '+' : ''}{res.score}</span>
                </div>
                <div className={styles.subjectCardBar}>
                  <div className={styles.subjectCardBarFill} style={{ width: `${pct}%` }} />
                </div>
                <div className={styles.subjectCardStats}>
                  <span style={{ color: 'var(--success)' }}>{res.correct} ✓</span>
                  <span style={{ color: 'var(--danger)' }}>{res.wrong} ✗</span>
                  <span style={{ color: 'var(--text-3)' }}>{res.unattempted} —</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed analysis */}
        <div className={styles.analysis}>
          <div className={styles.analysisHeader}>
            <h2 className={styles.analysisTitle}>Detailed Analysis</h2>
            <div className={styles.filters}>
              {[
                { key: 'all', label: `All (${total})` },
                { key: 'correct', label: `Correct (${correct})` },
                { key: 'wrong', label: `Wrong (${wrong})` },
                { key: 'unattempted', label: `Skipped (${unattempted})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`${styles.filterBtn} ${filter === key ? styles.filterBtnActive : ''}`}
                  onClick={() => setFilter(key)}
                >{label}</button>
              ))}
            </div>
          </div>

          {SUBJECTS.map(subj => {
            const filtered = getFilteredQuestions(subj);
            if (filtered.length === 0) return null;
            const isExpanded = expandedSubj === subj;

            return (
              <div key={subj} className={styles.subjectSection}>
                <button
                  className={styles.subjectToggle}
                  onClick={() => setExpandedSubj(isExpanded ? null : subj)}
                >
                  <span className={styles.subjectToggleName}>{subj.charAt(0).toUpperCase() + subj.slice(1)}</span>
                  <span className={styles.subjectToggleCount}>{filtered.length} questions</span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: 'auto' }}
                  >
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {isExpanded && (
                  <div className={styles.questionList}>
                    {filtered.map((q, qi) => {
                      const userAns = answers[q.id];
                      const isCorrect = userAns === q.correct;
                      const isSkipped = userAns === undefined;

                      return (
                        <div
                          key={q.id}
                          className={`${styles.qCard} ${isCorrect ? styles.qCardCorrect : isSkipped ? styles.qCardSkipped : styles.qCardWrong}`}
                        >
                          <div className={styles.qCardHeader}>
                            <span className={styles.qCardNum}>Q.{qi + 1}</span>
                            <span className={`${styles.qCardStatus} ${isCorrect ? styles.statusCorrect : isSkipped ? styles.statusSkipped : styles.statusWrong}`}>
                              {isCorrect ? '✅ +4' : isSkipped ? '⚪ 0' : '❌ −1'}
                            </span>
                          </div>
                          <p className={styles.qCardText}>{q.question}</p>
                          <div className={styles.qCardOptions}>
                            {q.options.map((opt, oi) => {
                              const isOCorrect = oi === q.correct;
                              const isOSelected = userAns === oi;
                              return (
                                <div
                                  key={oi}
                                  className={`${styles.qCardOpt}
                                    ${isOCorrect ? styles.optCorrect : ''}
                                    ${isOSelected && !isOCorrect ? styles.optWrong : ''}
                                  `}
                                >
                                  <span className={styles.qCardOptLabel}>{String.fromCharCode(65 + oi)}</span>
                                  <span>{opt}</span>
                                  <div className={styles.optBadges}>
                                    {isOSelected && <span className={styles.badgeYours}>Your answer</span>}
                                    {isOCorrect && <span className={styles.badgeCorrect}>Correct</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className={styles.homeBtn} onClick={onReturnHome}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Return to Home
        </button>
      </div>
    </div>
  );
}
