import React from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../../data/landingData.js';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="section-shell footer__grid">
        <div>
          <Link className="footer__brand" to="/">DriveHub</Link>
          <p>Premium rentals, clean handoffs, and confident trips in every city.</p>
        </div>
        <nav className="footer__links" aria-label="Footer navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </div>
      <div className="section-shell footer__bottom">
        <span>© 2026 DriveHub. All rights reserved.</span>
        <span>Designed for modern mobility.</span>
      </div>
    </footer>
  );
}

export default Footer;
