"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface ImpactPulseProps {
    score: number; // 0–100
    label: string;
    profileColor: string;
    profileGlow: string;
}

export default function ImpactPulse({
    score,
    label,
    profileColor,
    profileGlow,
}: ImpactPulseProps) {
    const [displayed, setDisplayed] = useState(0);

    useEffect(() => {
        const step = score > displayed ? 1 : -1;
        if (displayed === score) return;
        const timer = setTimeout(() => {
            setDisplayed((prev) => prev + step);
        }, 18);
        return () => clearTimeout(timer);
    }, [score, displayed]);

    const riskLevel = useMemo(() => {
        if (score <= 30) return { text: "Low Risk", color: "var(--accent-safe)" };
        if (score <= 60) return { text: "Moderate", color: "var(--accent-warn)" };
        return { text: "High Risk", color: "var(--accent-hazard)" };
    }, [score]);

    const circumference = 2 * Math.PI * 120;
    const strokeOffset = circumference - (circumference * displayed) / 100;

    const pulseDelay = Math.max(0.4, 2 - (score / 100) * 1.5);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] flex items-center justify-center">
                {/* Pulse rings */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border"
                        style={{
                            borderColor: profileColor,
                            opacity: 0,
                        }}
                        animate={{
                            scale: [1, 1.2 + i * 0.1],
                            opacity: [0.3, 0],
                        }}
                        transition={{
                            duration: pulseDelay + 0.5,
                            repeat: Infinity,
                            delay: i * (pulseDelay / 3),
                            ease: "easeOut",
                        }}
                    />
                ))}

                {/* SVG Ring */}
                <svg
                    className="absolute inset-0 w-full h-full -rotate-90"
                    viewBox="0 0 280 280"
                >
                    {/* Track */}
                    <circle
                        cx="140"
                        cy="140"
                        r="120"
                        fill="none"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="6"
                    />
                    {/* Progress */}
                    <motion.circle
                        cx="140"
                        cy="140"
                        r="120"
                        fill="none"
                        stroke={profileColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        style={{
                            filter: `drop-shadow(0 0 12px ${profileGlow})`,
                            transition: "stroke-dashoffset 0.6s ease, stroke 0.5s ease",
                        }}
                    />
                    {/* Glow dot at end */}
                    <motion.circle
                        cx="140"
                        cy="140"
                        r="120"
                        fill="none"
                        stroke={profileColor}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`3 ${circumference - 3}`}
                        strokeDashoffset={strokeOffset}
                        style={{
                            filter: `drop-shadow(0 0 20px ${profileGlow})`,
                            transition: "stroke-dashoffset 0.6s ease",
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="relative z-10 flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={riskLevel.text}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-1"
                            style={{ color: riskLevel.color }}
                        >
                            {riskLevel.text}
                        </motion.span>
                    </AnimatePresence>

                    <motion.span
                        className="text-6xl md:text-7xl font-light tracking-tight font-mono tabular-nums"
                        style={{ color: profileColor }}
                        animate={{
                            textShadow: [
                                `0 0 20px ${profileGlow}`,
                                `0 0 40px ${profileGlow}`,
                                `0 0 20px ${profileGlow}`,
                            ],
                        }}
                        transition={{ duration: pulseDelay, repeat: Infinity }}
                    >
                        {displayed}
                    </motion.span>

                    <span className="text-[10px] text-text-tertiary tracking-[0.15em] uppercase mt-1">
                        Personal Risk Score
                    </span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p
                    key={label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-text-secondary text-center max-w-xs leading-relaxed"
                >
                    {label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}
