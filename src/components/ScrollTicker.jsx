import { useEffect, useState } from 'react';

const messages = ['Machine learning', 'Android', 'Application security', 'Useful software', 'Open source'];

export default function ScrollTicker() {
  const [direction, setDirection] = useState('normal');

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const nextY = window.scrollY;
        if (Math.abs(nextY - previousY) > 2) setDirection(nextY > previousY ? 'normal' : 'reverse');
        previousY = nextY;
        frame = 0;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scroll-ticker" aria-hidden="true">
      <div className="scroll-ticker-track" style={{ animationDirection: direction }}>
        {[0, 1].map(copy => (
          <span className="scroll-ticker-group" key={copy}>
            {messages.map(message => <span className="scroll-ticker-item" key={message}>{message}<i>✳</i></span>)}
          </span>
        ))}
      </div>
    </div>
  );
}
