import { useRef } from 'react';

const categoryMarks = { all: '✳', security: '⌘', web: '◇', android: '▣' };

function titleCase(value) {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase());
}

export default function MagnifiedProjectDock({ categories, projects, activeCategory, onSelect }) {
  const dockRef = useRef(null);
  const items = [
    { id: 'all', label: 'All projects', count: projects.length },
    ...categories.map(category => ({
      id: category,
      label: titleCase(category),
      count: projects.filter(project => project.category === category).length,
    })),
  ];

  const magnify = (event) => {
    const buttons = dockRef.current?.querySelectorAll('[data-dock-item]');
    buttons?.forEach(button => {
      const rect = button.getBoundingClientRect();
      const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
      const influence = Math.max(0, 1 - distance / 150);
      button.style.setProperty('--dock-scale', (1 + influence * 0.16).toFixed(3));
      button.style.setProperty('--dock-lift', `${influence * 3}px`);
    });
  };

  const resetMagnification = () => dockRef.current?.querySelectorAll('[data-dock-item]').forEach(button => {
    button.style.setProperty('--dock-scale', '1');
    button.style.setProperty('--dock-lift', '0px');
  });

  return (
    <div className="project-dock-wrap">
      <div className="project-dock" ref={dockRef} role="group" aria-label="Filter projects" onPointerMove={magnify} onPointerLeave={resetMagnification}>
        {items.map(item => (
          <button
            key={item.id}
            data-dock-item
            type="button"
            className={`dock-item ${activeCategory === item.id ? 'active' : ''}`}
            aria-label={`${item.label}, ${item.count} ${item.count === 1 ? 'project' : 'projects'}`}
            aria-pressed={activeCategory === item.id}
            onClick={() => onSelect(item.id)}
          >
            <span className="dock-icon" aria-hidden="true">{categoryMarks[item.id] || item.label.slice(0, 2).toUpperCase()}</span>
            <span className="dock-name">{item.label}</span>
            <span className="dock-count">{item.count}</span>
          </button>
        ))}
      </div>
      <span className="dock-hint">Hover to magnify · Select a field</span>
    </div>
  );
}
