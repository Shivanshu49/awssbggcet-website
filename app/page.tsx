'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, UserPlus, Sparkles, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';
import site from '@/content/site.json';
import team from '@/content/team.json';
import events from '@/content/events.json';
import gallery from '@/content/gallery.json';
import resources from '@/content/resources.json';
import { PhotoGrid } from '@/components/sections/PhotoGrid';
import { LeadershipProfileCard } from '@/components/sections/LeadershipProfileCard';
import { prefersReducedMotion, watchVisibility } from '@/lib/motion';
import {
  FeaturedPaths,
  PathExplorer,
  LearningCategories,
  OfficialResources,
  LearningRoadmap,
  WorkshopsSection,
  ProjectIdeas,
  LearningCta,
  LEARNING_CATEGORIES,
  OFFICIAL_RESOURCES,
  PROJECT_IDEAS,
  ROADMAP_STAGES,
} from '@/components/learning';

/* ============================================================================
   WEBGL2 INTERACTIVE CURSOR GRID (HOME HERO)
   ============================================================================ */

const INTRO_SECONDS = 1.4;
const STYLES: Record<string, number> = { lines: 0, dashed: 1, dots: 2, crosses: 3 };
const FALLOFF_CURVES: Record<string, (t: number) => number> = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  sharp: (t) => t * t * t,
};

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform vec2 uOffset;
uniform float uCellSize;
uniform sampler2D uState;
uniform ivec2 uCells;
uniform vec3 uColor;
uniform vec3 uGridColor;
uniform float uLineWidth;
uniform float uMaxOpacity;
uniform float uFillOpacity;
uniform float uGridOpacity;
uniform float uCellRadius;
uniform float uCellGap;
uniform int uGridStyle;
uniform vec2 uMouse;
uniform float uRadius;
uniform float uSpotlight;
uniform float uPresence;
uniform float uEdgeFade;
uniform float uReveal;
out vec4 outColor;

