"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { Sphere, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

// --- Creative Shader Definition (Corrected & Complete) ---
const CreativeOrbMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorBase: new THREE.Color("#76EEC6"), // Aquamarine base
    uColorAccent1: new THREE.Color("#FF69B4"), // Hot pink accent
    uColorAccent2: new THREE.Color("#40E0D0"), // Turquoise accent
    uMouse: new THREE.Vector2(0, 0),
    uDistortionFrequency: 1.5,
    uDistortionStrength: 0.25,
    uNoiseSpeed: 0.1,
    uNoiseScale: 1.8,
    uFresnelPower: 3.5,
    uFresnelColor: new THREE.Color("#FFFFFF"),
    uMouseEffectStrength: 0.3,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistortion;

    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uDistortionFrequency;
    uniform float uDistortionStrength;
    uniform float uNoiseSpeed;
    uniform float uMouseEffectStrength; // Correctly declared

    // Simplex Noise (standard)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0) ; const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) ); vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m; return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;

      vec3 noiseInput = position * uDistortionFrequency;
      noiseInput.z += uTime * uNoiseSpeed;
      noiseInput.xy += uMouse * uDistortionStrength * 0.5;

      vDistortion = snoise(noiseInput);
      float displacement = vDistortion * uDistortionStrength;

      float mouseProximity = 1.0 - clamp(length(position.xy - uMouse * 2.0), 0.0, 1.0);
      displacement += mouseProximity * uMouseEffectStrength * (length(uMouse) > 0.01 ? sign(uMouse.y) : 0.0) * 0.2;

      vec3 newPosition = position + normal * displacement;
      
      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      vViewPosition = -mvPosition.xyz;

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying float vDistortion;

    uniform float uTime;
    uniform vec3 uColorBase;
    uniform vec3 uColorAccent1;
    uniform vec3 uColorAccent2;
    uniform vec2 uMouse;
    uniform float uNoiseScale;
    uniform float uFresnelPower;
    uniform vec3 uFresnelColor;
    uniform float uMouseEffectStrength;

    // Simplex Noise (standard)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0) ; const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) ); vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy ); vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx; vec3 x2 = x0 - i2 + C.yyy; vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy ); vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m; return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      float noiseVal = snoise(vViewPosition * uNoiseScale + uTime * 0.3);
      vec3 color = uColorBase;
      color = mix(color, uColorAccent1, smoothstep(0.2, 0.6, noiseVal + vDistortion * 0.5));
      color = mix(color, uColorAccent2, smoothstep(-0.5, -0.1, noiseVal - vDistortion * 0.5));
      float distFromCenter = length(vUv - 0.5) * 2.0;
      color += uColorBase * (1.0 - distFromCenter) * 0.1;
      float mouseDist = length(vUv - 0.5 - uMouse * 0.5);
      float mouseGlow = smoothstep(0.3, 0.0, mouseDist) * uMouseEffectStrength;
      color = mix(color, uColorAccent1 * 1.5, mouseGlow);
      vec3 normalView = normalize(vNormal);
      vec3 viewDirection = normalize(vViewPosition);
      float fresnelTerm = dot(normalView, viewDirection);
      fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
      fresnelTerm = pow(fresnelTerm, uFresnelPower);
      vec3 finalColor = color + fresnelTerm * uFresnelColor * 0.7;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);
extend({ CreativeOrbMaterial });
// --- End Shader Definition ---

function OrbMesh() {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree(); // viewport gives scaled units
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
      meshRef.current.rotation.x += delta * 0.01;
    }
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      materialRef.current.uMouse.lerp(
        new THREE.Vector2(mousePosition.x, mousePosition.y),
        0.07
      );
    }
  });

  // Ensure viewport dimensions are valid before calculating
  const sphereRadius = viewport.width > 0 ? viewport.width * 0.65 : 1; // Default radius if viewport not ready
  const sphereYPosition = viewport.width > 0 ? -sphereRadius * 0.75 : -0.75; // Default Y if viewport not ready

  // Simple console log to check if this component is rendering and values
  // You can remove this once everything works
  if (viewport.width > 0) {
    // console.log(`Creative Orb - Radius: ${sphereRadius.toFixed(2)}, Y: ${sphereYPosition.toFixed(2)}`);
  }

  return (
    <Sphere
      ref={meshRef}
      args={[sphereRadius, 128, 128]}
      position={[0, sphereYPosition, 0]}
    >
      <creativeOrbMaterial ref={materialRef} attach="material" />
    </Sphere>
  );
}

export default function AbstractOrbContainer() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50vh", // CSS height of the container for the canvas
        zIndex: 0, // Behind text content with z-index: 1 or higher
        overflow: "hidden",
        // For debugging positioning, uncomment these:
        // backgroundColor: 'rgba(255, 0, 255, 0.3)', // Magenta semi-transparent
        // border: '2px solid fuchsia'
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }} // Canvas fills its parent div
        gl={{ antialias: true, alpha: true }} // alpha:true for transparent canvas background
        // onCreated={({ gl }) => { // For debugging canvas area
        //   gl.setClearColor(new THREE.Color('green'), 0.3);
        // }}
        camera={{
          position: [0, 0, 10], // Camera position
          fov: 55,
          near: 0.1,
          far: 100,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 7, 5]} intensity={0.8} />
        <directionalLight
          position={[-3, -2, 3]}
          intensity={0.4}
          color="#FFC0CB"
        />
        <OrbMesh />
      </Canvas>
    </div>
  );
}
