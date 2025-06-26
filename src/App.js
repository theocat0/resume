import React, { useState, useEffect } from 'react';
import './App.css';
import AIService from './services/AIService';

function App() {
  const [query, setQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setShowAnswer(true);
    
    try {
      const results = await AIService.searchBlocks(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error:', error);
      setShowSearchResults(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLink = (category) => {
    const prompts = {
      experience: "What's your professional experience and background?",
      education: "Tell me about your education and academic achievements",
      skills: "What are your technical skills and expertise?",
      contact: "How can I contact you?"
    };

    setQuery(prompts[category]);
    handleSubmit({ preventDefault: () => {} });
  };

  const handleBackToSearch = () => {
    setShowSearchResults(false);
    setShowAnswer(false);
    setQuery('');
  };

  const handleLuckyClick = () => {
    const questions = [
      "What's your AI experience?",
      "Tell me about your education",
      "What are your skills?",
      "What's your robotics background?"
    ];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setQuery(randomQuestion);
  };

  return (
    <div className="search-container">
      <div className="mode-toggle">
        <label className="toggle-label">Dark Mode</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
      </div>
      {!showSearchResults ? (
        <>
          <div className="logo-section">
            <h1 className="theo-logo">Théo Pasquier</h1>
            <p className="subtitle">Studying Computer Science & Notion Consultant</p>
          </div>

          <div className="search-section">
            <form onSubmit={handleSubmit}>
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
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
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? "Thinking..." : "Ask Théo"}
                </button>
                <button 
                  type="button" 
                  className="search-button" 
                  onClick={handleLuckyClick}
                  disabled={isLoading}
                >
                  I'm Feeling Lucky
                </button>
              </div>
            </form>
          </div>

          <div className="quick-links">
            <div className="link-item" onClick={() => handleQuickLink('experience')}>
              <span className="link-icon">👨‍💻</span>
              <a href="#" onClick={(e) => e.preventDefault()}>Experience</a>
            </div>
            <div className="link-item" onClick={() => handleQuickLink('education')}>
              <span className="link-icon">🎓</span>
              <a href="#" onClick={(e) => e.preventDefault()}>Education</a>
            </div>
            <div className="link-item" onClick={() => handleQuickLink('skills')}>
              <span className="link-icon">🤖</span>
              <a href="#" onClick={(e) => e.preventDefault()}>Skills</a>
            </div>
            <div className="link-item" onClick={() => handleQuickLink('contact')}>
              <span className="link-icon">📫</span>
              <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
            </div>
          </div>
        </>
      ) : (
        <div className="search-results-page">
          <div className="search-results-header">
            <button className="back-button" onClick={handleBackToSearch}>
              ← Back to Search
            </button>
            <div className="search-summary">
              Found {searchResults.length} results for "{query}"
            </div>
          </div>
          <div className="search-results-list">
            {searchResults.map((result, index) => (
              <div key={index} className="result-card">
                <div className="result-category">{result.category}</div>
                <h3 className="result-title">{result.title}</h3>
                <p className="result-content" 
                   dangerouslySetInnerHTML={{ 
                     __html: result.content.replace(/\n/g, '<br/>') 
                   }} 
                />
                <div className="result-confidence">
                  Match confidence: {result.confidence}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 