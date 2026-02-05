import React, { useState, useCallback, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './components/Scene'
import { Header } from './components/Header'
import { ControlPanel } from './components/ControlPanel'
import { StatusIndicator } from './components/StatusIndicator'
import { AudioVisualizer } from './components/AudioVisualizer'
import { getThemeColors } from './themes'

// Avatar states: 'idle' | 'speaking' | 'listening'
function App() {
  const [avatarState, setAvatarState] = useState('idle')
  const [currentTheme, setCurrentTheme] = useState('ruby')
  
  const theme = useMemo(() => getThemeColors(currentTheme), [currentTheme])

  const handleStateChange = useCallback((newState) => {
    setAvatarState(newState)
  }, [])

  const handleThemeChange = useCallback((themeName) => {
    setCurrentTheme(themeName)
  }, [])

  const dynamicStyles = useMemo(() => ({
    backgroundPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 25% 25%, ${theme.primary}08 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, ${theme.secondary}08 0%, transparent 50%),
        linear-gradient(${theme.primary}05 1px, transparent 1px),
        linear-gradient(90deg, ${theme.primary}05 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 50px 50px, 50px 50px',
      pointerEvents: 'none',
    },
    cornerTopLeft: {
      top: '20px',
      left: '20px',
      borderTop: `3px solid ${theme.primary}`,
      borderLeft: `3px solid ${theme.secondary}`,
    },
    cornerTopRight: {
      top: '20px',
      right: '20px',
      borderTop: `3px solid ${theme.secondary}`,
      borderRight: `3px solid ${theme.tertiary}`,
    },
    cornerBottomLeft: {
      bottom: '20px',
      left: '20px',
      borderBottom: `3px solid ${theme.tertiary}`,
      borderLeft: `3px solid ${theme.primary}`,
    },
    cornerBottomRight: {
      bottom: '20px',
      right: '20px',
      borderBottom: `3px solid ${theme.primary}`,
      borderRight: `3px solid ${theme.secondary}`,
    },
  }), [theme])

  return (
    <div style={styles.container}>
      {/* Background pattern */}
      <div style={dynamicStyles.backgroundPattern} />
      
      {/* Header */}
      <Header theme={theme} />
      
      {/* Main 3D Canvas */}
      <div style={styles.canvasContainer}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={styles.canvas}
        >
          <Scene avatarState={avatarState} theme={theme} />
        </Canvas>
        
        {/* Overlay elements */}
        <StatusIndicator state={avatarState} theme={theme} />
        <AudioVisualizer state={avatarState} theme={theme} />
      </div>
      
      {/* Control Panel */}
      <ControlPanel 
        currentState={avatarState} 
        onStateChange={handleStateChange}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
        theme={theme}
      />
      
      {/* Decorative corners */}
      <div style={{ ...styles.corner, ...dynamicStyles.cornerTopLeft }} />
      <div style={{ ...styles.corner, ...dynamicStyles.cornerTopRight }} />
      <div style={{ ...styles.corner, ...dynamicStyles.cornerBottomLeft }} />
      <div style={{ ...styles.corner, ...dynamicStyles.cornerBottomRight }} />
    </div>
  )
}

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    background: 'linear-gradient(135deg, #FAF9F6 0%, #F5F5F0 50%, #FAF9F6 100%)',
    overflow: 'hidden',
  },
  canvasContainer: {
    position: 'absolute',
    top: '80px',
    left: 0,
    right: 0,
    bottom: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  corner: {
    position: 'absolute',
    width: '60px',
    height: '60px',
    pointerEvents: 'none',
  },
}

export default App
