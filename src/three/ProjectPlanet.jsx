import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

const SHAPES = {
  security: (color) => (
    <mesh>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  ),
  web: (color) => (
    <mesh>
      <torusGeometry args={[0.7, 0.28, 8, 24]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  ),
  android: (color) => (
    <mesh>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  ),
};

function Spinner({ category, color, paused }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (paused || !ref.current) return;
    ref.current.rotation.y += delta * 0.6;
    ref.current.rotation.x += delta * 0.3;
  });
  const shape = SHAPES[category] || SHAPES.web;
  return <group ref={ref}>{shape(color)}</group>;
}

export default function ProjectPlanet({ category, color }) {
  const wrapRef = useRef();
  const [inView, setInView] = useState(false);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  if (isTouch) {
    // static SVG-style fallback: no WebGL cost on touch devices
    return (
      <div ref={wrapRef} className="planet-fallback" style={{ borderColor: color }}>
        <span style={{ background: color }} />
      </div>
    );
  }

  // Use frameloop="demand" along with the paused check to drastically cut CPU usage when offscreen.
  // Actually, standard useFrame hooks don't easily trigger re-renders in demand mode without manual invalidate(). 
  // Sticking to frameloop="always" but skipping the mesh rotation when paused is standard and highly performant.
  return (
    <div ref={wrapRef} className="planet-canvas-wrap">
      <Canvas camera={{ position: [0, 0, 3] }} dpr={1} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 3]} />
        <Spinner category={category} color={color} paused={!inView || reduceMotion} />
      </Canvas>
    </div>
  );
}
