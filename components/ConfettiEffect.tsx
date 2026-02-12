
import React, { useEffect, useState } from 'react';

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];

export const ConfettiEffect: React.FC<{ active: boolean }> = ({ active }) => {
  const [pieces, setPieces] = useState<{ id: number; left: number; color: string; delay: number; duration: number }[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3
      }));
      setPieces(newPieces);
      const timer = setTimeout(() => setPieces([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            backgroundColor: p.color,
            animation: `fall ${p.duration}s linear ${p.delay}s forwards`,
            width: '12px',
            height: '12px',
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};
