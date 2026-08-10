import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';

export interface SpinSegment {
  label: string;
  value: string;
}

interface SpinWheelProps {
  segments: SpinSegment[];
  size?: number;
  theme?: 'emerald' | 'colorful' | 'gold';
  onSpinEnd?: (winner: SpinSegment) => void;
  spinDuration?: number;
}

export const SpinWheel: FC<SpinWheelProps> = ({
  segments,
  size = 300,
  theme = 'emerald',
  onSpinEnd,
  spinDuration = 4000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);

  const getThemeColors = () => {
    if (theme === 'colorful') {
      return ['#8b5cf6', '#ec4899', '#f97316', '#fbbf24', '#10b981', '#06b6d4'];
    } else if (theme === 'gold') {
      return ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];
    }
    return ['#059669', '#10b981', '#34d399', '#6ee7b7'];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSegments = segments.length;
    if (numSegments === 0) return;

    const arc = (2 * Math.PI) / numSegments;
    const colors = getThemeColors();
    const radius = size / 2;
    const cx = radius;
    const cy = radius;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px Outfit, sans-serif';

    for (let i = 0; i < numSegments; i++) {
      const angle = i * arc;
      const color = colors[i % colors.length];

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // Border between segments
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text/label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      
      const text = segments[i].label;
      
      // Shadow for text readability
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    }
    
    // Outer border
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }, [segments, size, theme]);

  const spin = () => {
    if (isSpinning || segments.length === 0) return;
    setIsSpinning(true);

    const extraSpins = Math.floor(Math.random() * 5) + 5; // 5 to 9 full spins
    const randomAngle = Math.random() * 360; 
    const targetRotation = currentRotation + (extraSpins * 360) + randomAngle;
    
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `rotate(${targetRotation}deg)`;
    }

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedCurrentRotation = targetRotation % 360;
      setCurrentRotation(normalizedCurrentRotation);
      
      // Calculate which segment won
      const numSegments = segments.length;
      const degreesPerSegment = 360 / numSegments;
      const normalizedRot = (360 - normalizedCurrentRotation + 270) % 360;
      const winningIndex = Math.floor(normalizedRot / degreesPerSegment) % numSegments;
      
      const winner = segments[winningIndex];
      
      if (onSpinEnd) {
        onSpinEnd(winner);
      }
    }, spinDuration);
  };

  return (
    <div style={{
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
      margin: '0 auto'
    }}>
      {/* Wrapper for animation */}
      <div 
        ref={wrapperRef}
        style={{
          width: '100%',
          height: '100%',
          transition: `transform ${spinDuration}ms cubic-bezier(0.175, 0.885, 0.32, 1.05)`,
          transform: `rotate(${currentRotation}deg)`
        }}
      >
        <canvas 
          ref={canvasRef} 
          width={size} 
          height={size}
        />
      </div>

      {/* Pointer */}
      <div style={{
        position: 'absolute',
        top: '-10px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--accent-gold)" stroke="#fff" strokeWidth="2">
          <path d="M12 2L2 22h20L12 2z" transform="rotate(180 12 12)"/>
        </svg>
      </div>

      {/* Center Button */}
      <button 
        onClick={spin}
        disabled={isSpinning}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          zIndex: 5,
          fontWeight: 'bold',
          border: '4px solid #fff',
          boxShadow: 'var(--shadow-glow-emerald)',
          background: 'var(--emerald-600)',
          color: '#fff',
          cursor: isSpinning ? 'not-allowed' : 'pointer'
        }}
      >
        SPIN
      </button>
    </div>
  );
};
