import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import * as THREE from 'three';

const LOGO_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 798 712">
  <path d="M446 4 L436 0 L352 0 L339 6 L331 15 L3 656 L0 666 L1 684 L7 696 L18 706 L32 711 L209 711 L320 709 L333 704 L343 697 L424 617 L424 615 L210 615 L202 613 L193 608 L182 596 L177 583 L178 566 L367 195 L375 186 L381 183 L389 182 L396 184 L406 193 L503 377 L510 387 L677 483 L681 483 L685 480 L686 474 L458 17 L454 11 Z"/>
  <path d="M365 370 L376 370 L386 374 L736 584 L746 594 L797 696 L797 700 L796 706 L789 711 L722 711 L712 708 L361 513 L354 507 L349 500 L345 488 L345 391 L349 381 L356 374 Z"/>
</svg>`;

function createLogoGeometry(): THREE.ExtrudeGeometry {
  const loader = new SVGLoader();
  const { paths } = loader.parse(LOGO_SVG);
  const shapes = paths.flatMap((path) => SVGLoader.createShapes(path));
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 80,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 5,
    bevelThickness: 5,
    curveSegments: 4,
    steps: 10,
  });

  geometry.translate(-399, -356, 0);
  geometry.scale(0.0052, -0.0052, 0.0052);
  geometry.computeVertexNormals();
  geometry.center();
  return geometry;
}

function LogoMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => createLogoGeometry(), []);
  const faceMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#fff',
        metalness: 1,
        roughness: 0.42,
        clearcoat: 0.52,
        clearcoatRoughness: 0.3,
        emissive: '#fff',
        emissiveIntensity: 0.08,
      }),
    []
  );
  const sideMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#fff',
        metalness: 1,
        roughness: 0.34,
        clearcoat: 0.58,
        clearcoatRoughness: 0.24,
        emissive: '#fff',
        emissiveIntensity: 0.26,
      }),
    []
  );

  return <mesh ref={meshRef} geometry={geometry} material={[faceMaterial, sideMaterial]} castShadow receiveShadow />;
}

function LogoModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    const rotation = time * 0.22;

    groupRef.current.rotation.y = rotation;
    groupRef.current.position.y += (Math.sin(time * 0.55) * 0.08 - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef} scale={0.7}>
      <pointLight position={[3.8, 1.8, 3.2]} color="#ff4e1d" intensity={18} distance={10} decay={2} />
      <pointLight position={[-3.4, -1.5, 2.2]} color="#9ec9ff" intensity={7} distance={10} decay={2} />
      <pointLight position={[0, 3.2, -3.4]} color="#fff1e5" intensity={11} distance={10} decay={2} />
      <LogoMesh />
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.8]}
      style={{ position: 'absolute', inset: 0, background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.12} />
        <directionalLight position={[3, 4, 4]} intensity={0.9} color="#fff8ef" />
        <directionalLight position={[-4, -2, 2]} intensity={0.7} color="#ff481a" />
        <LogoModel />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
