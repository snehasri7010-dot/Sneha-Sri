import React from 'react';
import { testimonials } from '../../data/landingData.js';
import './Testimonials.css';

function Testimonials() {
  return (
    <section className="testimonials section-padding" id="testimonials">
      <div className="section-shell">
        <div className="section-heading section-heading--center">
          <span className="eyebrow">Testimonials</span>
          <h2>Drivers choose DriveHub when the details matter.</h2>
        </div>
        <div className="testimonials__grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial" key={testimonial.name}>
              <p>"{testimonial.quote}"</p>
              <div>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
