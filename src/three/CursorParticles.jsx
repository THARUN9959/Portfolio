import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, Color, Vector2 } from 'three';

const TRAIL_COUNT = 15;
const NODES_PER_TRAIL = 28;
const SEGMENT_COUNT = TRAIL_COUNT * (NODES_PER_TRAIL - 1);

const fluidVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluidFragmentShader = `
  uniform float uTime;
  uniform float uActivity;
  uniform float uAspect;
  uniform vec2 uVelocity;
  uniform vec3 uAccent;
  uniform vec3 uGlow;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv - vec2(0.5);
    p.x *= uAspect;
    float radius = length(p);
    float angle = atan(p.y, p.x);
    float speed = clamp(length(uVelocity) * 1.8, 0.0, 1.0);

    float warp = sin(angle * 3.0 - uTime * 1.1 + radius * 30.0) * 0.025;
    warp += sin(angle * 7.0 + radius * 52.0 - uTime * 1.8) * 0.009;
    float fluidRadius = radius + warp;
    float core = exp(-fluidRadius * 10.5);
    float wake = exp(-length(p + normalize(uVelocity + vec2(0.001)) * 0.09) * 8.0) * speed;
    float ripples = pow(0.5 + 0.5 * sin(fluidRadius * 82.0 - uTime * 3.4 + sin(angle * 4.0 + uTime) * 1.8), 7.0) * exp(-radius * 8.0);
    float alpha = (core * 0.3 + wake * 0.18 + ripples * 0.34) * uActivity;
    float colorMix = clamp(0.5 + 0.5 * sin(angle * 2.0 - uTime * 1.6 + fluidRadius * 20.0 + speed), 0.0, 1.0);
    vec3 fluidColor = mix(uAccent, uGlow, colorMix * 0.72);

    gl_FragColor = vec4(fluidColor, alpha);
  }
`;

function createTrails() {
  return Array.from({ length: TRAIL_COUNT }, (_, trailIndex) => ({
    spring: 0.22 + trailIndex * 0.004,
    friction: 0.49 + Math.random() * 0.025,
    nodes: Array.from({ length: NODES_PER_TRAIL }, () => ({ x: 0, y: 0, vx: 0, vy: 0 })),
  }));
}

