import { useRef } from 'react';
import { useInView } from '../hooks/useInView';

export default function Connect() {
  const sectionRef = useRef();
  const visible = useInView(sectionRef);

  return (
    <section ref={sectionRef} id="connect" className={`connect-section page-reveal ${visible ? 'visible' : ''}`}>
      <div className="connect-callout">
        <div className="connect-glow" />
        <div className="connect-message">
          <div className="section-kicker">Have something in mind?</div>
          <h2 className="section-heading">Let’s build something<span aria-hidden="true">.</span></h2>
          <p className="connect-copy">Open to opportunities in ML, Android, and security-focused projects. Get in touch through my GitHub profile.</p>
        </div>
        <div className="connect-action">
          <span className="connect-action-label">OPEN TO COLLABORATION</span>
          <a href="https://github.com/THARUN9959" target="_blank" rel="noreferrer" className="connect-btn primary">
            <span>Find me on GitHub</span><span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Tharun</span><span>Designed & built with curiosity</span></footer>
    </section>
  );
}