float level(vec2 cell) {
  if (cell.x < 0.0 || cell.y < 0.0 || cell.x >= float(uCells.x) || cell.y >= float(uCells.y)) return 0.0;
  float v = texelFetch(uState, ivec2(cell), 0).r;
  return v * v * (3.0 - 2.0 * v);
}
float line(float d, float width) {
  float w = max(width, 1.0);
  return clamp(w * 0.5 + 0.5 - d, 0.0, 1.0) * (width / w);
}
void main() {
  vec2 pos = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 g = (pos - uOffset) / uCellSize;
  vec2 cell = floor(g);
  vec2 f = g - cell;
  vec2 edge = min(f, 1.0 - f) * uCellSize;
  float vx = line(edge.x, uLineWidth);
  float vy = line(edge.y, uLineWidth);
  float mark = max(vx, vy);
  vec2 toMouse = pos - uMouse;
  float spot = exp(-dot(toMouse, toMouse) / max(uRadius * uRadius, 1.0) * 1.6) * uSpotlight * uPresence;
  vec2 center = uResolution * 0.5;
  float reach = length(center);
  float shown = smoothstep(uReveal * (reach + uCellSize * 2.0), uReveal * (reach + uCellSize * 2.0) - uCellSize * 2.0, length(pos - center));
  shown = uReveal >= 1.0 ? 1.0 : shown;
  float fade = 1.0;
  if (uEdgeFade > 0.0) {
    vec2 norm = pos / uResolution;
    vec2 a = clamp(norm / uEdgeFade, 0.0, 1.0);
    vec2 b = clamp((1.0 - norm) / uEdgeFade, 0.0, 1.0);
    vec2 sa = a * a * a * (a * (a * 6.0 - 15.0) + 10.0);
    vec2 sb = b * b * b * (b * (b * 6.0 - 15.0) + 10.0);
    fade = sa.x * sa.y * sb.x * sb.y;
  }
  float own = level(cell);
  float gridAlpha = mark * min(uGridOpacity + spot * 0.45, 1.0) * fade * shown;
  vec2 side = step(0.5, f) * 2.0 - 1.0;
  float nx = level(cell + vec2(side.x, 0.0));
  float ny = level(cell + vec2(0.0, side.y));
  float nc = level(cell + side);
  float ex = max(own, nx);
  float ey = max(own, ny);
  float joint = max(max(ex, ey), nc);
  float lit = max(vx * (edge.y < uLineWidth ? joint : ex), vy * (edge.x < uLineWidth ? joint : ey));
  float litAlpha = lit * uMaxOpacity * fade;
  float fillAlpha = own * uFillOpacity * fade;
  float cellAlpha = clamp(max(litAlpha, fillAlpha), 0.0, 1.0);
  float alpha = cellAlpha + gridAlpha * (1.0 - cellAlpha);
  vec3 premul = uColor * cellAlpha + uGridColor * gridAlpha * (1.0 - cellAlpha);
  outColor = vec4(premul, alpha);
}`;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
  gl.deleteShader(s);
  return null;
};

const link = (gl: WebGL2RenderingContext) => {
  const v = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const f = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const p = gl.createProgram();
  if (!v || !f || !p) return null;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(p, i);
    if (info) uniforms[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { program: p, uniforms };
};

const parseHex = (hex = '#ffffff'): [number, number, number] => {
  const h = hex.replace('#', '').trim();
  const num = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(num)) return [1, 1, 1];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
};

type CursorGridProps = {
  cellSize?: number;
  color?: string;
  gridColor?: string;
  radius?: number;
  falloff?: keyof typeof FALLOFF_CURVES;
  holdTime?: number;
  fadeDuration?: number;
  lineWidth?: number;
  maxOpacity?: number;
  fillOpacity?: number;
  gridOpacity?: number;
  gridStyle?: keyof typeof STYLES;
  cellRadius?: number;
  cellGap?: number;
  spotlight?: number;
  ambient?: number;
  edgeFade?: number;
  intro?: boolean;
  dpr?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function CursorGrid({
  cellSize = 58,
  color = '#FAF8F5',
  gridColor = '#EFECE6',
  radius = 145,
  falloff = 'smooth',
  holdTime = 380,
  fadeDuration = 800,
  lineWidth = 1,
  maxOpacity = 0.68,
  fillOpacity = 0.06,
  gridOpacity = 0.095,
  gridStyle = 'lines',
  cellRadius = 0,
  cellGap = 0,
  spotlight = 0.52,
  ambient = 0.08,
  edgeFade = 0.18,
  intro = true,
  dpr,
  children,
  className = '',
  style,
}: CursorGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!container || !canvas || !gl) return undefined;
    const shader = link(gl);
    if (!shader) return undefined;
    const u = shader.uniforms;
    const vao = gl.createVertexArray();
    const stateTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, stateTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    const view = { width: 1, height: 1, ratio: 1 };
    const grid = { cols: 0, rows: 0, offX: 0, offY: 0 };
    const pointer = { x: 0, y: 0, inside: false };
    const mouse = { x: 0, y: 0 };
    let levels = new Float32Array(0);
    let targets = new Float32Array(0);
    let touched = new Float32Array(0);
    let pixels = new Uint8Array(0);
    const reduced = prefersReducedMotion();
    let presence = 0;
    let clock = 0;
    let introClock = intro && !reduced ? 0 : 1;
    let raf = 0;
    let wake = 0;
    let visible = false;
    let last = 0;
    let dirty = true;

    const rebuild = () => {
      view.width = Math.max(1, container.clientWidth);
      view.height = Math.max(1, container.clientHeight);
      view.ratio = Math.min(dpr || window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(view.width * view.ratio));
      canvas.height = Math.max(1, Math.round(view.height * view.ratio));
      const cols = Math.ceil(view.width / cellSize) + 1;
      const rows = Math.ceil(view.height / cellSize) + 1;
      grid.cols = cols;
      grid.rows = rows;
      grid.offX = (view.width - cols * cellSize) / 2;
      grid.offY = (view.height - rows * cellSize) / 2;
      levels = new Float32Array(cols * rows);
      targets = new Float32Array(cols * rows);
      touched = new Float32Array(cols * rows).fill(-1e9);
      pixels = new Uint8Array(cols * rows);
      gl.bindTexture(gl.TEXTURE_2D, stateTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, cols, rows, 0, gl.RED, gl.UNSIGNED_BYTE, pixels);
      dirty = true;
    };

    const light = (idx: number, val: number) => {
      if (val > targets[idx]) targets[idx] = val;
      touched[idx] = clock;
    };

    const energize = (x: number, y: number) => {
      const ease = FALLOFF_CURVES[falloff] ?? FALLOFF_CURVES.smooth;
      const minCol = Math.max(0, Math.floor((x - radius - grid.offX) / cellSize));
      const maxCol = Math.min(grid.cols - 1, Math.floor((x + radius - grid.offX) / cellSize));
      const minRow = Math.max(0, Math.floor((y - radius - grid.offY) / cellSize));
      const maxRow = Math.min(grid.rows - 1, Math.floor((y + radius - grid.offY) / cellSize));
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const cx = grid.offX + c * cellSize + cellSize / 2;
          const cy = grid.offY + r * cellSize + cellSize / 2;
          const d = Math.hypot(cx - x, cy - y);
          if (d <= radius) light(r * grid.cols + c, ease(1 - d / radius));
        }
      }
    };

    const draw = () => {
      const ratio = view.ratio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(shader.program);
      gl.bindVertexArray(vao);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, stateTexture);
      if (dirty) {
        for (let i = 0; i < levels.length; i++)
          pixels[i] = Math.round(clamp(levels[i], 0, 1) * 255);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, grid.cols, grid.rows, gl.RED, gl.UNSIGNED_BYTE, pixels);
        dirty = false;
      }
      gl.uniform1i(u.uState, 0);
      gl.uniform2f(u.uResolution, canvas.width, canvas.height);
      gl.uniform2f(u.uOffset, Math.round(grid.offX * ratio), Math.round(grid.offY * ratio));
      gl.uniform1f(u.uCellSize, cellSize * ratio);
      gl.uniform2i(u.uCells, grid.cols, grid.rows);
      gl.uniform3fv(u.uColor, parseHex(color));
      gl.uniform3fv(u.uGridColor, parseHex(gridColor));
      gl.uniform1f(u.uLineWidth, lineWidth * ratio);
      gl.uniform1f(u.uMaxOpacity, maxOpacity);
      gl.uniform1f(u.uFillOpacity, fillOpacity);
      gl.uniform1f(u.uGridOpacity, gridOpacity);
      gl.uniform1f(u.uCellRadius, cellRadius * ratio);
      gl.uniform1f(u.uCellGap, cellGap * ratio);
      gl.uniform1i(u.uGridStyle, STYLES[gridStyle] ?? 0);
      gl.uniform2f(u.uMouse, mouse.x * ratio, mouse.y * ratio);
      gl.uniform1f(u.uRadius, radius * ratio);
      gl.uniform1f(u.uSpotlight, spotlight);
      gl.uniform1f(u.uPresence, presence);
      gl.uniform1f(u.uEdgeFade, edgeFade);
      gl.uniform1f(u.uReveal, introClock >= 1 ? 1 : 1 - Math.pow(1 - introClock, 2.2));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? clamp((now - last) / 1000, 0, 1 / 20) : 1 / 60;
      last = now;
      clock += dt;
      if (introClock < 1) introClock = Math.min(1, introClock + dt / INTRO_SECONDS);
      const follow = 1 - Math.exp(-dt / 0.07);
      mouse.x += (pointer.x - mouse.x) * follow;
      mouse.y += (pointer.y - mouse.y) * follow;
      const goal = pointer.inside ? 1 : 0;
      presence += (goal - presence) * (1 - Math.exp(-dt / 0.25));
      // Snap once the remaining motion is invisible so the idle check below can fire.
      if (Math.abs(goal - presence) < 1e-3) presence = goal;
      if (Math.abs(pointer.x - mouse.x) + Math.abs(pointer.y - mouse.y) < 0.01) {
        mouse.x = pointer.x;
        mouse.y = pointer.y;
      }

      if (ambient > 0 && levels.length) {
        const chance = ambient * dt * levels.length * 0.03;
        if (Math.random() < chance) {
          light(Math.floor(Math.random() * levels.length), 0.25 + Math.random() * 0.35);
        }
      }

      const holdSec = holdTime / 1000;
      const fadeStep = dt / (fadeDuration / 1000);
      const attack = 1 - Math.exp(-dt / 0.045);
      let lit = 0;
      for (let i = 0; i < levels.length; i++) {
        let t = targets[i];
        if (t <= 0 && levels[i] <= 0) continue;
        if (clock - touched[i] > holdSec) t = Math.max(0, t - fadeStep);
        targets[i] = t;
        const b = levels[i];
        const n = t > b ? b + (t - b) * attack : t;
        levels[i] = n < 0.002 ? 0 : n;
        if (levels[i] !== b) dirty = true;
        if (t > 0 || levels[i] > 0) lit++;
      }
      draw();
      // Nothing left to animate: stop until the pointer moves or the next ambient flicker is due.
      if (!lit && presence === goal && introClock >= 1 && mouse.x === pointer.x && mouse.y === pointer.y) {
        if (ambient > 0 && levels.length) {
          // Same Poisson rate as the per-frame ambient chance above, so idle twinkles look identical.
          const rate = ambient * levels.length * 0.03;
          wake = window.setTimeout(flicker, (-Math.log(1 - Math.random()) / rate) * 1000);
        }
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || !visible) return;
      clearTimeout(wake);
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      clearTimeout(wake);
      raf = 0;
    };

    const flicker = () => {
      light(Math.floor(Math.random() * levels.length), 0.25 + Math.random() * 0.35);
      start();
    };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const wasInside = pointer.inside;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (pointer.inside) {
        pointer.x = x;
        pointer.y = y;
        energize(x, y);
      }
      if (pointer.inside || wasInside) start();
    };

    const onResize = () => {
      rebuild();
      draw();
    };

    rebuild();
    draw();
    window.addEventListener('resize', onResize);
    // Reduced motion: keep the static frame above and never start the loop.
    let unwatch = () => {};
    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      unwatch = watchVisibility(container, (v) => {
        visible = v;
        if (v) start();
        else stop();
      });
    }

    return () => {
      stop();
      unwatch();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, [
    ambient,
    cellGap,
    cellRadius,
    cellSize,
    color,
    dpr,
    edgeFade,
    fadeDuration,
    falloff,
    fillOpacity,
    gridColor,
    gridOpacity,
    gridStyle,
    holdTime,
    intro,
    lineWidth,
    maxOpacity,
    radius,
    spotlight,
  ]);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none block z-0" aria-hidden="true" />
      {children ? <div className="relative z-10 w-full h-full">{children}</div> : null}
    </div>
  );
}

const TICKER_ITEMS = [
  'AWS Cloud Foundations Bootcamp – Oct 12',
  'Hack-Cloud GCET 2026: 24h Sprint – Oct 26',
  'Generative AI with Amazon Bedrock Masterclass – Nov 8',
  'Serverless Microservices Architecture Challenge – Nov 24',
  'AWS Certified Cloud Practitioner Study Cohort – Dec 5',
];

const EVENT_CARDS = [
  {
    title: 'AWS Cloud Foundations Bootcamp',
    date: '2026-10-12',
    format: 'Hands-on workshop',
    description: 'A hands-on bootcamp introducing cloud foundations and AWS services.',
  },
  {
    title: 'Hack-Cloud GCET 2026: 24h Sprint',
    date: '2026-10-26',
    format: '24-hour hackathon',
    description: 'A 24-hour hands-on cloud hackathon building scalable serverless solutions on AWS.',
  },
  {
    title: 'Generative AI with Amazon Bedrock Masterclass',
    date: '2026-11-08',
    format: 'Technical masterclass',
    description: 'Build enterprise-grade LLM applications using Amazon Bedrock and Claude.',
  },
  {
    title: 'Serverless Microservices Architecture Challenge',
    date: '2026-11-24',
    format: 'Architecture challenge',
    description: 'Design and build event-driven microservices using AWS serverless services.',
  },
  {
    title: 'AWS Certified Cloud Practitioner Study Cohort',
    date: '2026-12-05',
    format: 'Guided study cohort',
    description: 'Prepare for the AWS Certified Cloud Practitioner exam with a guided study cohort.',
  },
];

type TimelineEvent = {
  key: string;
  date: string;
  title: string;
  description: string;
  format: string;
  venue?: string;
  coverImage?: string;
};

export default function FullySynchronizedPage() {
  const strandsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const todayInIndia = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const upcomingEvents = EVENT_CARDS.filter((event) => event.date >= todayInIndia);
  const pastEvents: TimelineEvent[] = [
    ...events
      .filter((event) => event.date.slice(0, 10) < todayInIndia)
      .map((event) => ({
        key: event.slug,
        date: event.date,
        title: event.title,
        description: event.description,
        format: `${event.mode} event`,
        venue: event.venue,
        coverImage: event.coverImage,
      })),
    ...EVENT_CARDS.filter((event) => event.date < todayInIndia).map((event) => ({
      ...event,
      key: event.title,
    })),
  ].sort((first, second) => second.date.localeCompare(first.date));

  const formatEventDate = (date: string) =>
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(new Date(date.length === 10 ? `${date}T12:00:00+05:30` : date));

  useEffect(() => {
    const canvas = strandsCanvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const elapsed = reducedMotion ? 0 : time;
      const waves = [
        {
          base: 0.58,
          amplitude: 0.13,
          phase: 0.2,
          speed: 0.00032,
          offset: -20,
          primary: '251, 191, 36',
          deep: '245, 158, 11',
        },
        {
          base: 0.58,
          amplitude: 0.13,
          phase: 0.2,
          speed: 0.00032,
          offset: 26,
          primary: '168, 85, 247',
          deep: '147, 51, 234',
        },
      ];

      for (const wave of waves) {
        const phase = wave.phase + elapsed * wave.speed;
        const getPoint = (progress: number, offset: number) => ({
          x: progress * width,
          y:
            height *
              (wave.base +
                Math.sin(progress * Math.PI * 2.15 + phase) * wave.amplitude +
                Math.sin(progress * Math.PI * 1.05 - phase * 0.72) *
                  wave.amplitude *
                  0.24) +
            wave.offset +
            offset,
        });
        const trace = (offset: number) => {
          context.beginPath();
          for (let step = 0; step <= 144; step++) {
            const point = getPoint(step / 144, offset);
            if (step === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          }
        };

        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.globalCompositeOperation = 'lighter';

        const veil = context.createLinearGradient(
          0,
          height * (wave.base - 0.1) + wave.offset,
          0,
          height * (wave.base + 0.12) + wave.offset,
        );
        veil.addColorStop(0, `rgba(${wave.primary}, 0)`);
        veil.addColorStop(0.5, `rgba(${wave.primary}, 0.11)`);
        veil.addColorStop(1, `rgba(${wave.deep}, 0)`);
        context.beginPath();
        for (let step = 0; step <= 144; step++) {
          const point = getPoint(step / 144, -9);
          if (step === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        for (let step = 144; step >= 0; step--) {
          const point = getPoint(step / 144, 13);
          context.lineTo(point.x, point.y);
        }
        context.closePath();
        context.fillStyle = veil;
        context.fill();

        trace(-9);
        context.shadowColor = `rgba(${wave.primary}, 0.9)`;
        context.shadowBlur = 20;
        context.strokeStyle = `rgba(${wave.primary}, 0.32)`;
        context.lineWidth = 18;
        context.stroke();

        trace(13);
        context.shadowColor = `rgba(${wave.deep}, 0.85)`;
        context.shadowBlur = 16;
        context.strokeStyle = `rgba(${wave.deep}, 0.45)`;
        context.lineWidth = 8;
        context.stroke();

        trace(-2);
        context.shadowColor = `rgba(${wave.primary}, 0.95)`;
        context.shadowBlur = 12;
        context.strokeStyle = `rgba(${wave.primary}, 0.96)`;
        context.lineWidth = 3;
        context.stroke();

        trace(-3);
        context.shadowColor = 'rgba(255, 248, 255, 0.9)';
        context.shadowBlur = 12;
        context.strokeStyle = 'rgba(255, 248, 255, 0.82)';
        context.lineWidth = 1;
        context.stroke();
      }
      context.globalCompositeOperation = 'source-over';
      context.shadowBlur = 0;
    };

    const onResize = () => {
      resize();
      if (reducedMotion) draw(0);
    };

    resize();
    if (reducedMotion) {
      draw(0);
    } else {
      const animate = (time: number) => {
        draw(time);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="font-space min-h-screen bg-[#090511] text-white selection:bg-[#FBBF24] selection:text-[#090511]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .font-space { font-family: 'Space Grotesk', sans-serif; }
        .font-mono-jb { font-family: 'JetBrains Mono', monospace; }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 32s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation: none; }
        }
      `,
        }}
      />

      {/* Ticker */}
      <div id="home" className="scroll-mt-24 w-full bg-[#0D0718] border-b border-[#4C2A66]/40 py-2.5 overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-marquee">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="inline-flex items-center mx-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] mr-3 shadow-[0_0_6px_#FBBF24]" />
              <span className="font-mono-jb text-xs tracking-wide text-[#D8CEE6]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================
         1. HOME SECTION
         ==================================================== */}
      <div>
        <CursorGrid
          cellSize={58}
          color="#FAF8F5"
          gridColor="#EFECE6"
          radius={145}
          falloff="smooth"
          holdTime={380}
          fadeDuration={800}
          lineWidth={1}
          maxOpacity={0.68}
          fillOpacity={0.06}
          gridOpacity={0.095}
          gridStyle="lines"
          spotlight={0.52}
          ambient={0.08}
          edgeFade={0.18}
          intro={true}
          className="min-h-[86vh] flex items-center justify-center"
        >
          <section className="relative w-full min-h-[86vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-24">
            <canvas
              ref={strandsCanvasRef}
              className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[46%] w-full opacity-95 sm:h-[48%]"
              aria-hidden="true"
            />
            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
              <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-[#130B20]/95 border border-[#FBBF24]/35 mb-8">
                <span className="font-mono-jb text-xs text-[#FBBF24]">NAVIGATION COMPONENT: HOME SECTION</span>
              </div>
              <h1 className="font-bold tracking-[-0.03em] leading-[1.12] space-y-2">
                <span className="block text-4xl sm:text-6xl text-white">Build with the Cloud.</span>
                <span className="block text-3xl sm:text-6xl text-[#FBBF24]">Create Beyond the Classroom.</span>
              </h1>
              <p className="mt-7 max-w-2xl mx-auto text-base text-[#CFC5DC]">
                Galgotias College of Engineering &amp; Technology&apos;s official student cloud engineering community.
              </p>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                <Link href="/#events" className="px-7 py-3.5 rounded-full bg-[#FBBF24] text-[#0B0714] font-bold text-xs uppercase transition-all hover:bg-amber-300">
                  Explore Events
                </Link>
                <Link href="/#learning" className="px-7 py-3.5 rounded-full border border-[#FBBF24]/40 bg-[#130C22] text-[#FBBF24] font-bold text-xs uppercase transition-all hover:border-[#FBBF24] hover:bg-[#FBBF24]/10">
                  Learning Hub
                </Link>
                <Link href="/#contact" className="px-7 py-3.5 rounded-xl bg-[#130C22] text-white border border-[#5B3285] font-semibold text-xs uppercase transition-all hover:border-[#A855F7]">
                  Join Community
                </Link>
              </div>
            </div>
          </section>
        </CursorGrid>
      </div>

      {/* ====================================================
         2. ABOUT SECTION
         ==================================================== */}
      <div id="about" className="scroll-mt-24 py-16 border-t border-[#4C2A66]/30 bg-[#090511]">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase px-4 py-1 rounded-full bg-[#130C22] text-[#A855F7] border border-[#A855F7]/30">
            Navigation Component: About Section
          </span>
        </div>
        <section className="w-full px-6 sm:px-12 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#A855F7]">About the Builder Group</span>
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">Empowering Cloud Builders at GCET</h2>
            <p className="text-base sm:text-lg text-[#CFC5DC]">Empowering students across all years to build, architect, and deploy production-grade cloud solutions on AWS.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 rounded-2xl bg-[#130C22] border border-[#4C2A66]/40">
              <h3 className="text-xl font-bold text-amber-300 mb-3">Our Mission</h3>
              <p className="text-sm text-[#CFC5DC] leading-relaxed">To provide students at Galgotias College of Engineering &amp; Technology with accessible, hands-on exposure to cloud architecture and emerging technologies, fostering a culture of building, experimentation, and industry alignment.</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#130C22] border border-[#4C2A66]/40">
              <h3 className="text-xl font-bold text-purple-300 mb-3">Our Vision</h3>
              <p className="text-sm text-[#CFC5DC] leading-relaxed">To establish GCET as a recognized student hub for technical leadership, where students graduate with practical experience deploying production-ready cloud solutions.</p>
            </div>
          </div>

          <div className="mb-16 rounded-3xl border border-[#4C2A66]/40 bg-[#100B18] p-7 sm:p-10">
            <div className="mb-8 text-center">
              <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#FBBF24]">The Builder Pathway</span>
              <h3 className="mt-3 text-2xl font-bold sm:text-3xl">From curiosity to cloud leadership</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#CFC5DC]">
                A practical chapter journey that helps GCET students learn cloud fundamentals, turn ideas into working systems, and grow through community.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { step: '01', title: 'Learn', detail: 'Build cloud fundamentals through guided learning paths, study cohorts, and AWS documentation.' },
                { step: '02', title: 'Build', detail: 'Apply what you learn in hands-on labs, projects, and production-minded cloud builds.' },
                { step: '03', title: 'Compete', detail: 'Challenge yourself in hackathons, architecture sprints, and technical competitions.' },
                { step: '04', title: 'Connect', detail: 'Meet peers, mentors, speakers, and the wider AWS builder community.' },
                { step: '05', title: 'Lead', detail: 'Share knowledge, mentor other builders, and help shape the next chapter initiatives.' },
              ].map((item) => (
                <article key={item.step} className="rounded-2xl border border-[#4C2A66]/40 bg-[#090511] p-5">
                  <span className="font-mono-jb text-xs text-[#A855F7]">{item.step}</span>
                  <h4 className="mt-3 text-lg font-bold text-[#FBBF24]">{item.title}</h4>
                  <p className="mt-2 text-xs leading-relaxed text-[#CFC5DC]">{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#A855F7]">People behind the community</span>
                <h3 className="mt-2 text-2xl font-bold sm:text-3xl">Core Team &amp; Leadership</h3>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-[#9E92B0]">
                Student leaders and builders guiding the AWS Builder Center GCET chapter.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <LeadershipProfileCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================
         3. EVENTS SECTION (WITH REGISTRATION & GALLERY)
         ==================================================== */}
      <div id="events" className="scroll-mt-24 py-16 border-t border-[#4C2A66]/30 bg-[#0B0713]">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase px-4 py-1 rounded-full bg-[#130C22] text-[#FBBF24] border border-[#FBBF24]/30">
            Navigation Component: Events Section
          </span>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold mb-3">Events &amp; Flagship Initiatives</h2>
            <p className="text-sm sm:text-base text-[#9E92B0]">Hands-on technical bootcamps, solution challenges, and architectural sessions hosted for students.</p>
          </div>
          <section aria-labelledby="upcoming-events-heading">
            <div className="mb-10 text-center">
              <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#FBBF24]">Mark your calendar</span>
              <h3 id="upcoming-events-heading" className="mt-2 text-2xl font-bold sm:text-3xl">Upcoming Events</h3>
              <p className="mt-2 text-sm text-[#9E92B0]">A continuous timeline of workshops, challenges, and ways to build together.</p>
            </div>
            {upcomingEvents.length > 0 ? (
              <div className="relative space-y-8 before:absolute before:bottom-4 before:left-[15px] before:top-4 before:w-px before:bg-gradient-to-b before:from-[#FBBF24] before:via-[#A855F7] before:to-[#4C2A66]/20 lg:before:left-1/2">
                {upcomingEvents.map((event, index) => (
                  <div key={event.title} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-4 lg:grid-cols-[1fr_4rem_1fr] lg:gap-0">
                    <div className="z-10 col-start-1 row-start-1 flex items-center justify-center lg:col-start-2 lg:row-start-1">
                      <span className="relative flex size-8 items-center justify-center rounded-full border-2 border-[#FBBF24] bg-[#090511] shadow-[0_0_18px_rgba(251,191,36,0.55)]">
                        <span className="size-2 rounded-full bg-[#FBBF24]" />
                      </span>
                    </div>
                    <article className={`group relative col-start-2 row-start-1 overflow-hidden rounded-[1.75rem] border bg-[#100B18]/95 p-6 shadow-[0_16px_55px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(168,85,247,0.15)] sm:p-8 ${index === 0 ? 'border-[#FBBF24]/60 shadow-[0_0_35px_rgba(251,191,36,0.08)]' : 'border-[#4C2A66]/50 hover:border-[#A855F7]/60'} ${index % 2 === 0 ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-3'} lg:row-start-1`}>
                      <span className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#A855F7]/10 blur-3xl transition-colors group-hover:bg-[#FBBF24]/10" />
                      <div className={`relative flex flex-wrap items-center gap-2 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/20 bg-[#1B1130] px-3 py-1.5 font-mono-jb text-[10px] uppercase tracking-wide text-[#FBBF24]">
                          <Calendar className="size-3.5" aria-hidden="true" />
                          {formatEventDate(event.date)}
                        </span>
                        {index === 0 && (
                          <span className="rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3 py-1.5 font-mono-jb text-[10px] uppercase tracking-wide text-[#FBBF24]">
                            Next up
                          </span>
                        )}
                      </div>
                      <h4 className={`relative mt-5 text-xl font-bold text-white sm:text-2xl ${index % 2 === 0 ? 'lg:text-right' : ''}`}>{event.title}</h4>
                      <p className={`relative mt-2 font-mono-jb text-xs text-[#C4A5FD] ${index % 2 === 0 ? 'lg:text-right' : ''}`}>{event.format} · All levels welcome</p>
                      <p className={`relative mt-4 max-w-xl text-sm leading-relaxed text-[#CFC5DC] ${index % 2 === 0 ? 'lg:ml-auto lg:text-right' : ''}`}>{event.description}</p>
                      <div className={`relative mt-6 flex ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                        <Link
                          href={site.joinFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-5 py-2.5 text-xs font-bold text-[#090511] shadow-[0_0_20px_rgba(251,191,36,0.2)] transition hover:bg-amber-300"
                        >
                          <UserPlus className="size-4" aria-hidden="true" />
                          Register Now
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-[#4C2A66]/40 bg-[#100B18] px-6 py-10 text-center text-sm text-[#9E92B0]">
                No upcoming events are scheduled right now. Check back soon for the next chapter event.
              </p>
            )}
          </section>

          <section aria-labelledby="past-events-heading" className="mt-16 border-t border-[#4C2A66]/40 pt-12">
            <div className="mb-8">
              <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#A855F7]">Chapter archive</span>
              <h3 id="past-events-heading" className="mt-2 text-2xl font-bold sm:text-3xl">Past Events</h3>
              <p className="mt-2 text-sm text-[#9E92B0]">Highlights from previous workshops and chapter gatherings.</p>
            </div>
            {pastEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {pastEvents.map((event) => (
                  <article key={event.key} className="overflow-hidden rounded-2xl border border-[#4C2A66]/40 bg-[#100B18]">
                    {event.coverImage && (
                      <div className="relative aspect-[16/7] overflow-hidden bg-[#090511]">
                        <Image
                          src={event.coverImage}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#1B1130] px-3 py-1.5 font-mono-jb text-[10px] text-[#B8ACC9]">
                        <Calendar className="size-3.5 text-[#A855F7]" aria-hidden="true" />
                        {formatEventDate(event.date)}
                      </span>
                      <h4 className="mt-4 text-lg font-bold text-white">{event.title}</h4>
                      <p className="mt-2 font-mono-jb text-[10px] uppercase tracking-wide text-[#A855F7]">
                        {event.format}{event.venue ? ` · ${event.venue}` : ''}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-[#CFC5DC]">{event.description}</p>
                      {event.coverImage && (
                        <Link href="/#event-gallery" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#FBBF24] transition-colors hover:text-amber-200">
                          View event photos
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-[#4C2A66]/40 bg-[#100B18] px-6 py-8 text-sm text-[#9E92B0]">
                Past event highlights will appear here after the next chapter gathering.
              </p>
            )}
          </section>

          <div id="event-gallery" className="scroll-mt-24 mt-16 border-t border-[#4C2A66]/40 pt-10">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#A855F7]">Chapter memories</span>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">3D Spherical Moments Gallery</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#9E92B0]">A look back at the people, talks, and hands-on moments from our chapter events.</p>
            </div>
            <PhotoGrid
              photos={gallery.map((moment) => ({
                src: moment.image,
                alt: moment.title,
                title: moment.title,
              }))}
            />
          </div>
        </div>
      </div>

      {/* ====================================================
         4. LEARNING SECTION
         ==================================================== */}
      <div id="learning" className="scroll-mt-24 py-16 border-t border-[#4C2A66]/30 bg-[#090511]">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase px-4 py-1 rounded-full bg-[#130C22] text-[#A855F7] border border-[#A855F7]/30">
            Navigation Component: Learning Section
          </span>
        </div>
        <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 sm:space-y-20 md:space-y-24">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center space-x-2 rounded-full border border-amber-300/40 bg-[#171020] px-3.5 py-1.5 shadow-[0_0_12px_rgba(253,230,138,0.15)]">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              <span className="font-mono text-xs text-amber-200">
                GCET CLOUD LEARNING HUB
              </span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
              Learn AWS the Builder Way
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-[#A89DB5] sm:text-sm">
              A structured cloud curriculum for GCET students — start with fundamentals,
              progress through guided roadmap stages, practice with official labs, and prepare for certification.
              Every milestone links straight to official AWS documentation, workshops, and training.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#explore-paths"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold tracking-wide text-slate-950 shadow-[0_0_18px_rgba(251,191,36,0.25)] transition-all hover:from-amber-300 hover:to-amber-400"
              >
                Browse Learning Paths
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>

              <Link
                href="/learning"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#4C2A66]/60 bg-[#171020] px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition-all hover:border-amber-300/50 hover:bg-[#1d1428]"
              >
                Explore Full Learning Hub
                <ExternalLink className="h-3.5 w-3.5 text-[#A89DB5]" />
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <dl className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: LEARNING_CATEGORIES.length, label: "Core cloud domains" },
              { value: ROADMAP_STAGES.length, label: "Roadmap stages" },
              { value: OFFICIAL_RESOURCES.length, label: "Official AWS platforms" },
              { value: PROJECT_IDEAS.length, label: "Hands-on project labs" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse rounded-2xl border border-[#4C2A66]/50 bg-[#100B18] p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
              >
                <dt className="mt-1 text-[11px] leading-relaxed text-[#A89DB5] sm:text-xs">
                  {stat.label}
                </dt>
                <dd className="text-2xl font-black text-amber-300">{stat.value}</dd>
              </div>
            ))}
          </dl>

          {/* Featured spotlight tracks */}
          <FeaturedPaths />

          {/* Topic navigation + learning-path catalog */}
          <PathExplorer />

          {/* Learning domains */}
          <LearningCategories />

          {/* Official AWS learning platforms */}
          <OfficialResources />

          {/* Recommended learning roadmap */}
          <LearningRoadmap />

          {/* Hands-on workshops & guided tutorials */}
          <WorkshopsSection />

          {/* Hands-on project ideas */}
          <ProjectIdeas />

          {/* Call to action */}
          <LearningCta />
        </div>
      </div>

      {/* ====================================================
         5. RESOURCES SECTION
         ==================================================== */}
      <div id="resources" className="scroll-mt-24 py-16 border-t border-[#4C2A66]/30 bg-[#0B0713]">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase px-4 py-1 rounded-full bg-[#130C22] text-[#FBBF24] border border-[#FBBF24]/30">
            Navigation Component: Resources Section
          </span>
        </div>
        <section className="mx-auto w-full max-w-6xl px-6">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#FBBF24]">{resources.sectionEyebrow}</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-5xl">{resources.sectionTitle}</h2>
            <p className="mt-5 text-base leading-relaxed text-[#CFC5DC]">{resources.intro}</p>
          </div>

          <div className="mb-16">
            <div className="mb-7 flex items-center gap-3">
              <BookOpen className="size-5 text-[#FBBF24]" aria-hidden="true" />
              <h3 className="text-2xl font-bold">Curated Learning Roadmaps</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {resources.learningPaths.map((path) => (
                <article key={path.id} className="rounded-2xl border border-[#4C2A66]/40 bg-[#130C22] p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#FBBF24]/10 px-3 py-1 font-mono-jb text-[10px] text-[#FBBF24]">{path.level}</span>
                    <span className="rounded-full bg-[#A855F7]/10 px-3 py-1 font-mono-jb text-[10px] text-[#D8B4FE]">{path.duration}</span>
                  </div>
                  <h4 className="mt-4 text-xl font-bold text-white">{path.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-[#CFC5DC]">{path.description}</p>
                  <p className="mt-4 text-xs text-[#A89DB5]"><span className="font-semibold text-[#FBBF24]">Recommended for:</span> {path.recommendedFor}</p>
                  <ul className="mt-5 space-y-3 border-t border-[#4C2A66]/40 pt-5">
                    {path.modules.map((module) => (
                      <li key={module} className="flex gap-3 text-sm leading-relaxed text-[#D8CEE6]">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-[#A855F7]" aria-hidden="true" />
                        <span>{module}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-7 flex items-center gap-3">
              <ExternalLink className="size-5 text-[#FBBF24]" aria-hidden="true" />
              <h3 className="text-2xl font-bold">Labs, Repositories &amp; Masterclasses</h3>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {resources.items.map((item) => (
                <article key={item.id} className="flex flex-col rounded-2xl border border-[#4C2A66]/40 bg-[#130C22] p-6 transition-colors hover:border-[#A855F7]/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#1B1130] px-3 py-1 font-mono-jb text-[10px] text-[#FBBF24]">{item.category}</span>
                    <span className="rounded-full border border-[#4C2A66]/50 px-3 py-1 font-mono-jb text-[10px] text-[#B8ACC9]">{item.difficulty}</span>
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-white">{item.title}</h4>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[#CFC5DC]">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-[#090511] px-2 py-1 text-[10px] text-[#A89DB5]">{tag}</span>
                    ))}
                  </div>
                  <p className="mt-4 font-mono-jb text-[10px] text-[#8E82A0]">{item.type} · Updated {item.updatedAt}</p>
                  <div className="mt-5 flex flex-wrap gap-3 border-t border-[#4C2A66]/40 pt-4">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-[#FBBF24] transition-colors hover:text-amber-200">
                      Open resource <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                    <a href={item.youtubeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-[#D8CEE6] transition-colors hover:text-[#FBBF24]">
                      Video guide <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================
         6. CONTACT SECTION
         ==================================================== */}
      <div id="contact" className="scroll-mt-24 py-16 border-t border-[#4C2A66]/30 bg-[#090511]">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase px-4 py-1 rounded-full bg-[#130C22] text-[#A855F7] border border-[#A855F7]/30">
            Navigation Component: Contact Section
          </span>
        </div>
        <section className="w-full px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">Join the Community</h2>
          <p className="text-base text-[#CFC5DC] mb-8">Have questions or want to collaborate? Reach out to our core team directly via email.</p>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-[#9E92B0]">
            Join a learning cohort, take part in workshops and hackathons, collaborate on cloud projects, or follow our channels for chapter announcements and community updates.
          </p>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-xl bg-[#FBBF24] px-8 py-4 text-sm font-bold uppercase text-[#0B0714] transition-colors hover:bg-amber-300">
            {site.email}
          </a>
          <div className="mt-12">
            <h3 className="font-mono-jb text-xs uppercase tracking-[0.2em] text-[#A855F7]">Find us on</h3>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {Object.entries(site.socials).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#4C2A66]/50 bg-[#130C22] px-5 py-2.5 text-xs font-semibold capitalize text-[#D8CEE6] transition-colors hover:border-[#FBBF24]/60 hover:text-[#FBBF24]"
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
          <Link
            href={site.joinFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#FBBF24]/50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#FBBF24] transition-colors hover:bg-[#FBBF24]/10"
          >
            <UserPlus className="size-4" aria-hidden="true" />
            Join the Builder Group
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </section>
      </div>

    </div>
  );
}