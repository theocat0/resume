import React, { useState, useEffect } from 'react';
import './App.css';
import AIService from './services/AIService';

function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelReady, setModelReady] = useState(true);
  const [useAI, setUseAI] = useState(true);

  useEffect(() => {
    async function initializeAI() {
      try {
        const initialized = await AIService.initialize();
        setModelReady(initialized);
      } catch (error) {
        console.error('AI initialization failed:', error);
        setUseAI(false);
      }
    }
    initializeAI();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      let response;
      if (useAI && modelReady) {
        response = await AIService.generateResponse(query);
      } else {
        response = AIService.getFallbackResponse(query);
      }
      setAnswer(response);
      setShowAnswer(true);
    } catch (error) {
      setAnswer(AIService.getFallbackResponse(query));
      setShowAnswer(true);
      setUseAI(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="search-container">
      <div className="logo-section">
        <h1 className="theo-logo">Théo</h1>
        <p className="subtitle">Computer Science Student & AI Enthusiast</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSubmit}>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              className="search-input"
              autoComplete="off"
            />
            {isLoading ? (
              <span className="loading-icon">⌛</span>
            ) : (
              <span className="mic-icon">🎤</span>
            )}
          </div>
          <div className="button-container">
            <button 
              type="submit" 
              className="search-button"
              disabled={isLoading}
            >
              {isLoading ? "Thinking..." : "Ask Théo"}
            </button>
            <button 
              type="button" 
              className="search-button" 
              onClick={() => {
                const questions = [
                  "What's your AI experience?",
                  "Tell me about your education",
                  "What are your skills?",
                  "What's your robotics background?"
                ];
                setQuery(questions[Math.floor(Math.random() * questions.length)]);
              }}
              disabled={isLoading}
            >
              I'm Feeling Lucky
            </button>
          </div>
        </form>
      </div>

      {showAnswer && (
        <div className="answer-section">
          <div className="answer-card">
            <div className="answer-header">
              <span className="result-count">
                {isLoading ? "Generating response..." : "Best match"}
              </span>
            </div>
            <p className="answer-text">{answer}</p>
          </div>
        </div>
      )}

      <div className="quick-links">
        <div className="link-item">
          <span className="link-icon">👨‍💻</span>
          <a href="#experience">Experience</a>
        </div>
        <div className="link-item">
          <span className="link-icon">🎓</span>
          <a href="#education">Education</a>
        </div>
        <div className="link-item">
          <span className="link-icon">🤖</span>
          <a href="#skills">Skills</a>
        </div>
        <div className="link-item">
          <span className="link-icon">📫</span>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </div>
  );
}

export default App; 