"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ParticleMapProps {
    aqi: number;
}

export default function ParticleMap({ aqi }: ParticleMapProps) {
    const hotspots = useMemo(() => {
        return [
            { x: 25, y: 35, intensity: 0.9, size: 120 },
            { x: 55, y: 25, intensity: 0.6, size: 80 },
            { x: 70, y: 55, intensity: 0.8, size: 100 },
            { x: 40, y: 65, intensity: 0.5, size: 70 },
            { x: 80, y: 30, intensity: 0.4, size: 60 },
            { x: 15, y: 70, intensity: 0.3, size: 50 },
        ];
    }, []);

    const roads = [
        "M 10,40 Q 30,35 50,45 T 90,40",
        "M 20,20 Q 40,30 60,25 T 85,60",
        "M 5,65 Q 25,60 45,70 T 95,55",
        "M 40,10 Q 45,30 42,50 T 50,90",
        "M 65,5 Q 60,25 68,45 T 62,85",
    ];

    const density = Math.min(1, aqi / 200);

    return (
        <div className="glass-card rounded-lg overflow-hidden relative">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-text-primary tracking-wide">
                        Smoke Density Map
                    </h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">
                        Real-time particulate distribution
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-safe animate-pulse" />
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
                        Live
                    </span>
                </div>
            </div>

            <div className="relative h-[280px] md:h-[340px] map-grid">
                {/* Roads */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {roads.map((d, i) => (
                        <path
                            key={i}
                            d={d}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="0.3"
                        />
                    ))}
                </svg>

                {/* Location markers */}
                <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {[
                        { x: 30, y: 40, label: "Downtown" },
                        { x: 60, y: 30, label: "Industrial" },
                        { x: 75, y: 60, label: "Suburb" },
                    ].map((loc, i) => (
                        <g key={i}>
                            <circle
                                cx={loc.x}
                                cy={loc.y}
                                r="0.8"
                                fill="var(--text-secondary)"
                            />
                            <text
                                x={loc.x}
                                y={loc.y - 2}
                                fill="var(--text-tertiary)"
                                fontSize="2.2"
                                textAnchor="middle"
                                fontFamily="var(--font-sans)"
                            >
                                {loc.label}
                            </text>
                        </g>
                    ))}
                </svg>

                {/* Heat zones */}
                {hotspots.map((spot, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            left: `${spot.x}%`,
                            top: `${spot.y}%`,
                            width: spot.size * density,
                            height: spot.size * density,
                            transform: "translate(-50%, -50%)",
                            background: `radial-gradient(circle, rgba(255,107,44,${spot.intensity * density * 0.3
                                }) 0%, rgba(255,107,44,0) 70%)`,
                        }}
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Heat shimmer overlay */}
                <div
                    className="absolute inset-0 heat-shimmer pointer-events-none"
                    style={{ opacity: density * 0.8 }}
                />

                {/* AQI Badge */}
                <div className="absolute bottom-3 left-3 glass-card rounded-md px-3 py-2 flex items-center gap-2">
                    <div
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{
                            background:
                                aqi > 150
                                    ? "var(--accent-hazard)"
                                    : aqi > 50
                                        ? "var(--accent-warn)"
                                        : "var(--accent-safe)",
                        }}
                    />
                    <div>
                        <span className="text-[10px] text-text-tertiary block uppercase tracking-wider">
                            AQI
                        </span>
                        <span className="text-sm font-mono font-medium text-text-primary">
                            {aqi}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-3 right-3 glass-card rounded-md px-3 py-2">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1.5 rounded-full bg-accent-safe opacity-60" />
                            <span className="text-[9px] text-text-tertiary">Low</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1.5 rounded-full bg-accent-warn opacity-60" />
                            <span className="text-[9px] text-text-tertiary">Med</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-1.5 rounded-full bg-accent-hazard opacity-60" />
                            <span className="text-[9px] text-text-tertiary">High</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
