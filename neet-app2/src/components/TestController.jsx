import { useTest } from '../hooks/useTest';
import CandidateForm from '../pages/CandidateForm';
import InstructionsPage from '../pages/InstructionsPage';
import TestPage from '../pages/TestPage';
import ResultPage from '../pages/ResultPage';
import { EXAM_CONFIG } from '../examConfig';

export default function TestController({ sessionId, testLabel, onReturnHome }) {
  const test = useTest(sessionId);

  // While questions are being built (sync, so very fast — just a guard)
  if (!test.questions) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-2)',
        fontFamily: 'var(--font-mono)', fontSize: '0.9rem', background: 'var(--bg)',
      }}>
        Building your exam paper…
      </div>
    );
  }

  if (test.stage === 'form' || test.stage === 'landing') {
    return (
      <CandidateForm
        testName={testLabel}
        onBack={onReturnHome}
        onSubmit={test.submitForm}
      />
    );
  }

  if (test.stage === 'instructions') {
    return (
      <InstructionsPage
        candidate={test.candidate}
        testName={testLabel}
        examConfig={EXAM_CONFIG}
        onBack={test.startForm}
        onStart={test.startTest}
      />
    );
  }

  if (test.stage === 'test') {
    return (
      <TestPage
        testName={testLabel}
        questions={test.questions}
        currentSubject={test.currentSubject}
        currentIndex={test.currentIndex}
        currentQuestion={test.currentQuestion}
        answers={test.answers}
        status={test.status}
        timeRemaining={test.timeRemaining}
        showSubmitModal={test.showSubmitModal}
        setShowSubmitModal={test.setShowSubmitModal}
        handleAnswer={test.handleAnswer}
        handleClearResponse={test.handleClearResponse}
        handleMarkForReview={test.handleMarkForReview}
        handleNext={test.handleNext}
        handlePrev={test.handlePrev}
        goToQuestion={test.goToQuestion}
        setCurrentSubject={test.setCurrentSubject}
        setCurrentIndex={test.setCurrentIndex}
        submitTest={test.submitTest}
        formatTime={test.formatTime}
        getSubjectStats={test.getSubjectStats}
      />
    );
  }

  if (test.stage === 'result') {
    return (
      <ResultPage
        questions={test.questions}
        answers={test.answers}
        candidate={test.candidate}
        testName={testLabel}
        onReturnHome={() => { test.resetTest(); onReturnHome(); }}
      />
    );
  }

  return null;
}
