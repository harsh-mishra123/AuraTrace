"use client";

import { motion } from "framer-motion";
import { useMemo, useRef } from "react";

interface ForecastPoint {
    hour: string;
    strain: number; // 0–100
    aqi: number;
}

interface HealthForecastProps {
    data: ForecastPoint[];
    accentColor: string;
    accentGlow: string;
}

export default function HealthForecast({
    data,
    accentColor,
    accentGlow,
}: HealthForecastProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const svgWidth = Math.max(600, data.length * 70);
    const svgHeight = 120;
    const padding = { top: 15, bottom: 25, left: 10, right: 10 };
    const chartW = svgWidth - padding.left - padding.right;
    const chartH = svgHeight - padding.top - padding.bottom;

    const pathData = useMemo(() => {
        if (data.length < 2) return "";

        const points = data.map((d, i) => ({
            x: padding.left + (i / (data.length - 1)) * chartW,
            y: padding.top + chartH - (d.strain / 100) * chartH,
        }));

        // Smooth curve
        let path = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
            const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
            path += ` C ${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
        }
        return path;
    }, [data, chartW, chartH, padding.left, padding.top]);

    const areaPath = useMemo(() => {
        if (!pathData) return "";
        const lastX = padding.left + chartW;
        const firstX = padding.left;
        const bottomY = padding.top + chartH;
        return `${pathData} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
    }, [pathData, chartW, chartH, padding.left, padding.top]);

    return (
        <div className="glass-card rounded-lg overflow-hidden">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-text-primary tracking-wide">
                        Health Forecast
                    </h3>
                    <p className="text-[11px] text-text-tertiary mt-0.5">
                        Respiratory strain prediction · Next 12 hours
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="text-text-tertiary"
                    >
                        <path d="M12 6v6l4 2" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
                        12h
                    </span>
                </div>
            </div>

            <div ref={scrollRef} className="timeline-scroll overflow-x-auto px-2 pb-4">
                <svg
                    width={svgWidth}
                    height={svgHeight}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="block"
                >
                    <defs>
                        <linearGradient
                            id="forecast-gradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop offset="0%" stopColor={accentColor} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow-filter">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((val) => {
                        const y = padding.top + chartH - (val / 100) * chartH;
                        return (
                            <line
                                key={val}
                                x1={padding.left}
                                y1={y}
                                x2={svgWidth - padding.right}
                                y2={y}
                                stroke="rgba(255,255,255,0.03)"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Fill area */}
                    <motion.path
                        d={areaPath}
                        fill="url(#forecast-gradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                    />

                    {/* Glowing line */}
                    <motion.path
                        d={pathData}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow-filter)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />

                    {/* Data points */}
                    {data.map((d, i) => {
                        const x = padding.left + (i / (data.length - 1)) * chartW;
                        const y = padding.top + chartH - (d.strain / 100) * chartH;
                        return (
                            <g key={i}>
                                <motion.circle
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill={accentColor}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.15 * i, duration: 0.3 }}
                                    style={{
                                        filter: `drop-shadow(0 0 6px ${accentGlow})`,
                                    }}
                                />
                                <text
                                    x={x}
                                    y={svgHeight - 5}
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="var(--text-tertiary)"
                                    fontFamily="var(--font-mono)"
                                >
                                    {d.hour}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
