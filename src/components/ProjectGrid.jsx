import { useMemo, useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import projectsData from '../data/projects.json';
import { useInView } from '../hooks/useInView';
import MagnifiedProjectDock from './MagnifiedProjectDock';

export default function ProjectGrid({ onSelect, accentColor }) {
  const sectionRef = useRef();
  const visible = useInView(sectionRef);
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = useMemo(() => [...new Set(projectsData.map(project => project.category).filter(Boolean))], []);
  const filteredProjects = activeCategory === 'all'
    ? projectsData
    : projectsData.filter(project => project.category === activeCategory);

  return (
    <section ref={sectionRef} id="projects" className={`projects-section page-reveal ${visible ? 'visible' : ''}`}>
      <div className="section-kicker">A few things I’ve made</div>
      <h2 className="section-heading">Selected projects<span aria-hidden="true">.</span></h2>
      <p className="projects-intro">A mix of experiments and products across AI, application development, and security. Pick a field to explore.</p>
      <MagnifiedProjectDock categories={categories} projects={projectsData} activeCategory={activeCategory} onSelect={setActiveCategory} />
      <div className="project-count" aria-live="polite">Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}</div>
      {filteredProjects.length ? <div className="project-grid" aria-label="Projects">
        {filteredProjects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onClick={onSelect}
            accentColor={accentColor}
          />
        ))}
      </div> : <p className="empty-projects">No projects in this category yet.</p>}
    </section>
  );
}
