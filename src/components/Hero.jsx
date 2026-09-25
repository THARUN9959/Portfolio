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
        <h1>Hi, I'm Tharun.</h1>
        <p>ML & Android developer building security tools, AI apps, and Android apps.</p>
        <a href="#projects" className="hero-cta">View projects ↓</a>
      </div>
    </section>
  );
}
