import React from 'react';
import { services } from '../../data/landingData.js';
import './Services.css';

function Services() {
  return (
    <section className="services section-padding" id="services">
      <div className="section-shell">
        <div className="section-heading section-heading--center">
          <span className="eyebrow">Services</span>
          <h2>Flexible mobility for every kind of trip.</h2>
        </div>
        <div className="services__grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-card__icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
