import { useRef } from 'react';
import { useInView } from '../hooks/useInView';
import skillsData from '../data/skills.json';
import SkillChip from './SkillChip';

export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <h2 style={{ marginBottom: '2rem' }}>Skills</h2>
      <div className="skills-groups">
        {Object.entries(skillsData).map(([category, items]) => (
          <SkillGroup key={category} category={category} items={items} />
        ))}
      </div>
    </section>
  );
}

function SkillGroup({ category, items }) {
  const ref = useRef();
  const visible = useInView(ref);
  return (
    <div ref={ref} className={`skill-group ${visible ? 'visible' : ''}`}>
      <h3 style={{ opacity: 0.9, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{category}</h3>
      <div className="chip-row">
        {items.map((item) => <SkillChip key={item} label={item} />)}
      </div>
    </div>
  );
}
