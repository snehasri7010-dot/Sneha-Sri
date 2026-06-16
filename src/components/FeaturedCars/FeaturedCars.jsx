import React from 'react';
import { cars } from '../../data/landingData.js';
import './FeaturedCars.css';

function FeaturedCars() {
  return (
    <section className="featured section-padding" id="cars">
      <div className="section-shell">
        <div className="featured__top">
          <div className="section-heading">
            <span className="eyebrow">Featured Cars</span>
            <h2>Popular picks ready for your next route.</h2>
          </div>
          <a className="btn btn--outline" href="#cta">View Availability</a>
        </div>

        <div className="featured__grid">
          {cars.map((car) => (
            <article className="car-card" key={car.name}>
              <img src={car.image} alt={car.name} />
              <div className="car-card__body">
                <div>
                  <span>{car.type}</span>
                  <h3>{car.name}</h3>
                </div>
                <strong>{car.price}</strong>
                <div className="car-card__specs">
                  {car.specs.map((spec) => (
                    <span key={spec}>{spec}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCars;
