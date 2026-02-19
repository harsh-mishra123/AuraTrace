"use client";

import { motion } from "framer-motion";
import { ActivityIcon } from "./Icons";

export default function Header() {
    return (
        <motion.header
            className="relative z-20 flex items-center justify-between px-5 md:px-8 py-4"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center gap-3">
                {/* Logo mark */}
                <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, rgba(255,107,44,0.15), rgba(44,212,162,0.1))",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}
                >
                    <ActivityIcon size={16} color="var(--accent-hazard)" strokeWidth={1.5} />
                </div>

                <div>
                    <h1 className="text-sm font-semibold tracking-[0.08em] text-text-primary">
                        AURATRACE
                    </h1>
                    <p className="text-[9px] text-text-tertiary tracking-[0.2em] uppercase">
                        Smoke Impact Monitor
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Status dot */}
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-safe opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-safe" />
                    </span>
                    <span className="text-[10px] text-text-tertiary uppercase tracking-wider hidden sm:inline">
                        Monitoring
                    </span>
                </div>

                {/* Time */}
                <div
                    className="glass-card rounded-md px-3 py-1.5 text-[10px] font-mono text-text-secondary tracking-wide"
                >
                    {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    })}
                </div>
            </div>
        </motion.header>
    );
}
