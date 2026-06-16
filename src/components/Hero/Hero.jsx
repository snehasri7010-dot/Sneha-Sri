import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { stats } from '../../data/landingData.js';
import './Hero.css';

const ANIMATION_DURATION = 1200;

function parseStatValue(value) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return { target: null, suffix: '' };
  }

  return {
    target: Number(match[1]),
    suffix: match[2],
  };
}

function Hero() {
  const statsRef = useRef(null);
  const [visibleCycle, setVisibleCycle] = useState(0);
  const [animatedValues, setAnimatedValues] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const statsElement = statsRef.current;

    if (!statsElement) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCycle((cycle) => cycle + 1);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visibleCycle === 0) {
      return undefined;
    }

    let animationFrame;
    const startedAt = performance.now();
    const parsedStats = stats.map((item) => parseStatValue(item.value));

    setAnimatedValues(stats.map(() => 0));

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - startedAt) / ANIMATION_DURATION, 1);
      const easedProgress = 1 - (1 - progress) ** 3;

      setAnimatedValues(
        parsedStats.map(({ target }) => (target === null ? 0 : Math.round(target * easedProgress))),
      );

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [visibleCycle]);

  return (
    <section className="hero" id="home">
      <div className="hero__overlay" />
      <div className="hero__content section-shell">
        <div className="hero__copy">
          <span className="eyebrow">Premium car rentals on demand</span>
          <h1>Drive the perfect car for every destination.</h1>
          <p>
            Discover verified cars, transparent pricing, and flexible pickup options designed for
            modern city travel, business trips, and unforgettable escapes.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary" to="/login">Start Booking</Link>
            <a className="btn btn--ghost" href="#how-it-works">How It Works</a>
          </div>
        </div>

        <div className="hero__panel reveal-up--delay">
          <div>
            <span>Available today</span>
            <strong>Mercedes AMG GT</strong>
          </div>
          <div className="hero__panel-price">₹169/day</div>
        </div>

        <div className="hero__stats" aria-label="DriveHub statistics" ref={statsRef}>
          {stats.map((item, index) => {
            const { target, suffix } = parseStatValue(item.value);

            return (
              <div className="hero__stat" key={item.label}>
                <strong>{target === null ? item.value : `${animatedValues[index]}${suffix}`}</strong>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Hero;
