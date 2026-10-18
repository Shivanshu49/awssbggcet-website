'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, X, MapPin } from 'lucide-react';
import styles from './DomeGallery.module.css';

export interface GalleryPhoto {
  src: string;
  alt?: string;
  title?: string;
  desc?: string;
  location?: string;
}

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

export const PhotoGrid: React.FC<{ photos: GalleryPhoto[] }> = ({ photos }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const segments = 24;
  const radius = isMobile ? 310 : 650;
  const items = useMemo(() => buildReactBitsItems(photos, segments), [photos, segments]);

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

  if (photos.length === 0) return null;

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
                      <Image
                        src={it.photo.src}
                        alt={it.photo.title || 'Dome Tile'}
                        fill
                        sizes="(max-width: 640px) 99px, 143px"
                      />
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
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title || 'Selected photo'}
                width={464}
                height={256}
                sizes="(max-width: 640px) 100vw, 464px"
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