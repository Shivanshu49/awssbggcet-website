'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Sparkles, X, MapPin } from 'lucide-react';

export interface GalleryPhoto {
  src: string;
  alt?: string;
  title?: string;
  desc?: string;
  location?: string;
}

const DEFAULT_IMAGES: GalleryPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=80',
    title: 'Cloud DevOps Workshop',
    desc: 'Hands-on AWS architecture session in Lab 304, GCET',
    location: 'Lab 304, GCET'
  },
  {
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80',
    title: 'AWS Innovation Hackathon',
    desc: '24-hour student builder sprint building GenAI solutions',
    location: 'Auditorium Block C'
  },
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80',
    title: 'Serverless Masterclass',
    desc: 'Deep dive into AWS Lambda, API Gateway and DynamoDB',
    location: 'Seminar Hall 2'
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80',
    title: 'Tech Speaker Series',
    desc: 'AWS Solutions Architects mentoring GCET undergraduates',
    location: 'Virtual Conference'
  },
  {
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80',
    title: 'Campus Community Meet',
    desc: 'Building cloud literacy across all engineering years',
    location: 'GCET Central Amphitheatre'
  },
  {
    src: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=700&q=80',
    title: 'Builder Showcase',
    desc: 'Students presenting production cloud deployments',
    location: 'Innovation Lab'
  }
];

export const PhotoGrid: React.FC<{ photos?: GalleryPhoto[] }> = ({ photos = DEFAULT_IMAGES }) => {
  const sphereRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<GalleryPhoto | null>(null);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: -4, y: 0 });

  useEffect(() => {
    let raf = 0;
    const autoRotate = () => {
      if (!isDragging.current && !selectedItem && sphereRef.current) {
        rot.current.y = (rot.current.y + 0.16) % 360;
        sphereRef.current.style.transform = `translateZ(-540px) rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
      }
      raf = requestAnimationFrame(autoRotate);
    };
    raf = requestAnimationFrame(autoRotate);
    return () => cancelAnimationFrame(raf);
  }, [selectedItem]);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !sphereRef.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    startPos.current = { x: e.clientX, y: e.clientY };

    rot.current.x = Math.max(-12, Math.min(12, rot.current.x - dy * 0.1));
    rot.current.y = (rot.current.y + dx * 0.1) % 360;
    sphereRef.current.style.transform = `translateZ(-540px) rotateX(${rot.current.x}deg) rotateY(${rot.current.y}deg)`;
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="relative w-full h-[520px] overflow-hidden select-none bg-[#08060D] border border-[#4C2A66]/60 rounded-3xl"
      style={{ perspective: '1100px' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.12)_0%,rgba(8,6,13,0.92)_80%)] z-10" />
      <div className="absolute top-4 left-6 z-20 flex items-center space-x-2 text-xs font-mono text-purple-200 bg-[#171020]/90 px-3.5 py-1.5 rounded-full border border-purple-400/30">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Drag sphere to rotate / Click or Right-Click to inspect</span>
      </div>

      <div className="w-full h-full flex items-center justify-center pointer-events-auto" style={{ transformStyle: 'preserve-3d' }}>
        <div ref={sphereRef} className="relative will-change-transform" style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-540px)' }}>
          {photos.map((it, idx) => {
            const angle = (idx / photos.length) * 360;
            return (
              <div
                key={idx}
                onClick={() => setSelectedItem(it)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedItem(it);
                }}
                className="absolute top-1/2 left-1/2 -ml-20 -mt-24 w-40 h-52 cursor-pointer rounded-2xl p-1 bg-[#171020]/95 border border-purple-400/40 hover:border-amber-300 hover:shadow-[0_0_25px_rgba(253,230,138,0.3)] transition-all duration-300 group overflow-hidden"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(540px)`
                }}
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src={it.src}
                    alt={it.title || 'Event photograph'}
                    fill
                    sizes="160px"
                    className="object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08060D] via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-2 left-2 right-2 text-[11px] font-medium text-white truncate">
                    {it.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="absolute inset-0 z-40 bg-[#08060D]/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-[#171020] border-2 border-purple-400/60 rounded-3xl p-6 shadow-[0_0_40px_rgba(192,132,252,0.25)]"
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-purple-200 hover:text-white bg-[#21152E] p-2 rounded-full border border-purple-500/30"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-4 border border-purple-500/20">
              <Image
                src={selectedItem.src}
                alt={selectedItem.title || 'Event image'}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            <span className="inline-block text-xs font-mono text-amber-300 bg-amber-950/40 px-2.5 py-1 rounded-full mb-2 border border-amber-400/30">
              GCET Community Chapter
            </span>
            <h3 className="text-lg font-bold text-white mb-1">{selectedItem.title}</h3>
            {selectedItem.location && (
              <div className="flex items-center text-xs text-purple-300/80 mb-3 gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{selectedItem.location}</span>
              </div>
            )}
            <p className="text-xs text-purple-200/90 mb-4 leading-relaxed">{selectedItem.desc}</p>
            <div className="flex justify-between items-center pt-3 border-t border-[#4C2A66]">
              <span className="text-[11px] text-purple-300/70 font-mono">AWS Student Builder Group</span>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};