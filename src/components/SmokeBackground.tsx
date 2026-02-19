"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  life: number;
  maxLife: number;
  phase: number;
}

interface SmokeBackgroundProps {
  aqi: number; // 0–500
}

export default function SmokeBackground({ aqi }: SmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const aqiRef = useRef(aqi);

  aqiRef.current = aqi;

  const densityFromAqi = useCallback((val: number) => {
    return Math.min(1, Math.max(0.05, val / 300));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", resize);

    const createParticle = (): Particle => {
      const density = densityFromAqi(aqiRef.current);
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.15 - 0.05,
        radius: Math.random() * 80 + 30 + density * 60,
        opacity: 0,
        life: 0,
        maxLife: Math.random() * 400 + 200,
        phase: Math.random() * Math.PI * 2,
      };
    };

    const maxParticles = 50;
    particlesRef.current = Array.from({ length: maxParticles }, createParticle);

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const density = densityFromAqi(aqiRef.current);

      const activeCount = Math.floor(maxParticles * density);

      particlesRef.current.forEach((p, i) => {
        if (i >= activeCount) {
          p.opacity *= 0.95;
          if (p.opacity < 0.001) return;
        }

        p.life++;
        const lifeRatio = p.life / p.maxLife;

        if (lifeRatio < 0.15) {
          p.opacity = (lifeRatio / 0.15) * density * 0.12;
        } else if (lifeRatio > 0.85) {
          p.opacity = ((1 - lifeRatio) / 0.15) * density * 0.12;
        } else {
          p.opacity = density * 0.12;
        }

        const wobble = Math.sin(p.life * 0.008 + p.phase) * 0.4;
        p.x += p.vx + wobble;
        p.y += p.vy;

        if (p.life >= p.maxLife) {
          Object.assign(p, createParticle());
          p.life = 0;
        }

        if (p.x < -p.radius) p.x = w + p.radius;
        if (p.x > w + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = h + p.radius;

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius
        );

        const hazardMix = Math.min(1, aqiRef.current / 200);
        const r = Math.floor(120 + hazardMix * 80);
        const g = Math.floor(120 + hazardMix * 20);
        const b = Math.floor(130 - hazardMix * 40);

        gradient.addColorStop(0, `rgba(${r},${g},${b},${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(${r},${g},${b},${p.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [densityFromAqi]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
