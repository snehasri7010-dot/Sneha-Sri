import React from 'react';
import { Link } from 'react-router-dom';
import './CTA.css';

function CTA() {
  return (
    <section className="cta section-padding" id="cta">
      <div className="section-shell cta__content">
        <span className="eyebrow">Ready when you are</span>
        <h2>Find a car that matches your plans today.</h2>
        <p>
          Premium, electric, family-sized, or business-ready. DriveHub keeps your next ride close.
        </p>
        <Link className="btn btn--primary" to="/register">Create Your Account</Link>
      </div>
    </section>
  );
}

export default CTA;
