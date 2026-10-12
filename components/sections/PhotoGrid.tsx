'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Sparkles, X, MapPin } from 'lucide-react';
import styles from './DomeGallery.module.css';

export interface GalleryPhoto {
  src: string;
  alt?: string;
  title?: string;
  desc?: string;
  location?: string;
}

const DEFAULT_POOL: GalleryPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    title: 'Cloud DevOps Workshop',
    desc: 'Hands-on AWS architecture session in Lab 304, GCET.',
    location: 'Lab 304, GCET',
  },
  {
    src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    title: 'AWS Innovation Hackathon',
    desc: '24-hour student builder sprint building GenAI solutions.',
    location: 'Auditorium Block C',
  },
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    title: 'Serverless Masterclass',
    desc: 'Deep dive into AWS Lambda, API Gateway, and DynamoDB.',
    location: 'Seminar Hall 2',
  },
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    title: 'Tech Speaker Series',
    desc: 'AWS Solutions Architects mentoring GCET undergraduates.',
    location: 'Virtual Conference',
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    title: 'Campus Community Meet',
    desc: 'Building cloud literacy across all engineering years.',
    location: 'GCET Central Amphitheatre',
  },
  {
    src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    title: 'Builder Showcase',
    desc: 'Students presenting production cloud deployments.',
    location: 'Innovation Lab',
  },
  {
    src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    title: 'Hands-on Lab Session',
    desc: 'Setting up compute instances and security configurations.',
    location: 'CC Lab 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    title: 'Idea Pitch Battle',
    desc: 'Students presenting architectural prototypes to panel mentors.',
    location: 'Seminar Hall 3',
  },
  {
    src: 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80',
    title: 'AWS Career Pathway Panel',
    desc: 'GCET Alumni and guest speakers on landing AWS roles.',
    location: 'Main Auditorium',
  },
  {
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    title: 'Inaugural Launch Meet',
    desc: 'Inauguration and charter reveal of GCET student chapter.',
    location: 'Multipurpose Hall',
  },
];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
const wrapAngle = (deg: number) => (((deg + 180) % 360) + 360) % 360 - 180;

function buildReactBitsItems(pool: GalleryPhoto[], segments: number) {
  const xCols = Array.from({ length: segments }, (_, i) => -segments + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y }));
  });

  return coords.map((c, i) => ({
    ...c,
    photo: pool[i % pool.length],
  }));
}

export const PhotoGrid: React.FC<{ photos?: GalleryPhoto[] }> = ({ photos }) => {
  const pool = useMemo(() => {
    return photos && photos.length > 0 ? photos : DEFAULT_POOL;
  }, [photos]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const segments = 24;
  const radius = isMobile ? 310 : 650;
  const items = useMemo(() => buildReactBitsItems(pool, segments), [pool, segments]);

  const [rotation, setRotation] = useState({ x: -4, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const startPos = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0, y: 0 });
  const sphereRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDragging || selectedPhoto) return;
    const interval = setInterval(() => {
      setRotation((prev) => ({
        x: prev.x,
        y: wrapAngle(prev.y + 0.18),
      }));
    }, 30);
    return () => clearInterval(interval);
  }, [isDragging, selectedPhoto]);

  useEffect(() => {
    if (sphereRef.current) {
      sphereRef.current.style.transform = `translateZ(-${radius}px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
    }
  }, [rotation, radius]);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
    startRot.current = { ...rotation };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;

    const sens = isMobile ? 14 : 24;
    const nextX = clamp(startRot.current.x - dy / sens, -15, 15);
    const nextY = wrapAngle(startRot.current.y + dx / (sens * 0.9));

    setRotation({ x: nextX, y: nextY });
  };

  const handleEnd = () => setIsDragging(false);

  return (
    <div className="select-none my-6">
      <div className={styles.sphereRoot}>
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#181124]/90 border border-[#4C2A66]/60 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-purple-200 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Drag to rotate dome / Click to inspect</span>
          </div>
        </div>

        <main
          className={`${styles.sphereMain} cursor-grab active:cursor-grabbing`}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            if (e.touches[0]) handleStart(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handleEnd}
        >
          <div className={styles.stage}>
            <div ref={sphereRef} className={styles.sphere}>
              {items.map((it, idx) => {
                const unit = 360 / segments / 2;
                const rotY = unit * it.x;
                const rotX = unit * it.y * 1.5;

                const relY = wrapAngle(rotY + rotation.y);
                const isBack = Math.abs(relY) > 85;

                if (isBack) return null;

                return (
                  <div
                    key={idx}
                    className={styles.item}
                    style={{
                      transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) translateZ(${radius}px)`,
                    }}
                  >
                    <div
                      className={styles.itemImage}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(it.photo);
                      }}
                    >
                      <img src={it.photo.src} alt={it.photo.title || 'Dome Tile'} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.overlayBlur} />
          <div className={`${styles.edgeFade} ${styles.edgeFadeTop}`} />
          <div className={`${styles.edgeFade} ${styles.edgeFadeBottom}`} />
        </main>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#120D1D] border border-amber-400/50 rounded-2xl overflow-hidden shadow-[0_0_45px_rgba(255,153,0,0.3)] p-5 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1F1530] text-[#A89DB5] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full h-56 sm:h-64 rounded-xl overflow-hidden bg-black">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title || 'Selected photo'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#2A1642] border border-purple-500/40 text-amber-300">
                Moment Archival
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {selectedPhoto.title || 'Student Builder Event'}
              </h3>
              {selectedPhoto.desc && (
                <p className="text-xs text-[#A89DB5] leading-relaxed">
                  {selectedPhoto.desc}
                </p>
              )}
              {selectedPhoto.location && (
                <p className="text-xs font-mono text-amber-300 flex items-center gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedPhoto.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};