import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';

function FloatingShape({ color }) {
  const mesh = useRef();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      pointer.current = {
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.2;
    mesh.current.rotation.x += (pointer.current.y * 0.3 - mesh.current.rotation.x) * 0.05;
    mesh.current.rotation.z += (pointer.current.x * 0.3 - mesh.current.rotation.z) * 0.05;
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.4, 0]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  );
}

export default function HeroScene({ accentColor }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 700 || window.matchMedia('(pointer: coarse)').matches;
  const dpr = isSmall ? 1 : Math.min(window.devicePixelRatio, 2);

  return (
    <Canvas camera={{ position: [0, 0, 4] }} dpr={dpr} style={{ pointerEvents: 'none' }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} />
      {!reduceMotion ? (
        <FloatingShape color={accentColor} />
      ) : (
        <mesh rotation={[0.4, 0.6, 0]}>
          <icosahedronGeometry args={[1.4, 0]} />
          <meshStandardMaterial color={accentColor} wireframe />
        </mesh>
      )}
    </Canvas>
  );
}
