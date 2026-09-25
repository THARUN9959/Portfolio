import { useEffect, useState } from 'react';
import HeroScene from '../three/HeroScene';

export default function Hero({ theme }) {
  const [accent, setAccent] = useState('#7C9EFF');

  useEffect(() => {
    if (theme) setAccent(theme.accent);
  }, [theme]);

  return (
    <section id="intro" className="hero-section">
      <div className="hero-canvas-wrap">
        <HeroScene accentColor={accent} />
      </div>
      <div className="hero-text">
        <span className="hero-eyebrow">Portfolio · 2026</span>
        <h1>Building ideas<span>into impact.</span></h1>
        <p>Hi, I’m Tharun — an ML and Android developer creating useful apps, intelligent tools, and security-focused projects.</p>
        <div className="hero-actions">
          <a href="#projects" className="hero-cta"><span>Explore my work</span><span aria-hidden="true">↘</span></a>
          <a href="#connect" className="hero-secondary">Let’s connect <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <a href="#projects" className="hero-scroll" aria-label="Scroll to selected projects">Scroll to explore</a>
    </section>
  );
}