function FluidField({ color, glow }) {
  const meshRef = useRef();
  const pointer = useRef({ x: 0, y: 0, previousX: 0, previousY: 0, velocityX: 0, velocityY: 0, lastTime: 0 });
  const velocityTarget = useMemo(() => new Vector2(), []);
  const { size, viewport, invalidate } = useThree();
  const fieldSize = Math.min(viewport.width, viewport.height) * 0.92;
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uActivity: { value: 0 },
    uAspect: { value: 1 },
    uVelocity: { value: new Vector2() },
    uAccent: { value: new Color(color) },
    uGlow: { value: new Color(glow) },
  }), [color, glow]);

  useEffect(() => {
    const handleMove = (event) => {
      const now = performance.now();
      const x = (event.clientX / size.width - 0.5) * viewport.width;
      const y = (0.5 - event.clientY / size.height) * viewport.height;
      const previous = pointer.current;
      const elapsed = Math.max(16, now - previous.lastTime);
      previous.velocityX = previous.lastTime ? Math.max(-1, Math.min(1, (x - previous.previousX) / fieldSize * 16 / elapsed)) : 0;
      previous.velocityY = previous.lastTime ? Math.max(-1, Math.min(1, (y - previous.previousY) / fieldSize * 16 / elapsed)) : 0;
      previous.previousX = x;
      previous.previousY = y;
      previous.x = x;
      previous.y = y;
      previous.lastTime = now;
      invalidate();
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [fieldSize, invalidate, size.height, size.width, viewport.height, viewport.width]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.04);
    const follow = 1 - Math.exp(-9 * dt);
    meshRef.current.position.x += (pointer.current.x - meshRef.current.position.x) * follow;
    meshRef.current.position.y += (pointer.current.y - meshRef.current.position.y) * follow;

    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uAspect.value = 1;
    uniforms.uVelocity.value.lerp(velocityTarget.set(pointer.current.velocityX, pointer.current.velocityY), follow);
    pointer.current.velocityX *= Math.exp(-4 * dt);
    pointer.current.velocityY *= Math.exp(-4 * dt);
    const pointerActive = performance.now() - pointer.current.lastTime < 100 ? 1 : 0;
    uniforms.uActivity.value += (pointerActive - uniforms.uActivity.value) * (1 - Math.exp(-2.1 * dt));

    if (uniforms.uActivity.value > 0.008 || Math.hypot(uniforms.uVelocity.value.x, uniforms.uVelocity.value.y) > 0.006) invalidate();
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      <planeGeometry args={[fieldSize, fieldSize]} />
      <shaderMaterial
        vertexShader={fluidVertexShader}
        fragmentShader={fluidFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function CursorTrails({ color }) {
  const lineRef = useRef();
  const trails = useRef(createTrails());
  const pointer = useRef({ x: 0, y: 0, initialized: false, lastMove: 0 });
  const positions = useMemo(() => new Float32Array(SEGMENT_COUNT * 2 * 3).fill(100000), []);
  const colors = useMemo(() => new Float32Array(SEGMENT_COUNT * 2 * 3), []);
  const accent = useMemo(() => new Color(color), [color]);
  const { size, viewport, invalidate } = useThree();

  useEffect(() => {
    const handleMove = (event) => {
      const x = (event.clientX / size.width - 0.5) * viewport.width;
      const y = (0.5 - event.clientY / size.height) * viewport.height;
      pointer.current.x = x;
      pointer.current.y = y;
      pointer.current.lastMove = performance.now();

      if (!pointer.current.initialized) {
        trails.current.forEach(({ nodes }) => nodes.forEach((node) => { node.x = x; node.y = y; }));
        pointer.current.initialized = true;
      }
      invalidate();
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, [invalidate, size.height, size.width, viewport.height, viewport.width]);

  useFrame((_, delta) => {
    if (!lineRef.current || !pointer.current.initialized) return;

    let vertex = 0;
    let maxDistance = 0;
    let maxSpeed = 0;
    trails.current.forEach(({ nodes, spring, friction }, trailIndex) => {
      let tension = spring;
      nodes.forEach((node, nodeIndex) => {
        if (nodeIndex === 0) {
          node.vx += (pointer.current.x - node.x) * tension;
          node.vy += (pointer.current.y - node.y) * tension;
        } else {
          const previous = nodes[nodeIndex - 1];
          node.vx += (previous.x - node.x) * tension + previous.vx * 0.22;
          node.vy += (previous.y - node.y) * tension + previous.vy * 0.22;
        }
        node.vx *= friction;
        node.vy *= friction;
        node.x += node.vx;
        node.y += node.vy;
        maxDistance = Math.max(maxDistance, Math.hypot(pointer.current.x - node.x, pointer.current.y - node.y));
        maxSpeed = Math.max(maxSpeed, Math.hypot(node.vx, node.vy));
        tension *= 0.985;

        if (nodeIndex === NODES_PER_TRAIL - 1) return;
        const next = nodes[nodeIndex + 1];
        const shade = 1 - (nodeIndex / NODES_PER_TRAIL) * 0.72;
        for (const point of [node, next]) {
          positions[vertex] = point.x;
          positions[vertex + 1] = point.y;
          positions[vertex + 2] = 0;
          colors[vertex] = accent.r * shade;
          colors[vertex + 1] = accent.g * shade;
          colors[vertex + 2] = accent.b * shade;
          vertex += 3;
        }
      });
      // Tiny per-trail offsets keep neighboring strands distinct without changing the theme color.
      const strandShade = 0.82 + (trailIndex / TRAIL_COUNT) * 0.18;
      const start = trailIndex * (NODES_PER_TRAIL - 1) * 2 * 3;
      const end = start + (NODES_PER_TRAIL - 1) * 2 * 3;
      for (let colorIndex = start; colorIndex < end; colorIndex += 3) {
        colors[colorIndex] *= strandShade;
        colors[colorIndex + 1] *= strandShade;
        colors[colorIndex + 2] *= strandShade;
      }
    });

    const geometry = lineRef.current.geometry;
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    const idleFor = performance.now() - pointer.current.lastMove;
    const fade = Math.max(0, 1 - Math.max(0, idleFor - 100) / 520);
    lineRef.current.material.opacity = 0.22 * fade;
    if (fade === 0 || (idleFor > 100 && maxDistance < 0.8 && maxSpeed < 0.12)) {
      positions.fill(100000);
      geometry.attributes.position.needsUpdate = true;
      return;
    }
    invalidate();
  });

  return (
    <lineSegments ref={lineRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.22} depthWrite={false} blending={AdditiveBlending} />
    </lineSegments>
  );
}

export default function CursorParticles({ color, glow }) {
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  return (
    <Canvas className="cursor-particles-canvas" style={{ pointerEvents: 'none' }} frameloop="demand" orthographic camera={{ position: [0, 0, 20], zoom: 1 }} dpr={1} gl={{ alpha: true, antialias: false }}>
      <FluidField color={color} glow={glow} />
      <CursorTrails color={color} />
    </Canvas>
  );
}
