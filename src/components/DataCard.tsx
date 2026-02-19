"use client";

import { motion } from "framer-motion";

interface DataCardProps {
    title: string;
    value: string;
    unit?: string;
    subtitle?: string;
    icon: React.ReactNode;
    accentColor: string;
    index: number;
}

export default function DataCard({
    title,
    value,
    unit,
    subtitle,
    icon,
    accentColor,
    index,
}: DataCardProps) {
    return (
        <motion.div
            className="glass-card rounded-lg p-4 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-tertiary tracking-wider uppercase font-medium">
                    {title}
                </span>
                <span
                    className="w-7 h-7 flex items-center justify-center rounded-md"
                    style={{ background: `${accentColor}12` }}
                >
                    {icon}
                </span>
            </div>

            <div className="flex items-baseline gap-1.5">
                <span
                    className="text-2xl font-light font-mono tabular-nums tracking-tight"
                    style={{ color: accentColor }}
                >
                    {value}
                </span>
                {unit && (
                    <span className="text-xs text-text-tertiary font-mono">{unit}</span>
                )}
            </div>

            {subtitle && (
                <span className="text-[11px] text-text-secondary leading-relaxed">
                    {subtitle}
                </span>
            )}
        </motion.div>
    );
}
