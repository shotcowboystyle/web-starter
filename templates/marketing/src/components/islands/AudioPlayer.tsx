import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

type SysStatus = 'IDLE' | 'READY' | 'PLAYING' | 'PAUSED' | 'COMPLETE';

export default function AudioPlayer({ src, title = 'AUDIO_LOG_01' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [sysStatus, setSysStatus] = useState<SysStatus>('IDLE');

  const audioRef = useRef<HTMLAudioElement>(null);

  // Random data stream for TARS effect
  const [dataStream, setDataStream] = useState('00.00.00');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateProgress = () => {
      setProgress(audio.currentTime);
      // Update fake data stream
      setDataStream((Math.random() * 10_000).toFixed(2));
    };

    const setAudioDuration = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
        setSysStatus('READY');
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setSysStatus('COMPLETE');
    };

    const handlePlay = () => setSysStatus('PLAYING');
    const handlePause = () => setSysStatus('PAUSED');

    // Check if metadata is already loaded
    if (audio.readyState >= 1) {
      setAudioDuration();
    }

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('durationchange', setAudioDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('durationchange', setAudioDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Docking Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && (isPlaying || progress > 0)) {
          setIsDocked(true);
        } else {
          setIsDocked(false);
        }
      },
      { threshold: 0 }
    );

    const wrapper = document.querySelector('#audio-player-wrapper');
    if (wrapper) {
      observer.observe(wrapper);
    }

    return () => observer.disconnect();
  }, [isPlaying, progress]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) {
      return '00:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- podcast-style audio; caption track not available for arbitrary src */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
      />

      <motion.div
        layout
        initial={false}
        animate={
          isDocked
            ? {
                bottom: 24,
                left: '50%',
                maxWidth: '600px',
                position: 'fixed' as const,
                width: '95%',
                x: '-50%',
                zIndex: 50,
              }
            : {
                bottom: 'auto' as const,
                left: 'auto' as const,
                maxWidth: '100%',
                position: 'relative' as const,
                width: '100%',
                x: '0%',
                zIndex: 10,
              }
        }
        transition={{ damping: 25, stiffness: 200, type: 'spring' }}
        className="group font-mono text-xs tracking-wider uppercase"
      >
        {/* Main Chassis */}
        <div className="relative overflow-hidden border-2 border-zinc-700 bg-zinc-900 p-1 shadow-2xl">
          {/* Decorative Corner Screws */}
          <div className="absolute top-1 left-1 h-1 w-1 rounded-full bg-zinc-600" />
          <div className="absolute top-1 right-1 h-1 w-1 rounded-full bg-zinc-600" />
          <div className="absolute bottom-1 left-1 h-1 w-1 rounded-full bg-zinc-600" />
          <div className="absolute right-1 bottom-1 h-1 w-1 rounded-full bg-zinc-600" />

          {/* Inner Bezel */}
          <div className="relative border border-zinc-800 bg-zinc-950 p-4">
            {/* HUD Header */}
            <div className="mb-4 flex items-start justify-between border-b border-zinc-800 pb-2 text-zinc-400">
              <div className="flex flex-col">
                <span className="text-[10px]">TARS_AUDIO_MODULE_V1</span>
                <span className="font-bold text-amber-500">{sysStatus}</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <div className="mb-1 flex gap-1">
                  <div className={`h-1 w-1 bg-zinc-600 ${isPlaying ? 'animate-pulse bg-amber-500' : ''}`} />
                  <div className={`h-1 w-1 bg-zinc-600 ${isPlaying ? 'animate-pulse bg-amber-500 delay-75' : ''}`} />
                  <div className={`h-1 w-1 bg-zinc-600 ${isPlaying ? 'animate-pulse bg-amber-500 delay-150' : ''}`} />
                </div>
                <span className="tabular-nums opacity-60">DAT: {dataStream}</span>
              </div>
            </div>

            {/* Main Controls Area */}
            <div className="flex items-center gap-4">
              {/* Play Button (Mechanical Style) */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                className="group/btn flex h-12 w-12 shrink-0 items-center justify-center border border-zinc-600 bg-zinc-800 transition-all outline-none hover:border-amber-500/50 hover:bg-zinc-700 focus-visible:ring-2 focus-visible:ring-amber-500 active:translate-y-px"
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current text-amber-500" />
                  ) : (
                    <Play className="h-5 w-5 fill-current text-zinc-400 group-hover/btn:text-amber-500" />
                  )}
                </AnimatePresence>
              </button>

              {/* Info & Visualization */}
              <div className="flex-1 overflow-hidden">
                <div className="mb-1 flex items-baseline justify-between">
                  <div className="max-w-[150px] truncate font-bold text-white md:max-w-xs">{title}</div>
                  <span className="text-amber-500 tabular-nums">
                    {formatTime(progress)}
                    <span className="px-1 text-zinc-600">/</span>
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Histogram Waveform - Animated TARS Style */}
                <div className="relative flex h-6 items-end gap-[2px] border-t border-zinc-800 bg-zinc-900 pt-1">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-zinc-700"
                      style={{
                        backgroundColor: i / 50 > progress / (duration || 1) ? '#3f3f46' : '#f59e0b', // zinc-700 vs amber-500
                        borderRadius: '1px 1px 0 0',
                      }}
                      animate={{
                        height: isPlaying
                          ? [
                              `${10 + Math.random() * 40}%`,
                              `${20 + Math.random() * 80}%`,
                              `${10 + Math.random() * 40}%`,
                            ]
                          : '20%',
                      }}
                      transition={{
                        delay: i * 0.02,
                        duration: 0.2, // Fast, twitchy mechanical movement
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'reverse' as const,
                      }}
                    />
                  ))}
                  {/* Seek Input */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    aria-label="Seek slider"
                    className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>
              </div>

              {/* Volume (Toggle Switch Style) */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className={`flex h-12 w-8 flex-col items-center justify-center gap-1 border border-zinc-600 transition-colors outline-none hover:border-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-500 ${isMuted ? 'bg-red-900/20' : 'bg-zinc-900'} `}
              >
                <div className={`h-3 w-1 rounded-sm ${isMuted ? 'bg-zinc-700' : 'bg-amber-500'}`} />
                {isMuted ? <VolumeX className="h-3 w-3 text-red-500" /> : <Volume2 className="h-3 w-3 text-zinc-500" />}
              </button>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="mt-1 flex justify-between px-1 text-[9px] text-zinc-600">
            <span>SECURE_CONN_EST</span>
            <span>PWR: 98%</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
