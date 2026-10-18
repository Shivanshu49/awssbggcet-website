'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Calendar, UserPlus } from 'lucide-react';

/* ============================================================================
   WEBGL2 INTERACTIVE CURSOR GRID
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
}: Record<string, any>) {
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
    let presence = 0;
    let clock = 0;
    let introClock = intro ? 0 : 1;
    let raf = 0;
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

      if (ambient > 0 && levels.length) {
        const chance = ambient * dt * levels.length * 0.03;
        if (Math.random() < chance) {
          light(Math.floor(Math.random() * levels.length), 0.25 + Math.random() * 0.35);
        }
      }

      const holdSec = holdTime / 1000;
      const fadeStep = dt / (fadeDuration / 1000);
      const attack = 1 - Math.exp(-dt / 0.045);
      for (let i = 0; i < levels.length; i++) {
        let t = targets[i];
        if (t <= 0 && levels[i] <= 0) continue;
        if (clock - touched[i] > holdSec) t = Math.max(0, t - fadeStep);
        targets[i] = t;
        const b = levels[i];
        const n = t > b ? b + (t - b) * attack : t;
        levels[i] = n < 0.002 ? 0 : n;
        if (levels[i] !== b) dirty = true;
      }
      draw();
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (pointer.inside) {
        pointer.x = x;
        pointer.y = y;
        energize(x, y);
      }
    };

    rebuild();
    draw();
    raf = requestAnimationFrame(frame);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', rebuild);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', rebuild);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none block z-0" aria-hidden="true" />
      {children ? <div className="relative z-10 w-full h-full">{children}</div> : null}
    </div>
  );
}

/* ============================================================================
   HOME PAGE COMPONENT (DEFAULT EXPORT)
   ============================================================================ */

const TICKER_ITEMS = [
  'AWS Cloud Foundations Bootcamp – Oct 12',
  'Hack-Cloud GCET 2026: 24h Sprint – Oct 26',
  'Generative AI with Amazon Bedrock Masterclass – Nov 8',
  'Serverless Microservices Architecture Challenge – Nov 24',
  'AWS Certified Cloud Practitioner Study Cohort – Dec 5',
];

