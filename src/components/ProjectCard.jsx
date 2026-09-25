import { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { useTilt } from '../hooks/useTilt';
import ProjectPlanet from '../three/ProjectPlanet';

export default function ProjectCard({ project, index, onClick, accentColor }) {
  const ref = useRef();
  const visible = useInView(ref);
  useTilt(ref);

  return (
    <div
      ref={ref}
      data-project-id={project.id}
      className={`project-card ${visible ? 'visible' : ''} ${project.private ? 'is-private' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={(e) => onClick(project.id, e.currentTarget)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === 'Enter' && onClick(project.id, e.currentTarget)}
    >
      {project.private && <span className="private-badge">Private repo</span>}
      <div className="card-planet">
        <ProjectPlanet category={project.category} color={accentColor} />
      </div>
      <h3 className="card-title">{project.title}</h3>
      <p className="card-tagline">{project.tagline}</p>
      <div className="card-tech">
        {project.tech.map((t) => (
          <span key={t} className="tech-chip">{t}</span>
        ))}
      </div>
    </div>
  );
}
