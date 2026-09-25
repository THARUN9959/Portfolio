import { useState, useEffect } from 'react';

const themes = [
  { name: 'aurora', accent: '#7C9EFF', bg: '#0A0E1A', glow: '#4ADEDE', text: '#E8ECFF' },
  { name: 'ember',  accent: '#FF7C5C', bg: '#120A08', glow: '#FFB05C', text: '#FFE8DC' },
  { name: 'mint',   accent: '#5CFFB0', bg: '#081210', glow: '#5CDEFF', text: '#DCFFF0' },
  { name: 'violet', accent: '#B07CFF', bg: '#0E081A', glow: '#FF5CD4', text: '#EEDCFF' },
];

export function useSessionTheme() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    let t = JSON.parse(sessionStorage.getItem('theme') || 'null');
    if (!t) {
      t = themes[Math.floor(Math.random() * themes.length)];
      sessionStorage.setItem('theme', JSON.stringify(t));
    }
    
    // Apply theme to CSS variables
    Object.entries(t).forEach(([k, v]) => {
      if (k !== 'name') {
        document.documentElement.style.setProperty(`--${k}`, v);
      }
    });
    setTheme(t);
  }, []);

  return theme;
}