export default function HomePage() {
  const strandsCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = strandsCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const getWaveY = (
      normX: number,
      height: number,
      t: number,
      config: {
        baseY: number;
        dipX: number;
        dipDepth: number;
        crestX: number;
        crestHeight: number;
        freq: number;
        speed: number;
        phase: number;
        amp: number;
      }
    ) => {
      const dip =
        Math.exp(-Math.pow((normX - config.dipX) / 0.24, 2)) * config.dipDepth;
      const crest =
        Math.exp(-Math.pow((normX - config.crestX) / 0.22, 2)) *
        config.crestHeight;
      const leftLift = Math.exp(-Math.pow(normX / 0.18, 2)) * -22;

      const organicMotion =
        Math.sin(normX * config.freq + t * config.speed + config.phase) *
          config.amp +
        Math.cos(
          normX * (config.freq * 0.65) - t * (config.speed * 0.8) + config.phase
        ) *
          (config.amp * 0.55);

      return height * config.baseY + dip - crest + leftLift + organicMotion;
    };

    const ribbonFamilies = [
      {
        primaryColor: '#FBBF24',
        deepColor: '#F59E0B',
        whiteMix: '#FFFBEB',
        auraRgb: '251, 191, 36',
        main: {
          baseY: 0.71,
          dipX: 0.36,
          dipDepth: 56,
          crestX: 0.81,
          crestHeight: 68,
          freq: 7.5,
          speed: 0.018,
          phase: 0.0,
          amp: 12,
        },
        companion: {
          baseY: 0.73,
          dipX: 0.41,
          dipDepth: 42,
          crestX: 0.78,
          crestHeight: 46,
          freq: 8.2,
          speed: 0.014,
          phase: 1.1,
          amp: 10,
        },
      },
      {
        primaryColor: '#A855F7',
        deepColor: '#9333EA',
        whiteMix: '#FAF5FF',
        auraRgb: '168, 85, 247',
        main: {
          baseY: 0.76,
          dipX: 0.33,
          dipDepth: 68,
          crestX: 0.79,
          crestHeight: 42,
          freq: 7.0,
          speed: -0.016,
          phase: 2.1,
          amp: 13,
        },
        companion: {
          baseY: 0.81,
          dipX: 0.28,
          dipDepth: 64,
          crestX: 0.83,
          crestHeight: 28,
          freq: 6.4,
          speed: 0.013,
          phase: 3.4,
          amp: 11,
        },
      },
    ];

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      time += 1;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const step = 6;

      ribbonFamilies.forEach((family) => {
        const mainPts: Array<{ x: number; y: number }> = [];
        const compPts: Array<{ x: number; y: number }> = [];

        for (let x = 0; x <= width; x += step) {
          const normX = x / width;
          mainPts.push({ x, y: getWaveY(normX, height, time, family.main) });
          compPts.push({ x, y: getWaveY(normX, height, time, family.companion) });
        }

        const tracePath = (pts: Array<{ x: number; y: number }>) => {
          ctx.beginPath();
          pts.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          });
        };

        ctx.beginPath();
        mainPts.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        for (let i = compPts.length - 1; i >= 0; i--) {
          ctx.lineTo(compPts[i].x, compPts[i].y);
        }
        ctx.closePath();
        const veilGrad = ctx.createLinearGradient(0, 0, width, 0);
        veilGrad.addColorStop(0.0, `rgba(${family.auraRgb}, 0.16)`);
        veilGrad.addColorStop(0.5, `rgba(${family.auraRgb}, 0.04)`);
        veilGrad.addColorStop(1.0, `rgba(${family.auraRgb}, 0.12)`);
        ctx.fillStyle = veilGrad;
        ctx.fill();

        tracePath(mainPts);
        ctx.strokeStyle = `rgba(${family.auraRgb}, 0.11)`;
        ctx.lineWidth = 48;
        ctx.lineCap = 'round';
        ctx.stroke();

        tracePath(mainPts);
        ctx.strokeStyle = `rgba(${family.auraRgb}, 0.22)`;
        ctx.lineWidth = 20;
        ctx.stroke();

        tracePath(mainPts);
        ctx.strokeStyle = `rgba(${family.auraRgb}, 0.38)`;
        ctx.lineWidth = 8;
        ctx.stroke();

        tracePath(compPts);
        ctx.strokeStyle = `rgba(${family.auraRgb}, 0.18)`;
        ctx.lineWidth = 10;
        ctx.stroke();

        const compGrad = ctx.createLinearGradient(0, 0, width, 0);
        compGrad.addColorStop(0.0, family.whiteMix);
        compGrad.addColorStop(0.5, family.deepColor);
        compGrad.addColorStop(1.0, family.whiteMix);
        tracePath(compPts);
        ctx.strokeStyle = compGrad;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = family.primaryColor;
        ctx.shadowBlur = 12;
        ctx.stroke();

        const mainGrad = ctx.createLinearGradient(0, 0, width, 0);
        mainGrad.addColorStop(0.0, family.whiteMix);
        mainGrad.addColorStop(0.32, family.primaryColor);
        mainGrad.addColorStop(0.8, family.whiteMix);
        mainGrad.addColorStop(1.0, family.primaryColor);
        tracePath(mainPts);
        ctx.strokeStyle = mainGrad;
        ctx.lineWidth = 2.6;
        ctx.shadowColor = family.primaryColor;
        ctx.shadowBlur = 20;
        ctx.stroke();

        const hotCoreGrad = ctx.createLinearGradient(0, 0, width, 0);
        hotCoreGrad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');
        hotCoreGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
        hotCoreGrad.addColorStop(1.0, 'rgba(255, 255, 255, 0.8)');
        tracePath(mainPts);
        ctx.strokeStyle = hotCoreGrad;
        ctx.lineWidth = 1.15;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 10;
        ctx.stroke();
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="font-space min-h-screen bg-[#090511] text-white overflow-hidden antialiased">
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
      `,
        }}
      />

      <div className="w-full bg-[#0D0718] border-b border-[#4C2A66]/40 py-2.5 overflow-hidden">
        <div className="flex items-center whitespace-nowrap animate-marquee">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="inline-flex items-center mx-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] mr-3 shadow-[0_0_6px_#FBBF24]" />
              <span className="font-mono-jb text-xs tracking-wide text-[#D8CEE6]">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <CursorGrid
        cellSize={58}
        color="#FAF8F5"
        gridColor="#EFECE6"
        radius={145}
        falloff="smooth"
        highlight="area"
        holdTime={380}
        fadeDuration={800}
        lineWidth={1}
        maxOpacity={0.68}
        fillOpacity={0.06}
        gridOpacity={0.095}
        gridStyle="lines"
        spotlight={0.52}
        clickPulse={true}
        pulseSpeed={650}
        ambient={0.08}
        edgeFade={0.18}
        intro={true}
        className="min-h-[86vh] flex items-center justify-center"
      >
        <section className="relative w-full min-h-[86vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-24">
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 42% 32% at 50% 40%, rgba(9, 5, 17, 0.72) 0%, rgba(9, 5, 17, 0.35) 55%, transparent 100%)',
            }}
            aria-hidden="true"
          />

          <canvas
            ref={strandsCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-[#130B20]/95 border border-[#FBBF24]/35 mb-8">
              <span className="font-mono-jb text-xs sm:text-sm tracking-wider text-[#FBBF24]">
                AWS x GCET • Student Builder Group
              </span>
            </div>

            <h1 className="font-bold tracking-[-0.03em] leading-[1.12] space-y-2">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[64px] text-white">
                Build with the Cloud.
              </span>
              <span className="block text-3xl sm:text-5xl md:text-[54px] lg:text-[62px] text-[#FBBF24] md:whitespace-nowrap">
                Create Beyond the Classroom
                <span className="text-[#A855F7]">.</span>
              </span>
            </h1>

            <p className="mt-7 max-w-2xl mx-auto text-sm sm:text-base md:text-[17px] text-[#CFC5DC] leading-relaxed font-normal">
              Galgotias College of Engineering &amp; Technology&apos;s official student
              cloud engineering community. Exploring scalable architectures, Amazon
              Bedrock Generative AI, Kubernetes clusters, and certified cloud careers.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/events"
                className="font-mono-jb inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0B0714] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(251,191,36,0.28)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>EXPLORE EVENTS</span>
                <Calendar className="w-4 h-4 stroke-[2.2]" />
              </Link>

              <div className="relative group">
                <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#C084FC] pointer-events-none transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FBBF24] pointer-events-none transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />

                <Link
                  href="/contact"
                  className="font-mono-jb inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#130C22]/95 hover:bg-[#1B1130] text-white border border-[#5B3285] hover:border-[#A855F7] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4 text-[#FBBF24]" />
                  <span>JOIN COMMUNITY</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </CursorGrid>
    </div>
  );
}