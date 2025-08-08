import React, { useState } from 'react';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';

/**
 * Root component controlling the flow of the MAI survey. Initially
 * renders the questionnaire. When the survey is completed and the
 * user information is submitted, it switches to the results view.
 */
function App() {
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [info, setInfo] = useState({});

  const handleComplete = (ans, userInfo) => {
    setAnswers(ans);
    setInfo(userInfo);
    setCompleted(true);
  };

  const handleRestart = () => {
    setCompleted(false);
    setAnswers([]);
    setInfo({});
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header: use a richer indigo tone for a modern feel */}
      <header className="bg-indigo-600 text-white py-5 shadow">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-semibold tracking-wide">MAI 元认知意识测评</h1>
        </div>
      </header>
      {/* Main content fills the remaining height */}
      <main className="flex-1 py-8 px-4">
        {completed ? (
          <Results answers={answers} info={info} onRestart={handleRestart} />
        ) : (
          <Questionnaire onComplete={handleComplete} />
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-100 py-4 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} MAI Survey</p>
      </footer>
    </div>
  );
}

export default App;