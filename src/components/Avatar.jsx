import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Avatar({ state, theme }) {
  const groupRef = useRef()
  const leftEyeRef = useRef()
  const rightEyeRef = useRef()
  const mouthRef = useRef()
  const innerRingRef = useRef()
  const outerRingRef = useRef()
  const pulseRingRef = useRef()
  
  // Animation state refs
  const blinkTimer = useRef(0)
  const blinkState = useRef(1) // 1 = open, 0 = closed
  const speakTimer = useRef(0)
  const listenTimer = useRef(0)
  
  // Theme-based colors
  const eyeColor = useMemo(() => new THREE.Color(theme.eyeColor), [theme.eyeColor])
  const mouthColor = useMemo(() => new THREE.Color(theme.mouthColor), [theme.mouthColor])
  const ringColor1 = useMemo(() => new THREE.Color(theme.ringColor1), [theme.ringColor1])
  const ringColor2 = useMemo(() => new THREE.Color(theme.ringColor2), [theme.ringColor2])
  const primaryColor = useMemo(() => new THREE.Color(theme.primary), [theme.primary])
  const offWhite = useMemo(() => new THREE.Color(theme.offWhite), [theme.offWhite])
  
  useFrame((frameState, delta) => {
    const time = frameState.clock.elapsedTime
    
    // === BLINKING ANIMATION ===
    blinkTimer.current += delta
    
    // Random blink every 2-5 seconds
    if (blinkTimer.current > 2 + Math.random() * 3) {
      blinkTimer.current = 0
      // Quick blink animation
      blinkState.current = 0
      setTimeout(() => { blinkState.current = 1 }, 150)
    }
    
    // Apply blink to eyes
    if (leftEyeRef.current && rightEyeRef.current) {
      const targetScale = blinkState.current
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(
        leftEyeRef.current.scale.y,
        targetScale,
        0.3
      )
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(
        rightEyeRef.current.scale.y,
        targetScale,
        0.3
      )
    }
    
    // === STATE-BASED ANIMATIONS ===
    if (state === 'speaking') {
      speakTimer.current += delta * 8
      
      // Mouth animation - scale Y to open/close the horizontal mouth
      if (mouthRef.current) {
        const mouthOpen = 0.8 + Math.sin(speakTimer.current) * 0.3 + 
                         Math.sin(speakTimer.current * 2.3) * 0.2
        mouthRef.current.scale.y = mouthOpen
      }
      
      // Energetic ring rotation
      if (innerRingRef.current) {
        innerRingRef.current.rotation.z += delta * 2
      }
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z -= delta * 1.5
      }
      
      // Pulse effect
      if (pulseRingRef.current) {
        const pulse = 1 + Math.sin(time * 6) * 0.1
        pulseRingRef.current.scale.set(pulse, pulse, 1)
      }
      
    } else if (state === 'listening') {
      listenTimer.current += delta * 3
      
      // Subtle mouth movement (slight anticipation)
      if (mouthRef.current) {
        mouthRef.current.scale.y = 0.6 + Math.sin(listenTimer.current) * 0.1
      }
      
      // Gentle pulsing rings
      if (innerRingRef.current) {
        innerRingRef.current.rotation.z += delta * 0.5
        const listenPulse = 1 + Math.sin(time * 2) * 0.05
        innerRingRef.current.scale.set(listenPulse, listenPulse, 1)
      }
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z -= delta * 0.3
      }
      
      // Breathing pulse
      if (pulseRingRef.current) {
        const breathe = 1 + Math.sin(time * 1.5) * 0.15
        pulseRingRef.current.scale.set(breathe, breathe, 1)
      }
      
    } else {
      // IDLE state
      // Reset mouth to neutral (slightly open)
      if (mouthRef.current) {
        mouthRef.current.scale.y = THREE.MathUtils.lerp(
          mouthRef.current.scale.y,
          0.5,
          0.1
        )
      }
      
      // Slow ambient rotation
      if (innerRingRef.current) {
        innerRingRef.current.rotation.z += delta * 0.2
      }
      if (outerRingRef.current) {
        outerRingRef.current.rotation.z -= delta * 0.15
      }
      
      // Subtle idle pulse
      if (pulseRingRef.current) {
        const idlePulse = 1 + Math.sin(time * 0.8) * 0.03
        pulseRingRef.current.scale.set(idlePulse, idlePulse, 1)
      }
    }
    
    // Subtle head movement
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.05
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.02
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Main face circle - Off-white base */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <meshStandardMaterial 
          color={offWhite}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      
      {/* Face border ring */}
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[1.45, 1.55, 64]} />
        <meshStandardMaterial 
          color={primaryColor}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      
      {/* Inner decorative ring */}
      <mesh ref={innerRingRef} position={[0, 0, 0.02]}>
        <ringGeometry args={[1.6, 1.65, 64]} />
        <meshStandardMaterial 
          color={ringColor1}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Outer decorative ring */}
      <mesh ref={outerRingRef} position={[0, 0, 0.02]}>
        <ringGeometry args={[1.75, 1.78, 32]} />
        <meshStandardMaterial 
          color={ringColor2}
          metalness={0.4}
          roughness={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Pulse ring for state indication */}
      <mesh ref={pulseRingRef} position={[0, 0, -0.01]}>
        <ringGeometry args={[1.85, 1.95, 64]} />
        <meshBasicMaterial 
          color={state === 'speaking' ? mouthColor : state === 'listening' ? eyeColor : '#E5E5E5'}
          transparent
          opacity={state === 'idle' ? 0.2 : 0.5}
        />
      </mesh>
      
      {/* Left Eye */}
      <group position={[-0.45, 0.3, 0.1]}>
        {/* Eye socket */}
        <mesh>
          <circleGeometry args={[0.28, 32]} />
          <meshStandardMaterial 
            color="#F0F0F0"
            metalness={0.1}
            roughness={0.5}
          />
        </mesh>
        {/* Eye pupil */}
        <mesh ref={leftEyeRef} position={[0, 0, 0.01]}>
          <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
          <meshStandardMaterial 
            color={eyeColor}
            metalness={0.6}
            roughness={0.2}
            emissive={eyeColor}
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.05, 0.05, 0.02]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* Right Eye */}
      <group position={[0.45, 0.3, 0.1]}>
        {/* Eye socket */}
        <mesh>
          <circleGeometry args={[0.28, 32]} />
          <meshStandardMaterial 
            color="#F0F0F0"
            metalness={0.1}
            roughness={0.5}
          />
        </mesh>
        {/* Eye pupil */}
        <mesh ref={rightEyeRef} position={[0, 0, 0.01]}>
          <capsuleGeometry args={[0.08, 0.15, 8, 16]} />
          <meshStandardMaterial 
            color={eyeColor}
            metalness={0.6}
            roughness={0.2}
            emissive={eyeColor}
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Eye highlight */}
        <mesh position={[0.05, 0.05, 0.02]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* Mouth - Horizontal orientation */}
      <group position={[0, -0.4, 0.1]}>
        {/* Mouth outer border/lips */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
          <meshStandardMaterial 
            color={mouthColor}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
        {/* Mouth hollow interior - Dark cavity */}
        <mesh ref={mouthRef} position={[0, 0, 0.01]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.07, 0.4, 8, 16]} />
          <meshStandardMaterial 
            color="#1A1A1A"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        {/* Inner glow when speaking */}
        {state === 'speaking' && (
          <mesh position={[0, 0, -0.02]} rotation={[0, 0, Math.PI / 2]}>
            <capsuleGeometry args={[0.05, 0.35, 8, 16]} />
            <meshBasicMaterial 
              color="#3D0A0A"
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
      </group>
      
      {/* Decorative elements - circuit-like lines */}
      <CircuitLines theme={theme} />
      
      {/* Tech accents */}
      <TechAccents state={state} theme={theme} />
    </group>
  )
}

