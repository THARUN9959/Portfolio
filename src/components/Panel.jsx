import { useScrollSpy } from '../hooks/useScrollSpy'

const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'connect', label: 'Connect' }
]

function NavItem({ id, label, active }) {
  const iconPaths = {
    intro: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    projects: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>,
    skills: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" /></>,
    connect: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>
  }

  return (
    <a className={`nav-item ${active ? 'active' : ''}`} href={`#${id}`} aria-label={label} aria-current={active ? 'location' : undefined}>
      <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{iconPaths[id]}</svg>
      <span className="nav-label">{label}</span>
    </a>
  )
}

export default function Panel() {
  const activeSection = useScrollSpy(sections.map(s => s.id));

  return (
    <aside className="panel" aria-label="Portfolio navigation">
      <div className="panel-top">
        <a href="#intro" className="panel-brand" aria-label="Tharun, Intro"><span className="brand-mark">T.</span><span className="brand-name">Tharun</span></a>
      </div>

      <nav className="panel-nav" aria-label="Sections">
        {sections.map(s => (
          <NavItem key={s.id} {...s} active={activeSection === s.id} />
        ))}
      </nav>
    </aside>
  )
}
