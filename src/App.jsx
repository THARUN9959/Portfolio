import { useState } from 'react'
import { useSessionTheme } from './hooks/useSessionTheme'
import Panel from './components/Panel'
import Hero from './components/Hero'
import ProjectGrid from './components/ProjectGrid'
import ProjectDetail from './components/ProjectDetail'
import Skills from './components/Skills'
import Connect from './components/Connect'
import CursorParticles from './three/CursorParticles'
import ScrollTicker from './components/ScrollTicker'
import projects from './data/projects.json'

function App() {
  const theme = useSessionTheme();
  const [selectedId, setSelectedId] = useState(null);
  const [transitionRect, setTransitionRect] = useState(null);
  const [closing, setClosing] = useState(false);

  const handleSelect = (id, cardEl) => {
    const rect = cardEl.querySelector('.card-planet').getBoundingClientRect();
    setTransitionRect(rect);
    setSelectedId(id);
    document.body.style.overflow = 'hidden';
  };

  const handleClose = () => setClosing(true);

  const handleFullyClosed = () => {
    setSelectedId(null);
    setTransitionRect(null);
    setClosing(false);
    document.body.style.overflow = '';
  };

  if (!theme) return null; // Wait for theme to initialize

  return (
    <>
      <CursorParticles color={theme.accent} glow={theme.glow} />
      <div className={`app-shell ${selectedId && !closing ? 'receded' : ''}`}>
        <Panel />
        <main className="content">
          <Hero theme={theme} />
          <ScrollTicker />
          <ProjectGrid onSelect={handleSelect} accentColor={theme.accent} />
          <Skills />
          <Connect />
        </main>
      </div>
      
      {selectedId && (
        <ProjectDetail
          project={projects.find(p => p.id === selectedId)}
          sourceRect={transitionRect}
          accentColor={theme.accent}
          closing={closing}
          onClose={handleClose}
          onFullyClosed={handleFullyClosed}
        />
      )}
    </>
  )
}

export default App
