import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

const FRAGMENTS = [
  { pos: [-0.3, -1.0, 0.1] as [number, number, number], rot: [0.1, 0.3, 0.4] as [number, number, number], scale: [2.4, 0.14, 0.14] as [number, number, number], emissive: 0.0 },
  { pos: [-1.1, 0.2, -0.2] as [number, number, number], rot: [0.05, 0.1, 1.1] as [number, number, number], scale: [2.0, 0.14, 0.14] as [number, number, number], emissive: 0.0 },
  { pos: [0.9, 0.4, 0.0] as [number, number, number], rot: [-0.05, 0.15, -1.0] as [number, number, number], scale: [2.2, 0.14, 0.14] as [number, number, number], emissive: 0.02 },
  { pos: [0.0, 1.1, -0.3] as [number, number, number], rot: [0.2, 0.8, 0.35] as [number, number, number], scale: [1.6, 0.12, 0.12] as [number, number, number], emissive: 0.08 },
  { pos: [1.5, -0.3, 0.6] as [number, number, number], rot: [0.9, 0.3, 0.4] as [number, number, number], scale: [1.4, 0.11, 0.11] as [number, number, number], emissive: 0.12 },
  { pos: [-0.6, 0.7, 0.4] as [number, number, number], rot: [0.6, 1.2, -0.2] as [number, number, number], scale: [1.2, 0.1, 0.1] as [number, number, number], emissive: 0.04 },
  { pos: [0.3, -0.6, -0.5] as [number, number, number], rot: [0.3, 0.5, 1.8] as [number, number, number], scale: [1.8, 0.13, 0.13] as [number, number, number], emissive: 0.0 },
  { pos: [-1.4, 0.0, 0.8] as [number, number, number], rot: [1.2, 0.4, 0.6] as [number, number, number], scale: [1.0, 0.1, 0.1] as [number, number, number], emissive: 0.06 },
  { pos: [1.2, -0.5, -0.2] as [number, number, number], rot: [0.4, 0.2, -0.8] as [number, number, number], scale: [0.9, 0.1, 0.1] as [number, number, number], emissive: 0.0 },
  { pos: [-0.8, -0.4, 5.3] as [number, number, number], rot: [0.7, 0.9, 1.4] as [number, number, number], scale: [0.8, 0.09, 0.09] as [number, number, number], emissive: 0.02 },
];

const mat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#080808'),
  metalness: 0.98,
  roughness: 0.18,
  envMapIntensity: 0.9,
});
const matGlow = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#080808'),
  metalness: 0.98,
  roughness: 0.15,
  emissive: new THREE.Color('#7a3010'),
  emissiveIntensity: 1.0,
  envMapIntensity: 1.2,
});

function FragmentCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.07;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    groupRef.current.rotation.x += (pointer.y * 0.14 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.rotation.z += (-pointer.x * 0.08 - groupRef.current.rotation.z) * 0.04;
  });

  return (
    <group ref={groupRef}>
      {FRAGMENTS.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} scale={f.scale} material={f.emissive > 0.05 ? matGlow : mat}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.8]} style={{ position: 'absolute', inset: 0 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 4, 3]} intensity={0.8} />
        <pointLight position={[-3, -2, 2]} intensity={15} color="#ff6020" />
        <pointLight position={[2, 3, -2]} intensity={6} color="#ffffff" />
        <FragmentCluster />
        <Environment preset="night" />
        <fog attach="fog" args={['#020202', 7, 14]} />
      </Suspense>
    </Canvas>
  );
}
