import React from 'react'

export function ControlPanel({ currentState, onStateChange, currentTheme, onThemeChange, theme }) {
  const states = [
    { id: 'idle', label: 'IDLE', icon: '◯' },
    { id: 'speaking', label: 'SPEAK', icon: '◉' },
    { id: 'listening', label: 'LISTEN', icon: '◎' },
  ]

  const themeOptions = [
    { id: 'ruby', label: 'RUBY', colors: ['#DC2626'] },
    { id: 'spectrum', label: 'SPECTRUM', colors: ['#2563EB', '#DC2626', '#16A34A'] },
  ]
  
  return (
    <div style={styles.container}>
      <div style={{
        ...styles.panel,
        border: `1px solid ${theme.primary}33`,
      }}>
        <div style={styles.label}>MODE SELECT</div>
        <div style={styles.buttonGroup}>
          {states.map((state) => (
            <button
              key={state.id}
              style={{
                ...styles.button,
                background: `${theme.primary}0D`,
                border: `1px solid ${theme.primary}33`,
                ...(currentState === state.id ? {
                  background: theme.primary,
                  border: `1px solid ${theme.primary}`,
                  boxShadow: `0 0 20px ${theme.primary}66`,
                  color: '#ffffff',
                } : {}),
              }}
              onClick={() => onStateChange(state.id)}
            >
              <span style={styles.buttonIcon}>{state.icon}</span>
              <span style={styles.buttonLabel}>{state.label}</span>
            </button>
          ))}
        </div>

        {/* Theme Switcher */}
        <div style={{
          ...styles.themeSwitcher,
          borderLeft: `1px solid ${theme.primary}33`,
        }}>
          <div style={styles.themeLabel}>THEME</div>
          <div style={styles.themeButtonGroup}>
            {themeOptions.map((t) => (
              <button
                key={t.id}
                style={{
                  ...styles.themeButton,
                  border: currentTheme === t.id 
                    ? `2px solid ${theme.primary}` 
                    : '2px solid transparent',
                  boxShadow: currentTheme === t.id 
                    ? `0 0 10px ${theme.primary}44` 
                    : 'none',
                }}
                onClick={() => onThemeChange(t.id)}
                title={t.label}
              >
                <div style={styles.themeColorPreview}>
                  {t.colors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.themeColorDot,
                        backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
                <span style={styles.themeButtonLabel}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div style={{
          ...styles.info,
          borderLeft: `1px solid ${theme.primary}33`,
        }}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Current State:</span>
            <span style={{
              ...styles.infoValue,
              color: theme.primary,
            }}>{currentState.toUpperCase()}</span>
          </div>
          <div style={{
            ...styles.divider,
            background: `${theme.primary}1A`,
          }} />
          <div style={styles.hint}>
            {currentState === 'idle' && 'Avatar is in standby mode'}
            {currentState === 'speaking' && 'Avatar is actively speaking'}
            {currentState === 'listening' && 'Avatar is listening for input'}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(0deg, rgba(250, 249, 246, 0.95) 0%, rgba(250, 249, 246, 0) 100%)',
    zIndex: 100,
  },
  panel: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '16px 32px',
    background: 'rgba(250, 249, 246, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
  },
  label: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '11px',
    fontWeight: '600',
    color: '#4A4A4A',
    letterSpacing: '2px',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    transform: 'rotate(180deg)',
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  },
  button: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 24px',
    background: 'rgba(220, 38, 38, 0.05)',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  buttonActive: {
    background: '#DC2626',
    border: '1px solid #DC2626',
    boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)',
  },
  buttonIcon: {
    fontSize: '20px',
    color: 'inherit',
  },
  buttonLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '1px',
    color: 'inherit',
  },
  themeSwitcher: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '0 16px',
  },
  themeLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '9px',
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: '2px',
    textAlign: 'center',
  },
  themeButtonGroup: {
    display: 'flex',
    gap: '6px',
  },
  themeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    background: 'rgba(250, 249, 246, 0.8)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  themeColorPreview: {
    display: 'flex',
    gap: '3px',
  },
  themeColorDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  themeButtonLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '8px',
    fontWeight: '500',
    letterSpacing: '1px',
    color: '#4A4A4A',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '0 16px',
    minWidth: '180px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '12px',
    color: '#4A4A4A',
  },
  infoValue: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: '12px',
    fontWeight: '600',
    color: '#DC2626',
    letterSpacing: '1px',
  },
  divider: {
    height: '1px',
    background: 'rgba(220, 38, 38, 0.1)',
  },
  hint: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: '11px',
    color: '#6B7280',
    fontStyle: 'italic',
  },
}

// Add hover styles via CSS-in-JS workaround
const buttonHoverStyle = document.createElement('style')
buttonHoverStyle.textContent = `
  button:hover {
    background: rgba(220, 38, 38, 0.15) !important;
    transform: translateY(-2px);
  }
  button:active {
    transform: translateY(0);
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(buttonHoverStyle)
}
