import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1>Théo Pasquier</h1>
        <p>Computer Science Student | Campus Leader @ Notion</p>
      </header>
      
      <main>
        <section className="about">
          <h2>About Me</h2>
          <p>I'm a student at the University of New England, pursuing a Bachelor in Computer Science with a minor in Business. 
          I have hands-on experience working in the lab with the Robotics Team, where I assisted in developing and testing automated systems.
          Additionally, I have experience beta testing ChatGPT, specifically the .3 model, and was part of the red team for the initial iterations of the 4 model and 4 Turbo.
          I combine technical expertise with analytical skills to drive innovative solutions in both academic and professional environments.</p>
        </section>

        <section className="experience">
          <h2>Experience</h2>
          <div className="job">
            <h3>Campus Leader - Notion</h3>
            <p className="date">October 2023 - Present</p>
            <ul>
              <li>Collaborate with university departments to implement Notion as a central hub for project management</li>
              <li>Lead workshops and one-on-one sessions to enhance productivity across campus</li>
            </ul>
          </div>
          <div className="job">
            <h3>Library Assistant - University of New England</h3>
            <p className="date">July 2023 - January 2024</p>
            <ul>
              <li>Supported library operations at Jack S. Ketchum Library</li>
              <li>Assisted patrons with technology questions and managed study room facilities</li>
              <li>Maintained organization of library resources and materials</li>
            </ul>
          </div>
        </section>

        <section className="education">
          <h2>Education</h2>
          <div className="education-item">
            <h3>University of New England</h3>
            <p className="date">August 2022 - April 2026 (Expected)</p>
            <p>Bachelor in Computer Science</p>
            <p>Minor in Business</p>
          </div>
        </section>

        <section className="skills">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill">Robotics</div>
            <div className="skill">AI/ML Beta Testing</div>
            <div className="skill">Red Team Operations</div>
            <div className="skill">Automation</div>
            <div className="skill">Data Analysis</div>
          </div>
        </section>

        <section className="contact">
          <h2>Contact</h2>
          <p>Location: Biddeford, Maine, United States</p>
          <p>LinkedIn: linkedin.com/in/théo-pasquier-aa2993194</p>
        </section>
      </main>
    </div>
  );
}

export default App; 