// Circuit-like decorative lines
function CircuitLines({ theme }) {
  return (
    <group position={[0, 0, 0.03]}>
      {/* Left circuit */}
      <mesh position={[-1.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.02, 0.5, 0.01]} />
        <meshBasicMaterial color={theme.primary} transparent opacity={0.4} />
      </mesh>
      <mesh position={[-1.2, 0.3, 0]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color={theme.secondary} transparent opacity={0.6} />
      </mesh>
      
      {/* Right circuit */}
      <mesh position={[1.1, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.02, 0.5, 0.01]} />
        <meshBasicMaterial color={theme.tertiary} transparent opacity={0.4} />
      </mesh>
      <mesh position={[1.2, 0.3, 0]}>
        <circleGeometry args={[0.04, 16]} />
        <meshBasicMaterial color={theme.primary} transparent opacity={0.6} />
      </mesh>
      
      {/* Top accent */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.01]} />
        <meshBasicMaterial color={theme.secondary} transparent opacity={0.3} />
      </mesh>
      
      {/* Bottom accent */}
      <mesh position={[0, -1.0, 0]}>
        <boxGeometry args={[0.4, 0.02, 0.01]} />
        <meshBasicMaterial color={theme.tertiary} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

// Tech accent dots that respond to state
function TechAccents({ state, theme }) {
  const dotsRef = useRef([])
  
  // Alternate colors for spectrum theme
  const dotColors = [
    theme.primary, theme.secondary,
    theme.tertiary, theme.primary,
    theme.secondary, theme.tertiary,
  ]
  
  useFrame((frameState) => {
    const time = frameState.clock.elapsedTime
    dotsRef.current.forEach((dot, i) => {
      if (dot) {
        const offset = i * 0.5
        let intensity = 0.3
        
        if (state === 'speaking') {
          intensity = 0.5 + Math.sin(time * 8 + offset) * 0.5
        } else if (state === 'listening') {
          intensity = 0.4 + Math.sin(time * 3 + offset) * 0.3
        } else {
          intensity = 0.2 + Math.sin(time * 1 + offset) * 0.1
        }
        
        dot.material.opacity = intensity
      }
    })
  })
  
  const dotPositions = [
    [-0.9, 0.7], [0.9, 0.7],
    [-1.0, -0.5], [1.0, -0.5],
    [-0.7, -0.9], [0.7, -0.9],
  ]
  
  return (
    <group position={[0, 0, 0.04]}>
      {dotPositions.map((pos, i) => (
        <mesh 
          key={i} 
          position={[pos[0], pos[1], 0]}
          ref={el => dotsRef.current[i] = el}
        >
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial 
            color={dotColors[i]} 
            transparent 
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
