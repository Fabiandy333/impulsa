import React, { useState } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Propósito',
      type: 'text',
      content: `Nuestro objetivo es ofrecer una plataforma segura y transparente donde emprendedores y creadores puedan recaudar fondos para sus proyectos innovadores. A través de modelos flexibles de financiamiento, herramientas de comunicación y un sistema de pagos confiable, facilitamos la conexión entre quienes tienen ideas brillantes y quienes desean apoyarlas. Impulsa democratiza el acceso al financiamiento, haciendo posible que cada proyecto, grande o pequeño, encuentre su audiencia y alcance sus metas.`,
    },
    {
      title: 'Equipo Desarrollo',
      type: 'avatars',
      content: [
        'Fabian Andres Camayo Pesas',
        'Samuel Alexis Lozano Zambrano',
      ],
    },
  ];

  return (
    <div className="about-us">
      <div className="slide-container">
        <div key={currentSlide} className="slide fade-in">
          <h1>{slides[currentSlide].title}</h1>
          {slides[currentSlide].type === 'text' ? (
            <p style={{ whiteSpace: 'pre-line' }}>{slides[currentSlide].content}</p>
          ) : (
            <div className="avatar-grid">
              {slides[currentSlide].content.map((name, index) => (
                <div key={index} className="avatar-card">
                  <img src="/avatar.png" alt={name} className="avatar-image" />
                  <p className="avatar-name">{name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
