import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';

export interface SpinSegment {
  label: string;
  value: string;
  image?: string;
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
  size = 320,
  theme = 'emerald',
  onSpinEnd,
  spinDuration = 5000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement>>({});

  const getThemeColors = () => {
    if (theme === 'colorful') {
      return ['#8b5cf6', '#ec4899', '#f97316', '#fbbf24', '#10b981', '#06b6d4'];
    } else if (theme === 'gold') {
      return ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];
    }
    // Deep casino emerald theme
    return ['#064e3b', '#047857', '#065f46', '#059669'];
  };

  useEffect(() => {
    const urls = segments.map(s => s.image).filter(Boolean) as string[];
    if (urls.length === 0) {
      setImagesLoaded(true);
      return;
    }
    
    let loadedCount = 0;
    urls.forEach(url => {
      if (loadedImagesRef.current[url]) {
        loadedCount++;
        if (loadedCount === urls.length) setImagesLoaded(true);
        return;
      }
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedImagesRef.current[url] = img;
        loadedCount++;
        if (loadedCount === urls.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [segments]);

  useEffect(() => {
    if (!imagesLoaded) return;
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
    
    // 1. Draw thick outer gold rim
    const rimGradient = ctx.createLinearGradient(0, 0, size, size);
    rimGradient.addColorStop(0, '#fef08a');
    rimGradient.addColorStop(0.5, '#a16207');
    rimGradient.addColorStop(1, '#fef08a');
    
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = rimGradient;
    ctx.fill();

    // 2. Draw inner dark border for depth
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1917'; // very dark gray/brown
    ctx.fill();

    const innerRadius = radius - 14;

    ctx.font = 'bold 18px Outfit, sans-serif';

    // 3. Draw segments
    for (let i = 0; i < numSegments; i++) {
      const angle = i * arc;
      const baseColor = colors[i % colors.length];

      // Segment gradient for 3D convex feel
      const segGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerRadius);
      segGradient.addColorStop(0, baseColor);
      segGradient.addColorStop(1, '#022c22'); // Darken at the edges

      ctx.beginPath();
      ctx.fillStyle = segGradient;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, innerRadius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // Golden border between segments
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, innerRadius, angle, angle); // Just a line
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text/label or image
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      
      const segment = segments[i];
      if (segment.image && loadedImagesRef.current[segment.image]) {
        const img = loadedImagesRef.current[segment.image];
        const imgSize = 48;
        ctx.drawImage(img, innerRadius - imgSize - 20, -imgSize / 2, imgSize, imgSize);
      } else {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.fillText(segment.label, innerRadius - 20, 6);
      }
      ctx.restore();
    }

    // 4. Draw Pegs (Pins) around the rim
    for (let i = 0; i < numSegments; i++) {
      const angle = i * arc;
      const pegX = cx + Math.cos(angle) * (radius - 5);
      const pegY = cy + Math.sin(angle) * (radius - 5);

      const pegGradient = ctx.createRadialGradient(pegX - 2, pegY - 2, 0, pegX, pegY, 6);
      pegGradient.addColorStop(0, '#ffffff');
      pegGradient.addColorStop(1, '#94a3b8');

      ctx.beginPath();
      ctx.arc(pegX, pegY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = pegGradient;
      ctx.fill();
      
      // Peg shadow
      ctx.beginPath();
      ctx.arc(pegX, pegY, 5, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 5. Draw center hub (metallic bearing)
    const hubGradient = ctx.createRadialGradient(cx - 5, cy - 5, 0, cx, cy, 30);
    hubGradient.addColorStop(0, '#fef08a');
    hubGradient.addColorStop(1, '#a16207');

    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1917'; // Outer ring shadow
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, 2 * Math.PI);
    ctx.fillStyle = hubGradient;
    ctx.fill();

    // Inner bolt
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#713f12';
    ctx.fill();

  }, [segments, size, theme, imagesLoaded]);

  const spin = () => {
    if (isSpinning || segments.length === 0) return;
    setIsSpinning(true);

    const extraSpins = Math.floor(Math.random() * 4) + 6; // 6 to 9 full spins
    const randomAngle = Math.random() * 360; 
    const targetRotation = currentRotation + (extraSpins * 360) + randomAngle;
    
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `rotate(${targetRotation}deg)`;
    }

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedCurrentRotation = targetRotation % 360;
      setCurrentRotation(normalizedCurrentRotation);
      
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
      
      {/* The Wheel Container */}
      <div style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        margin: '0 auto',
        filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.5))'
      }}>
        {/* Wrapper for animation */}
        <div 
          ref={wrapperRef}
          style={{
            width: '100%',
            height: '100%',
            transition: `transform ${spinDuration}ms cubic-bezier(0.2, 0.9, 0.3, 1.05)`, // smooth, long ease-out
            transform: `rotate(${currentRotation}deg)`
          }}
        >
          <canvas 
            ref={canvasRef} 
            width={size} 
            height={size}
          />
        </div>

        {/* Pointer (The Casino Flapper) */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))' // Casts shadow onto wheel
        }}>
          {/* A fancy golden flapper */}
          <svg width="48" height="56" viewBox="0 0 24 32" fill="url(#goldGradient)" stroke="#713f12" strokeWidth="1.5">
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
            </defs>
            <path d="M12 30 L2 10 L12 2 L22 10 Z" />
          </svg>
        </div>
        {/* Epic Slot Machine SPIN Button (Centered) */}
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20
        }}>
          <button 
            onClick={spin}
            disabled={isSpinning}
            onMouseDown={() => !isSpinning && setIsButtonPressed(true)}
            onMouseUp={() => setIsButtonPressed(false)}
            onMouseLeave={() => setIsButtonPressed(false)}
            onTouchStart={() => !isSpinning && setIsButtonPressed(true)}
            onTouchEnd={() => setIsButtonPressed(false)}
            style={{
              width: '85px',
              height: '85px',
              borderRadius: '50%',
              background: isSpinning ? '#475569' : 'linear-gradient(to bottom, #10b981, #047857)',
              color: '#fff',
              border: 'none',
              boxShadow: isButtonPressed 
                ? '0 0px 0 #022c22, inset 0 4px 10px rgba(0,0,0,0.4)' 
                : (isSpinning ? '0 0px 0 #334155' : '0 6px 0 #022c22, 0 10px 15px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.4)'),
              fontSize: '1.2rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: isSpinning ? 'not-allowed' : 'pointer',
              transition: 'all 0.1s',
              transform: isButtonPressed ? 'translateY(6px)' : 'translateY(0)',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              opacity: isSpinning ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            {isSpinning ? '...' : 'SPIN'}
          </button>
        </div>
      </div>

    </div>
  );
};
