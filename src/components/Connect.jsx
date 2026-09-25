export default function Connect() {
  return (
    <section id="connect" className="connect-section">
      <div className="connect-glow" />
      <h2 style={{ marginBottom: '1rem' }}>Let's connect</h2>
      <p style={{ opacity: 0.8, maxWidth: '400px', marginBottom: '2rem' }}>
        Open to opportunities in ML, Android, and security-focused projects.
      </p>
      <div className="connect-links">
        <a href="https://github.com/THARUN9959" target="_blank" rel="noreferrer" className="connect-btn">
          GitHub
        </a>
        <a href="mailto:tharun.test@example.com" className="connect-btn">
          Email
        </a>
        <a href="/resume.pdf" download className="connect-btn">
          Resume
        </a>
      </div>
    </section>
  );
}
