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
  onSpinRequest?: () => Promise<number | { targetIndex: number }>;
  onSpinEnd?: (winner: SpinSegment) => void;
  spinDuration?: number;
}

interface SliceStyle {
  start: string;
  mid: string;
  end: string;
  shadow: string;
}

// Curated Royal Casino Luxury Gemstone & Gold Palette
const LUXURY_PALETTE: SliceStyle[] = [
  { start: '#7e22ce', mid: '#9333ea', end: '#3b0764', shadow: '#2e1065' }, // Amethyst Velvet Purple
  { start: '#d97706', mid: '#f59e0b', end: '#78350f', shadow: '#451a03' }, // Warm Amber Gold
  { start: '#047857', mid: '#059669', end: '#022c22', shadow: '#064e3b' }, // Imperial Jade Emerald
  { start: '#be123c', mid: '#e11d48', end: '#4c0519', shadow: '#881337' }, // Royal Crimson Ruby
  { start: '#0284c7', mid: '#0ea5e9', end: '#164e63', shadow: '#0c4a6e' }, // Deep Sapphire Cyan
  { start: '#059669', mid: '#10b981', end: '#064e3b', shadow: '#022c22' }  // Vibrant Emerald Mint
];

export const SpinWheel: FC<SpinWheelProps> = ({
  segments,
  size = 320,
  theme = 'emerald',
  onSpinRequest,
  onSpinEnd,
  spinDuration = 5200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [bulbPhase, setBulbPhase] = useState(0);
  const loadedImagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Cycle marquee bulbs animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBulbPhase((prev) => (prev + 1) % 2);
    }, isSpinning ? 120 : 600);
    return () => clearInterval(interval);
  }, [isSpinning]);

  useEffect(() => {
    const urls = segments.map((s) => s.image).filter(Boolean) as string[];
    if (urls.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    urls.forEach((url) => {
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

  // Render Hyper-Realistic 3D Casino Canvas Wheel
  useEffect(() => {
    if (!imagesLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSegments = segments.length;
    if (numSegments === 0) return;

    const arc = (2 * Math.PI) / numSegments;
    const radius = size / 2;
    const cx = radius;
    const cy = radius;
    const innerRadius = radius - 14;
    const hubRadius = size * 0.16;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ==========================================
    // 1. OUTER HEAVY GOLD CASINO BEVELED RIM
    // ==========================================
    const rimGradient = ctx.createLinearGradient(0, 0, size, size);
    rimGradient.addColorStop(0, '#fef08a');
    rimGradient.addColorStop(0.2, '#ca8a04');
    rimGradient.addColorStop(0.4, '#fef08a');
    rimGradient.addColorStop(0.65, '#854d0e');
    rimGradient.addColorStop(0.85, '#eab308');
    rimGradient.addColorStop(1, '#fef08a');

    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, 0, 2 * Math.PI);
    ctx.fillStyle = rimGradient;
    ctx.fill();

    // Outer Dark Bezel Inset
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 9, 0, 2 * Math.PI);
    ctx.fillStyle = '#090d16';
    ctx.fill();

    // Engraved Golden Bead Track Ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 11, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // ==========================================
    // 2. LUXURY GEMSTONE SLICES (CONVEX 3D DEPTH)
    // ==========================================
    for (let i = 0; i < numSegments; i++) {
      const angle = i * arc;
      const palette = LUXURY_PALETTE[i % LUXURY_PALETTE.length];

      // Multi-stop radial gradient for rich 3D convex dome look
      const segGradient = ctx.createRadialGradient(
        cx,
        cy,
        hubRadius * 0.8,
        cx,
        cy,
        innerRadius
      );
      segGradient.addColorStop(0, palette.start);
      segGradient.addColorStop(0.45, palette.mid);
      segGradient.addColorStop(0.85, palette.end);
      segGradient.addColorStop(1, palette.shadow);

      ctx.beginPath();
      ctx.fillStyle = segGradient;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, innerRadius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // Delicate inner gold arc highlight on outer edge of slice
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius - 4, angle + 0.04, angle + arc - 0.04);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // ==========================================
    // 3. ASSET PEDESTALS, 3D ICONS & LABELS
    // ==========================================
    for (let i = 0; i < numSegments; i++) {
      const angle = i * arc;
      const midAngle = angle + arc / 2;
      const segment = segments[i];

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midAngle);

      const itemDistance = innerRadius * 0.64;

      // Soft Luminous Aura / Halo behind asset
      const auraGradient = ctx.createRadialGradient(
        itemDistance,
        0,
        2,
        itemDistance,
        0,
        24
      );
      auraGradient.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      auraGradient.addColorStop(0.6, 'rgba(254, 240, 138, 0.12)');
      auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(itemDistance, 0, 24, 0, 2 * Math.PI);
      ctx.fillStyle = auraGradient;
      ctx.fill();

      // Render 3D Icon or Label
      if (segment.image && loadedImagesRef.current[segment.image]) {
        const img = loadedImagesRef.current[segment.image];
        const imgSize = size > 300 ? 34 : 28;

        // Realistic asset drop shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 3;

        ctx.drawImage(
          img,
          itemDistance - imgSize / 2,
          -imgSize / 2,
          imgSize,
          imgSize
        );
      } else {
        ctx.font = '900 13px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fillText(segment.label, itemDistance, 5);
      }
      ctx.restore();
    }

    // ==========================================
    // 4. 3D EXTRUDED GOLD DIVIDER SPOKES & RIVETS
    // ==========================================
    for (let i = 0; i < numSegments; i++) {
      const angle = i * arc;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const startX = cx + cosA * (hubRadius + 4);
      const startY = cy + sinA * (hubRadius + 4);
      const endX = cx + cosA * (innerRadius - 2);
      const endY = cy + sinA * (innerRadius - 2);

      // Layer 1: Dark Depth Shadow Ray
      ctx.beginPath();
      ctx.moveTo(startX + 1, startY + 1);
      ctx.lineTo(endX + 1, endY + 1);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Layer 2: Metallic Gold Body
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Layer 3: Top Specular Gold Highlight
      ctx.beginPath();
      ctx.moveTo(startX - 0.75, startY - 0.75);
      ctx.lineTo(endX - 0.75, endY - 0.75);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer Gold Ball Rivet Stud
      const outerRivetX = cx + cosA * (innerRadius - 3);
      const outerRivetY = cy + sinA * (innerRadius - 3);
      const outerRivetGrad = ctx.createRadialGradient(
        outerRivetX - 1,
        outerRivetY - 1,
        0,
        outerRivetX,
        outerRivetY,
        4
      );
      outerRivetGrad.addColorStop(0, '#ffffff');
      outerRivetGrad.addColorStop(0.4, '#fbbf24');
      outerRivetGrad.addColorStop(1, '#78350f');

      ctx.beginPath();
      ctx.arc(outerRivetX, outerRivetY, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = outerRivetGrad;
      ctx.fill();
    }

    // ==========================================
    // 5. SUNKEN WHEEL CAVITY INNER DROP SHADOW
    // ==========================================
    const cavityShadow = ctx.createRadialGradient(
      cx,
      cy,
      innerRadius - 22,
      cx,
      cy,
      innerRadius
    );
    cavityShadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    cavityShadow.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
    cavityShadow.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = cavityShadow;
    ctx.fill();

    // ==========================================
    // 6. GLOSSY SPECULAR LACQUER SHEEN OVERLAY
    // ==========================================
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, 2 * Math.PI);
    ctx.clip();

    const glossGrad = ctx.createLinearGradient(0, 0, size * 0.75, size * 0.75);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    glossGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.04)');
    glossGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = glossGrad;
    ctx.fill();
    ctx.restore();

    // ==========================================
    // 7. CENTER HUB GOLDEN COLLAR TRACK
    // ==========================================
    // Outer Shadow
    ctx.beginPath();
    ctx.arc(cx, cy, hubRadius + 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fill();

    // Metallic Gold Ring Collar
    ctx.beginPath();
    ctx.arc(cx, cy, hubRadius + 3, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
  }, [segments, size, theme, imagesLoaded]);

  // Mathematical Predetermined Spin Engine
  const spin = async () => {
    if (isSpinning || segments.length === 0) return;
    setIsSpinning(true);

    try {
      let targetIndex = 0;

      if (onSpinRequest) {
        const response = await onSpinRequest();
        targetIndex = typeof response === 'number' ? response : response.targetIndex;
      } else {
        targetIndex = Math.floor(Math.random() * segments.length);
      }

      targetIndex = ((targetIndex % segments.length) + segments.length) % segments.length;

      const numSegments = segments.length;
      const degreesPerSegment = 360 / numSegments;

      const segmentCenterAngle = targetIndex * degreesPerSegment + degreesPerSegment / 2;
      const jitter = (Math.random() - 0.5) * (degreesPerSegment * 0.6);

      const targetStopMod = (270 - segmentCenterAngle - jitter + 3600) % 360;
      const currentMod = currentRotation % 360;
      const delta = (targetStopMod - currentMod + 360) % 360;

      const minFullSpins = 7;
      const targetRotation = currentRotation + minFullSpins * 360 + delta;

      if (wrapperRef.current) {
        wrapperRef.current.style.transition = `transform ${spinDuration}ms cubic-bezier(0.12, 0.9, 0.2, 1.02)`;
        wrapperRef.current.style.transform = `rotate(${targetRotation}deg)`;
      }

      setTimeout(() => {
        setIsSpinning(false);
        const normalizedCurrentRotation = targetRotation % 360;
        setCurrentRotation(normalizedCurrentRotation);

        const winner = segments[targetIndex];
        if (onSpinEnd) {
          onSpinEnd(winner);
        }
      }, spinDuration);
    } catch (err) {
      console.error('Spin error:', err);
      setIsSpinning(false);
    }
  };

  // 16 Casino Marquee Bulbs
  const BULB_COUNT = 16;
  const bulbs = Array.from({ length: BULB_COUNT }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / BULB_COUNT;
    const distance = size / 2 - 6;
    const x = size / 2 + Math.cos(angle) * distance;
    const y = size / 2 + Math.sin(angle) * distance;
    const isLit = (i + bulbPhase) % 2 === 0;

    return { x, y, isLit };
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none'
      }}
    >
      {/* 1. Ambient Golden Halo / Sunburst Rays Behind Wheel */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${size * 1.3}px`,
          height: `${size * 1.3}px`,
          borderRadius: '50%',
          background: isSpinning
            ? 'radial-gradient(circle, rgba(250, 204, 21, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, rgba(0,0,0,0) 75%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'all 0.5s ease',
          filter: 'blur(8px)'
        }}
      />

      {/* 2. Wheel Stage & Frame Container */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: 'relative',
          zIndex: 5,
          filter: 'drop-shadow(0 16px 28px rgba(0, 0, 0, 0.65))'
        }}
      >
        {/* Animated Canvas Wrapper */}
        <div
          ref={wrapperRef}
          style={{
            width: '100%',
            height: '100%',
            transform: `rotate(${currentRotation}deg)`
          }}
        >
          <canvas ref={canvasRef} width={size} height={size} style={{ width: '100%', height: '100%' }} />
        </div>

        {/* 3. Marquee Bulbs Overlay */}
        {bulbs.map((bulb, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${bulb.x}px`,
              top: `${bulb.y}px`,
              transform: 'translate(-50%, -50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: bulb.isLit ? '#fef08a' : '#713f12',
              boxShadow: bulb.isLit
                ? '0 0 8px 2px rgba(254, 240, 138, 0.9), 0 0 2px #ffffff'
                : 'inset 0 1px 2px rgba(0,0,0,0.8)',
              zIndex: 8,
              transition: 'background-color 0.15s ease, box-shadow 0.15s ease'
            }}
          />
        ))}

        {/* 4. Top Golden Pointer (Casino Flapper) */}
        <div
          style={{
            position: 'absolute',
            top: '-7%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '16%',
            zIndex: 15,
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.65))',
            pointerEvents: 'none'
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 32" fill="url(#flapperGoldGradient)" stroke="#854d0e" strokeWidth="1.5">
            <defs>
              <linearGradient id="flapperGoldGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="85%" stopColor="#a16207" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
            <path d="M12 30 L2 10 L12 2 L22 10 Z" />
            {/* Center needle gem */}
            <circle cx="12" cy="11" r="3.5" fill="#f87171" stroke="#ffffff" strokeWidth="0.75" />
          </svg>
        </div>

        {/* 5. Center 3D Spin Button */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32%',
            height: '32%',
            zIndex: 20
          }}
        >
          <button
            onClick={spin}
            disabled={isSpinning}
            onMouseDown={() => !isSpinning && setIsButtonPressed(true)}
            onMouseUp={() => setIsButtonPressed(false)}
            onMouseLeave={() => setIsButtonPressed(false)}
            onTouchStart={() => !isSpinning && setIsButtonPressed(true)}
            onTouchEnd={() => setIsButtonPressed(false)}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: isSpinning
                ? 'linear-gradient(180deg, #475569 0%, #1e293b 100%)'
                : 'linear-gradient(180deg, #22c55e 0%, #059669 60%, #047857 100%)',
              color: '#ffffff',
              border: '3px solid #fbbf24',
              boxShadow: isButtonPressed
                ? '0 1px 0 #022c22, inset 0 4px 10px rgba(0,0,0,0.6)'
                : isSpinning
                ? '0 2px 0 #0f172a, inset 0 2px 4px rgba(0,0,0,0.4)'
                : '0 6px 0 #064e3b, 0 12px 18px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.6)',
              fontSize: '1.2rem',
              fontWeight: 900,
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: isSpinning ? 'not-allowed' : 'pointer',
              transition: 'all 0.1s ease',
              transform: isButtonPressed ? 'translateY(5px)' : 'translateY(0)',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
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
