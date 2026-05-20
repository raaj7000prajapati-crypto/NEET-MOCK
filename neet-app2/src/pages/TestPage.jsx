import { useState } from 'react';
import QuestionPalette from '../components/QuestionPalette';
import SubmitModal from '../components/SubmitModal';
import styles from './TestPage.module.css';

const SUBJECTS = ['physics', 'chemistry', 'biology'];

export default function TestPage({
  testName,
  questions, currentSubject, currentIndex, currentQuestion,
  answers, status, timeRemaining,
  showSubmitModal, setShowSubmitModal,
  handleAnswer, handleClearResponse, handleMarkForReview,
  handleNext, handlePrev, goToQuestion,
  setCurrentSubject, setCurrentIndex,
  submitTest, formatTime, getSubjectStats,
}) {
  const [showPalette, setShowPalette] = useState(false);

  if (!currentQuestion) return <div className={styles.loading}>Loading...</div>;

  const qId = currentQuestion.id;
  const selectedOption = answers[qId];
  const qStatus = status[qId];
  const isMarked = qStatus === 'marked' || qStatus === 'markedAnswered';
  const isWarning = timeRemaining < 600;
  const isCritical = timeRemaining < 300;

  const globalIndex = SUBJECTS.slice(0, SUBJECTS.indexOf(currentSubject))
    .reduce((sum, s) => sum + (questions[s]?.length || 0), 0) + currentIndex + 1;
  const totalQuestions = SUBJECTS.reduce((sum, s) => sum + (questions[s]?.length || 0), 0);

  return (
    <div className={styles.page}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>NEET 2026</div>
          <span className={styles.testName}>{testName}</span>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.subjectTabs}>
            {SUBJECTS.map(subj => {
              const stats = getSubjectStats(subj);
              return (
                <button
                  key={subj}
                  className={`${styles.subjectTab} ${currentSubject === subj ? styles.subjectTabActive : ''}`}
                  onClick={() => { setCurrentSubject(subj); setCurrentIndex(0); goToQuestion(subj, 0); }}
                >
                  <span className={styles.subjectTabName}>{subj.charAt(0).toUpperCase() + subj.slice(1)}</span>
                  <span className={styles.subjectTabCount}>{stats.answered}/{stats.total}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={`${styles.timer} ${isWarning ? styles.timerWarn : ''} ${isCritical ? styles.timerCritical : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {formatTime(timeRemaining)}
          </div>
          <button
            className={styles.paletteToggle}
            onClick={() => setShowPalette(p => !p)}
            aria-label="Toggle palette"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className={styles.body}>
        {/* Question panel */}
        <main className={styles.questionPanel}>
          {/* Q meta */}
          <div className={styles.qMeta}>
            <div className={styles.qNumber}>
              <span className={styles.qIndex}>Q.{currentIndex + 1}</span>
              <span className={styles.qGlobal}>({globalIndex} of {totalQuestions})</span>
            </div>
            {currentQuestion.section && (
              <span className={styles.section}>Section {currentQuestion.section}</span>
            )}
            {isMarked && (
              <span className={styles.markedBadge}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                </svg>
                Marked
              </span>
            )}
          </div>

          {/* Question text */}
          <div className={styles.questionBox}>
            <p className={styles.questionText}>{currentQuestion.question}</p>
          </div>

          {/* Options */}
          <div className={styles.options}>
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                  onClick={() => handleAnswer(idx)}
                >
                  <div className={styles.optionLabel}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={styles.optionText}>{opt}</span>
                  {isSelected && (
                    <svg className={styles.optionCheck} width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <div className={styles.actionsLeft}>
              <button
                className={`${styles.actionBtn} ${styles.markBtn} ${isMarked ? styles.markBtnActive : ''}`}
                onClick={handleMarkForReview}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isMarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                </svg>
                {isMarked ? 'Unmark' : 'Mark for Review'}
              </button>
              {selectedOption !== undefined && (
                <button className={`${styles.actionBtn} ${styles.clearBtn}`} onClick={handleClearResponse}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  Clear Response
                </button>
              )}
            </div>
            <div className={styles.actionsRight}>
              <button className={`${styles.navBtn} ${styles.navBtnSecondary}`} onClick={handlePrev}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Previous
              </button>
              <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={handleNext}>
                Next
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Palette sidebar - desktop */}
        <aside className={styles.paletteSidebar}>
          <QuestionPalette
            questions={questions}
            currentSubject={currentSubject}
            currentIndex={currentIndex}
            answers={answers}
            status={status}
            onJump={goToQuestion}
            onClose={() => {}}
            onSubmit={() => setShowSubmitModal(true)}
          />
        </aside>
      </div>

      {/* Mobile palette overlay */}
      {showPalette && (
        <div className={styles.mobileOverlay} onClick={() => setShowPalette(false)}>
          <div className={styles.mobilePalette} onClick={e => e.stopPropagation()}>
            <QuestionPalette
              questions={questions}
              currentSubject={currentSubject}
              currentIndex={currentIndex}
              answers={answers}
              status={status}
              onJump={goToQuestion}
              onClose={() => setShowPalette(false)}
              onSubmit={() => { setShowPalette(false); setShowSubmitModal(true); }}
            />
          </div>
        </div>
      )}

      {/* Submit modal */}
      {showSubmitModal && (
        <SubmitModal
          questions={questions}
          answers={answers}
          status={status}
          onCancel={() => setShowSubmitModal(false)}
          onConfirm={submitTest}
        />
      )}
    </div>
  );
}
