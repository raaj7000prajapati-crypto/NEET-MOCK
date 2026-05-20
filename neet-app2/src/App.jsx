import { useState } from 'react';
import HomePage from './pages/HomePage';
import TestController from './components/TestController';
import { getBankStats } from './examBuilder';

export default function App() {
  // { sessionId: string, label: string } | null
  const [activeSession, setActiveSession] = useState(null);

  const handleSelectTest = ({ label }) => {
    // Each click = new unique session ID → new randomized paper
    const sessionId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    setActiveSession({ sessionId, label });
  };

  if (activeSession) {
    return (
      <TestController
        key={activeSession.sessionId}
        sessionId={activeSession.sessionId}
        testLabel={activeSession.label}
        onReturnHome={() => setActiveSession(null)}
      />
    );
  }

  return <HomePage onSelectTest={handleSelectTest} bankStats={getBankStats()} />;
}
