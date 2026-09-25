import ProjectCard from './ProjectCard';
import projectsData from '../data/projects.json';

export default function ProjectGrid({ onSelect, accentColor }) {
  return (
    <section id="projects" className="projects-section" style={{ minHeight: '100vh', padding: '4rem 0' }}>
      <h2 style={{ marginBottom: '2rem' }}>Selected Projects</h2>
      <div className="project-grid">
        {projectsData.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onClick={onSelect}
            accentColor={accentColor}
          />
        ))}
      </div>
    </section>
  );
}
