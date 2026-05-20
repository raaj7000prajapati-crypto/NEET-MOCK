import { useState } from 'react';
import { EXAM_CONFIG, totalQuestionsPerExam } from '../examConfig';
import styles from './HomePage.module.css';

const SUBJECT_ICONS = { physics: '⚕️', chemistry: '⚗️', biology: '🔬' };

export default function HomePage({ onSelectTest, bankStats }) {
  const [hovered, setHovered] = useState(null);

  const totalInBank = bankStats
    ? Object.values(bankStats).reduce((s, v) => s + v.inBank, 0)
    : 0;

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div className={styles.grid} />
      </div>

      <header className={styles.hero}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          NEET 2026 Preparation
        </div>
        <h1 className={styles.title}>
          Randomised Mock<br />
          <span className={styles.titleAccent}>Exam Papers</span>
        </h1>
        <p className={styles.subtitle}>
          Every attempt draws a fresh set of {totalQuestionsPerExam} questions from a bank of{' '}
          <strong style={{ color: 'var(--primary)' }}>{totalInBank}</strong> questions —
          so no two papers are alike and memorisation alone won't help.
        </p>
      </header>

      <main className={styles.main}>
        {/* Bank stats */}
        <div className={styles.bankCard}>
          <div className={styles.bankTitle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
            Question Bank
          </div>
          <div className={styles.bankSubjects}>
            {bankStats && Object.entries(bankStats).map(([subj, { inBank, neededPerExam }]) => (
              <div key={subj} className={styles.bankSubject}>
                <span className={styles.bankSubjectIcon}>{SUBJECT_ICONS[subj]}</span>
                <div className={styles.bankSubjectInfo}>
                  <span className={styles.bankSubjectName}>{subj.charAt(0).toUpperCase() + subj.slice(1)}</span>
                  <div className={styles.bankBar}>
                    <div
                      className={styles.bankBarFill}
                      style={{ width: `${Math.min(100, (inBank / Math.max(inBank, neededPerExam * 2)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className={styles.bankSubjectNums}>
                  <span className={styles.bankCount}>{inBank}</span>
                  <span className={styles.bankNeeded}>/{neededPerExam} per exam</span>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.bankHint}>
            Add more questions to <code>src/questionBank.js</code> to increase variety.
          </p>
        </div>

        {/* Start button */}
        <div className={styles.startSection}>
          <div
            className={`${styles.card} ${hovered ? styles.cardHovered : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={styles.cardTop}>
              <div className={styles.cardIcon}>📝</div>
              <div className={styles.cardMeta}>
                <span className={styles.cardNum}>{totalQuestionsPerExam} Qs</span>
                <span className={styles.cardMetaDot}>·</span>
                <span className={styles.cardDur}>{EXAM_CONFIG.durationMinutes} min</span>
              </div>
            </div>
            <h2 className={styles.cardTitle}>Start Mock Test</h2>
            <p className={styles.cardDesc}>
              A unique randomised paper is generated each time you start.
              Questions and option order are both shuffled.
            </p>

            <div className={styles.subjectPills}>
              {Object.entries(EXAM_CONFIG.subjects).map(([subj, cfg]) => (
                <div key={subj} className={styles.pill}>
                  <span>{SUBJECT_ICONS[subj]}</span>
                  <span>{cfg.label}</span>
                  <span className={styles.pillCount}>{cfg.questionsPerExam}</span>
                </div>
              ))}
            </div>

            <div className={styles.marking}>
              <span className={styles.markingCorrect}>+{EXAM_CONFIG.marking.correct} correct</span>
              <span className={styles.markingDot}>·</span>
              <span className={styles.markingWrong}>{EXAM_CONFIG.marking.wrong} wrong</span>
              <span className={styles.markingDot}>·</span>
              <span className={styles.markingSkip}>0 skipped</span>
            </div>

            <button
              className={styles.btn}
              onClick={() => onSelectTest({ label: 'NEET 2026 Mock Test' })}
            >
              Generate & Start
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="M4.93 4.93l4.24 4.24"/><path d="M14.83 9.17l4.24-4.24"/><path d="M14.83 14.83l4.24 4.24"/>
              <path d="M9.17 14.83l-4.24 4.24"/>
            </svg>
            Seeded PRNG — same session = same paper if you reload
          </div>
          <div className={styles.infoItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            Progress auto-saved — close tab, resume anytime
          </div>
          <div className={styles.infoItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Option order shuffled — pattern recognition won't work
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>NEET 2026 Mock Test Platform · Physics · Chemistry · Biology</p>
      </footer>
    </div>
  );
}
