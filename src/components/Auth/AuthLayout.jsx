import React from 'react';
import { Link } from 'react-router-dom';
import carLogo from '../../assets/images/car-logo3.png';
import './Auth.css';

function AuthLayout({ eyebrow, title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <main className="auth-page">
      <div className="auth-page__visual" aria-hidden="true">
        <div className="auth-page__car-card">
          <span className="auth-page__status">Verified fleet</span>
          <strong>Book premium cars in minutes.</strong>
          <p>Flexible plans, clean handoffs, and trusted rentals for every trip.</p>
        </div>
      </div>

      <section className="auth-shell" aria-label={title}>
        <Link className="auth-brand" to="/" aria-label="DriveHub home">
          <img src={carLogo} alt="" aria-hidden="true" />
          <span>DriveHub</span>
        </Link>

        <div className="auth-card">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
          <div className="auth-card__footer">
            {footerText}{' '}
            <Link to={footerLinkTo}>{footerLinkText}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
