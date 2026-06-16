import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../../data/landingData.js';
import carLogo from '../../assets/images/car-logo3.png';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <Link className="navbar__brand" to="/" aria-label="DriveHub home">
        <img className="navbar__logo" src={carLogo} alt="" aria-hidden="true" />
        DriveHub
      </Link>

      <button
        className={`navbar__toggle ${isOpen ? 'navbar__toggle--open' : ''}`}
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`navbar__links ${isOpen ? 'navbar__links--open' : ''}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
            {link.label}
          </a>
        ))}
        <Link to="/login" onClick={() => setIsOpen(false)}>
          Login
        </Link>
        <Link className="navbar__cta" to="/register" onClick={() => setIsOpen(false)}>
          Register
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
