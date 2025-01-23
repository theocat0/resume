import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>My Resume</h1>
        <div>
          <h2>Theodore Pasquier</h2>
          <p>Web Developer</p>
        </div>
      </header>
      
      <main>
        <section className="about">
          <h2>About Me</h2>
          <p>A passionate web developer with experience in React, JavaScript, and modern web technologies.</p>
        </section>

        <section className="experience">
          <h2>Experience</h2>
          <div className="job">
            <h3>Senior Web Developer - Company Name</h3>
            <p className="date">2020 - Present</p>
            <ul>
              <li>Led development of multiple web applications</li>
              <li>Implemented responsive designs and modern UI features</li>
              <li>Mentored junior developers</li>
            </ul>
          </div>
        </section>

        <section className="skills">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill">React</div>
            <div className="skill">JavaScript</div>
            <div className="skill">HTML/CSS</div>
            <div className="skill">Node.js</div>
            <div className="skill">Git</div>
          </div>
        </section>

        <section className="contact">
          <h2>Contact</h2>
          <p>Email: your.email@example.com</p>
          <p>LinkedIn: linkedin.com/in/yourprofile</p>
          <p>GitHub: github.com/yourusername</p>
        </section>

        <section className="education">
          <h2>Education</h2>
          <p>Your School Name</p>
        </section>
      </main>
    </div>
  );
}

export default App; 