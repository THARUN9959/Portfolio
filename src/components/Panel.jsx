import { useScrollSpy } from '../hooks/useScrollSpy'

const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'connect', label: 'Connect' }
]

function NavItem({ id, label, active }) {
  const scrollTo = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div 
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={() => scrollTo(id)}
      style={{
        cursor: 'pointer',
        padding: '0.5rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        opacity: active ? 1 : 0.5,
        transition: 'all 0.3s ease'
      }}
    >
      <span style={{
        width: active ? '30px' : '15px',
        height: '2px',
        background: active ? 'var(--text)' : 'currentColor',
        transition: 'width 0.3s ease'
      }}></span>
      <span style={{
        fontWeight: active ? '700' : '400',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontSize: '0.85rem'
      }}>{label}</span>
    </div>
  )
}

export default function Panel() {
  const activeSection = useScrollSpy(sections.map(s => s.id));

  return (
    <aside className="panel">
      <div className="panel-top">
        <h1>Tharun</h1>
        <p className="role">ML & Android Developer</p>
        <p style={{ maxWidth: '300px', opacity: 0.7, fontSize: '0.95rem', lineHeight: 1.5 }}>
          I build intelligent applications, from security scanners to health monitors and AI-powered tools.
        </p>
      </div>

      <nav className="panel-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '3rem 0' }}>
        {sections.map(s => (
          <NavItem key={s.id} {...s} active={activeSection === s.id} />
        ))}
      </nav>

      <div className="panel-social">
        <a href="https://github.com/THARUN9959" target="_blank" rel="noreferrer">
          GitHub
        </a>
        {/* Email and others can go here */}
      </div>
    </aside>
  )
}
