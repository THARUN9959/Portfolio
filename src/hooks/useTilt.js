import { useEffect } from 'react';

export function useTilt(ref) {
  useEffect(() => {
    // Skip on touch devices to avoid jittery behavior
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const el = ref.current;
    if (!el) return;

    const handleMove = e => {
      const rect = el.getBoundingClientRect();
      // Calculate cursor offset from center (-0.5 to 0.5)
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Apply tilt and update variables for inner elements
      el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
    };

    const reset = () => {
      el.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', reset);
    
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', reset);
    };
  }, [ref]);
}
