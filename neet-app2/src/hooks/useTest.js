import { useState, useEffect, useRef, useCallback } from 'react';
import { buildExam, createSeed } from '../examBuilder';
import { EXAM_CONFIG, SUBJECTS } from '../examConfig';

const KEY = (sessionId, k) => `neet_session_${sessionId}_${k}`;

export function useTest(sessionId) {
  const [questions, setQuestions] = useState(null);
  const [seed, setSeed] = useState(null);
  const [stage, setStage] = useState('landing');
  const [candidate, setCandidate] = useState({ name: '', rollNumber: '' });
  const [currentSubject, setCurrentSubject] = useState(SUBJECTS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_CONFIG.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef(null);

  // Restore or create session
  useEffect(() => {
    if (!sessionId) return;
    const savedSeed = localStorage.getItem(KEY(sessionId, 'seed'));
    const savedStage = localStorage.getItem(KEY(sessionId, 'stage'));

    if (savedSeed) {
      const s = parseInt(savedSeed);
      setSeed(s);
      setQuestions(buildExam(s));
      const stageVal = savedStage || 'landing';
      setStage(stageVal);
      if (stageVal === 'test' || stageVal === 'result') {
        setAnswers(JSON.parse(localStorage.getItem(KEY(sessionId, 'answers')) || '{}'));
        setStatus(JSON.parse(localStorage.getItem(KEY(sessionId, 'status')) || '{}'));
        setCandidate(JSON.parse(localStorage.getItem(KEY(sessionId, 'candidate')) || '{"name":"","rollNumber":""}'));
        const savedTime = localStorage.getItem(KEY(sessionId, 'time'));
        if (savedTime && stageVal === 'test') setTimeRemaining(parseInt(savedTime));
      }
    } else {
      const s = createSeed();
      setSeed(s);
      setQuestions(buildExam(s));
      localStorage.setItem(KEY(sessionId, 'seed'), s);
    }
  }, [sessionId]);

  // Timer
  useEffect(() => {
    if (stage !== 'test' || isSubmitted || !questions) return;
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const next = prev - 1;
        localStorage.setItem(KEY(sessionId, 'time'), next);
        if (next <= 0) {
          clearInterval(timerRef.current);
          finalizeSubmit();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage, isSubmitted, questions]);

  // Persist on change
  useEffect(() => {
    if (stage === 'test' || stage === 'result') {
      localStorage.setItem(KEY(sessionId, 'answers'), JSON.stringify(answers));
      localStorage.setItem(KEY(sessionId, 'status'), JSON.stringify(status));
      localStorage.setItem(KEY(sessionId, 'stage'), stage);
    }
  }, [answers, status, stage]);

  const currentQuestions = questions?.[currentSubject] ?? [];
  const currentQuestion = currentQuestions[currentIndex] ?? null;
  const totalQuestions = questions ? SUBJECTS.reduce((sum, s) => sum + (questions[s]?.length ?? 0), 0) : 0;

  const getSubjectStats = useCallback((subj) => {
    const qs = questions?.[subj] ?? [];
    return {
      total: qs.length,
      answered: qs.filter(q => status[q.id] === 'answered' || status[q.id] === 'markedAnswered').length,
      marked: qs.filter(q => status[q.id] === 'marked' || status[q.id] === 'markedAnswered').length,
      notVisited: qs.filter(q => !status[q.id]).length,
    };
  }, [questions, status]);

  const startForm = () => setStage('form');

  const submitForm = (data) => {
    setCandidate(data);
    localStorage.setItem(KEY(sessionId, 'candidate'), JSON.stringify(data));
    setStage('instructions');
  };

  const startTest = () => {
    setStage('test');
    localStorage.setItem(KEY(sessionId, 'stage'), 'test');
    const firstId = questions?.[SUBJECTS[0]]?.[0]?.id;
    if (firstId) setStatus(prev => ({ ...prev, [firstId]: prev[firstId] || 'visited' }));
  };

  const handleAnswer = useCallback((optionIndex) => {
    if (!currentQuestion) return;
    const id = currentQuestion.id;
    setAnswers(prev => ({ ...prev, [id]: optionIndex }));
    setStatus(prev => ({ ...prev, [id]: prev[id] === 'marked' ? 'markedAnswered' : 'answered' }));
  }, [currentQuestion]);

  const handleClearResponse = useCallback(() => {
    if (!currentQuestion) return;
    const id = currentQuestion.id;
    setAnswers(prev => { const n = { ...prev }; delete n[id]; return n; });
    setStatus(prev => ({ ...prev, [id]: prev[id] === 'markedAnswered' ? 'marked' : 'visited' }));
  }, [currentQuestion]);

  const handleMarkForReview = useCallback(() => {
    if (!currentQuestion) return;
    const id = currentQuestion.id;
    setStatus(prev => {
      const cur = prev[id];
      if (cur === 'answered') return { ...prev, [id]: 'markedAnswered' };
      if (cur === 'markedAnswered') return { ...prev, [id]: 'answered' };
      return { ...prev, [id]: cur === 'marked' ? 'visited' : 'marked' };
    });
  }, [currentQuestion]);

  const goToQuestion = useCallback((subj, idx) => {
    setCurrentSubject(subj);
    setCurrentIndex(idx);
    const id = questions?.[subj]?.[idx]?.id;
    if (id) setStatus(prev => ({ ...prev, [id]: prev[id] || 'visited' }));
  }, [questions]);

  const handleNext = useCallback(() => {
    if (currentIndex < currentQuestions.length - 1) {
      goToQuestion(currentSubject, currentIndex + 1);
    } else {
      const i = SUBJECTS.indexOf(currentSubject);
      if (i < SUBJECTS.length - 1) goToQuestion(SUBJECTS[i + 1], 0);
    }
  }, [currentIndex, currentQuestions.length, currentSubject, goToQuestion]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToQuestion(currentSubject, currentIndex - 1);
    } else {
      const i = SUBJECTS.indexOf(currentSubject);
      if (i > 0) {
        const prevSubj = SUBJECTS[i - 1];
        goToQuestion(prevSubj, (questions?.[prevSubj]?.length ?? 1) - 1);
      }
    }
  }, [currentIndex, currentSubject, goToQuestion, questions]);

  const finalizeSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    setIsSubmitted(true);
    setStage('result');
    setShowSubmitModal(false);
    localStorage.setItem(KEY(sessionId, 'stage'), 'result');
    localStorage.removeItem(KEY(sessionId, 'time'));
  }, [sessionId]);

  const submitTest = useCallback(() => finalizeSubmit(), [finalizeSubmit]);

  const calculateScore = useCallback(() => {
    if (!questions) return { score: 0, correct: 0, wrong: 0, unattempted: 0, total: 0 };
    const { correct: cMark, wrong: wMark } = EXAM_CONFIG.marking;
    let score = 0, correct = 0, wrong = 0, unattempted = 0;
    SUBJECTS.forEach(subj => {
      (questions[subj] ?? []).forEach(q => {
        const ans = answers[q.id];
        if (ans === undefined) unattempted++;
        else if (ans === q.correct) { score += cMark; correct++; }
        else { score += wMark; wrong++; }
      });
    });
    return { score, correct, wrong, unattempted, total: totalQuestions };
  }, [answers, questions, totalQuestions]);

  const resetTest = useCallback(() => {
    ['seed','stage','time','answers','status','candidate'].forEach(k =>
      localStorage.removeItem(KEY(sessionId, k))
    );
    setStage('landing');
    setCandidate({ name: '', rollNumber: '' });
    setCurrentSubject(SUBJECTS[0]);
    setCurrentIndex(0);
    setAnswers({});
    setStatus({});
    setTimeRemaining(EXAM_CONFIG.durationMinutes * 60);
    setIsSubmitted(false);
    setQuestions(null);
    setSeed(null);
  }, [sessionId]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  };

  return {
    stage, candidate, currentSubject, currentIndex,
    answers, status, timeRemaining, showSubmitModal,
    currentQuestion, currentQuestions, totalQuestions, questions, seed,
    startForm, submitForm, startTest,
    handleAnswer, handleClearResponse, handleMarkForReview,
    handleNext, handlePrev, goToQuestion,
    submitTest, resetTest, calculateScore,
    setShowSubmitModal, setCurrentSubject, setCurrentIndex,
    formatTime, getSubjectStats,
    SUBJECTS,
  };
}
