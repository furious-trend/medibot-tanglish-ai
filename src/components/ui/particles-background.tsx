import { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, 20000);
    };

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 500);
    }

    // Continue creating particles
    const interval = setInterval(createParticle, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="particles-bg" />;
};

export default ParticlesBackground;