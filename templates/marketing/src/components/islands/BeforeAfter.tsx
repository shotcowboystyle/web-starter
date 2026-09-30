/* oxlint-disable jsx-a11y/no-static-element-interactions -- pointer-driven comparison slider; keyboard support tracked separately */
import { GripVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
}

export default function BeforeAfter({ beforeImage, afterImage, beforeLabel, afterLabel }: BeforeAfterProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent | any) => {
    if (!containerRef.current) {
      return;
    }

    // Support both mouse and touch events
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;

    setSliderPosition(percent);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
          const percent = (x / rect.width) * 100;
          setSliderPosition(percent);
        }
      }
    };
    const handleWindowUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleWindowMove);
    window.addEventListener('mouseup', handleWindowUp);
    window.addEventListener('touchmove', handleWindowMove, { passive: false });
    window.addEventListener('touchend', handleWindowUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMove);
      window.removeEventListener('mouseup', handleWindowUp);
      window.removeEventListener('touchmove', handleWindowMove);
      window.removeEventListener('touchend', handleWindowUp);
    };
  }, [isDragging]);

  return (
    <div
      className="relative aspect-video w-full cursor-ew-resize touch-none overflow-hidden rounded-3xl border border-white/10 shadow-2xl select-none"
      ref={containerRef}
      onMouseDown={(e) => {
        handleMove(e);
        handleMouseDown(e);
      }}
      onTouchStart={(e) => {
        handleMove(e);
        handleMouseDown(e);
      }}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />

      {/* Before Image (Clipped Foreground) */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Label */}
        <div className="absolute top-4 left-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          {beforeLabel}
        </div>
      </div>

      {/* After Label */}
      <div className="pointer-events-none absolute top-4 right-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
        {afterLabel}
      </div>

      {/* Slider Handle */}
      <div
        className="absolute inset-y-0 z-20 -ml-0.5 w-1 cursor-ew-resize bg-white"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <button
          className="focus:ring-primary/50 absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform hover:scale-110 focus:ring-4 focus:outline-none md:h-12 md:w-12"
          aria-label="Move slider"
        >
          <GripVertical className="h-4 w-4 opacity-60 md:h-6 md:w-6" />
        </button>
      </div>
    </div>
  );
}
