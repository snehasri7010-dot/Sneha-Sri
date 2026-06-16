import React from 'react';
import { steps } from '../../data/landingData.js';
import './HowItWorks.css';

function HowItWorks() {
  return (
    <section className="how section-padding" id="how-it-works">
      <div className="section-shell how__grid">
        <div className="section-heading">
          <span className="eyebrow">How It Works</span>
          <h2>From search to steering wheel in three simple steps.</h2>
        </div>
        <div className="how__steps">
          {steps.map((step, index) => (
            <article className="step" key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
