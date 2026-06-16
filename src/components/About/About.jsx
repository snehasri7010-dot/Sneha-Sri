import React from 'react';
import './About.css';

function About() {
  return (
    <section className="about section-padding" id="about">
      <div className="section-shell about__grid">
        <div className="section-heading">
          <span className="eyebrow">About DriveHub</span>
          <h2>Built for drivers who want choice without friction.</h2>
        </div>
        <div className="about__content">
          <p>
            DriveHub connects renters with a carefully maintained fleet of everyday, premium, and
            electric vehicles. Every booking is designed around speed, trust, and clear details.
          </p>
          <div className="about__features">
            <span>Verified owners</span>
            <span>24/7 trip support</span>
            <span>No hidden fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
