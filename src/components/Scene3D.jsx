import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { ELEMENTS } from "../data.js";

/* A four-point throwing star built from an extruded 2D shape. */
function useShurikenGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    const points = 4;
    const outer = 1.55;
    const inner = 0.42;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.2, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 4,
      curveSegments: 24,
    });
    geo.center();
    return geo;
  }, []);
}

function Shuriken({ color }) {
  const group = useRef();
  const geo = useShurikenGeometry();
  const speed = useRef(0.6);
  const [hovered, setHovered] = useState(false);

  useFrame((state, dt) => {
    const target = hovered ? 3 : 0.6;
    speed.current = THREE.MathUtils.lerp(speed.current, Math.max(target, speed.current * 0.985), 0.06);
    group.current.rotation.z -= speed.current * dt;
    // Parallax toward the pointer
    const { x, y } = state.pointer;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.5, 0.06);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.6, 0.06);
  });

  return (
    <group
      ref={group}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={() => (speed.current = 22)}
    >
      <mesh geometry={geo}>
        <meshStandardMaterial color="#f5c04a" metalness={0.9} roughness={0.25} emissive="#6b4a0c" emissiveIntensity={0.35} />
      </mesh>
      {/* Element-coloured inner ring */}
      <mesh position={[0, 0, 0.14]}>
        <torusGeometry args={[0.32, 0.05, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.14]}>
        <torusGeometry args={[0.32, 0.05, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* Glowing orbs, one per element, orbiting on tilted rings. */
function Orb({ color, radius, speed, tilt, offset }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });
  return (
    <group rotation={[Math.PI / 2 + tilt, tilt * 0.6, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 8, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial color={color} toneMapped={false} />
        <pointLight color={color} intensity={3} distance={2.5} />
      </mesh>
    </group>
  );
}

/* A spinning tornado of particles in the active element colour. */
function Vortex({ color }) {
  const ref = useRef();
  const count = typeof window !== "undefined" && window.innerWidth < 760 ? 450 : 900;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h = Math.random();
      const r = 0.6 + h * 2.6 + Math.random() * 0.25;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = h * 5 - 2.6;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.5;
  });
  return (
    <points ref={ref} position={[0, -0.2, -1.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.028} color={color} transparent opacity={0.75} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function Scene3D({ element }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      resize={{ offsetSize: true }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 3, 4]} intensity={40} color={element.glow} />
      <pointLight position={[-4, -2, 2]} intensity={25} color={element.color} />

      <Environment resolution={128}>
        <Lightformer intensity={6} position={[0, 4, 3]} scale={[8, 2, 1]} color="#ffffff" />
        <Lightformer intensity={2} position={[-5, 0, 2]} scale={[2, 6, 1]} color={element.color} />
        <Lightformer intensity={4} position={[5, -1, 2]} scale={[2, 6, 1]} color="#ffcf6b" />
        <Lightformer intensity={3} position={[0, 0, 6]} scale={[6, 6, 1]} color="#fff3d6" />
      </Environment>

      <Float speed={2} rotationIntensity={0.25} floatIntensity={0.8}>
        <Shuriken color={element.color} />
      </Float>

      {ELEMENTS.map((e, i) => (
        <Orb key={e.key} color={e.color} radius={2.1 + (i % 2) * 0.35} speed={0.55 + i * 0.08} tilt={0.5 - i * 0.25} offset={i * 1.3} />
      ))}

      <Vortex color={element.color} />
      <Sparkles count={60} scale={[7, 5, 3]} size={2.5} speed={0.4} color={element.glow} />
    </Canvas>
  );
}
