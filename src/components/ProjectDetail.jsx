import { useEffect, useState, useRef } from 'react';
import ProjectPlanet from '../three/ProjectPlanet';

export default function ProjectDetail({ project, sourceRect, accentColor, closing, onClose, onFullyClosed }) {
  const [entered, setEntered] = useState(false);
  const [planetSettled, setPlanetSettled] = useState(false);
  const [closeDestRect, setCloseDestRect] = useState(null);
  const flyingRef = useRef();
  const closeBtnRef = useRef();

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
    const t = setTimeout(() => {
      setPlanetSettled(true);
      if (closeBtnRef.current) closeBtnRef.current.focus();
    }, 450); // matches planet-fly duration
    const escHandler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', escHandler);
    return () => { clearTimeout(t); window.removeEventListener('keydown', escHandler); };
  }, [onClose]);

  useEffect(() => {
    if (!closing) return;
    const cardEl = document.querySelector(`[data-project-id="${project.id}"] .card-planet`);
    const destRect = cardEl ? cardEl.getBoundingClientRect() : sourceRect;
    setCloseDestRect(destRect);
    setPlanetSettled(false);
    setEntered(false);
    const t = setTimeout(onFullyClosed, 450);
    return () => clearTimeout(t);
  }, [closing, project.id, sourceRect, onFullyClosed]);

  const destTop = 100;
  const destLeft = window.innerWidth / 2 - 40;
  const currentRect = (closing && closeDestRect) ? closeDestRect : sourceRect;

  const flyingStyle = currentRect ? {
    position: 'fixed',
    top: entered ? destTop : currentRect.top,
    left: entered ? destLeft : currentRect.left,
    width: entered ? 80 : currentRect.width,
    height: entered ? 80 : currentRect.height,
    transition: 'top 0.45s cubic-bezier(0.2,0.8,0.2,1), left 0.45s cubic-bezier(0.2,0.8,0.2,1), width 0.45s ease, height 0.45s ease, opacity 0.1s ease',
    zIndex: 60,
    pointerEvents: 'none',
    opacity: (planetSettled && !closing) ? 0 : 1,
  } : {};

  return (
    <>
      {currentRect && (
        <div ref={flyingRef} style={flyingStyle}>
          <ProjectPlanet category={project.category} color={accentColor} />
        </div>
      )}

      <div className={`project-detail ${entered ? 'entered' : ''}`} role="dialog" aria-modal="true">
        <button ref={closeBtnRef} onClick={onClose} aria-label="Close" className="close-btn" style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>

        <div className="detail-icon-slot">
          {planetSettled && !closing && <ProjectPlanet category={project.category} color={accentColor} />}
        </div>

        <div className={`detail-content ${planetSettled && !closing ? 'visible' : ''}`}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: accentColor }}>{project.title}</h2>
          <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem', opacity: 0.9 }}>{project.tagline}</p>
          <p className="detail-description" style={{ lineHeight: 1.7, marginBottom: '1.25rem' }}>{project.description}</p>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ opacity: 0.7, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Technologies</h4>
            <div className="card-tech" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
              {project.tech.map((t) => <span key={t} className="tech-chip">{t}</span>)}
            </div>
          </div>
          
          <div className="detail-links">
            {project.private && <span className="private-badge" style={{ margin: 0 }}>Private repo</span>}
            {project.github && (
              <a className="detail-github" href={project.github} target="_blank" rel="noreferrer" style={{ background: accentColor }}>View on GitHub ↗</a>
            )}
            {project.demo && (
              <a className="detail-github" href={project.demo} target="_blank" rel="noreferrer" style={{ background: accentColor }}>Open live demo ↗</a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
