"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export interface Profile {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface ProfileToggleProps {
    profiles: Profile[];
    activeId: string;
    onChange: (id: string) => void;
}

export default function ProfileToggle({
    profiles,
    activeId,
    onChange,
}: ProfileToggleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const activeIndex = profiles.findIndex((p) => p.id === activeId);
        const buttons = container.querySelectorAll<HTMLButtonElement>("[data-segment]");
        const btn = buttons[activeIndex];
        if (btn) {
            setIndicator({
                left: btn.offsetLeft,
                width: btn.offsetWidth,
            });
        }
    }, [activeId, profiles]);

    return (
        <div
            ref={containerRef}
            className="relative inline-flex p-1 rounded-lg"
            style={{ background: "rgba(255,255,255,0.04)" }}
        >
            {/* Sliding indicator */}
            <motion.div
                className="absolute top-1 bottom-1 rounded-md"
                style={{
                    background: "rgba(255,255,255,0.08)",
                    boxShadow: "0 0 20px rgba(255,255,255,0.03)",
                }}
                animate={{
                    left: indicator.left,
                    width: indicator.width,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                }}
            />

            {profiles.map((profile) => (
                <button
                    key={profile.id}
                    data-segment
                    onClick={() => onChange(profile.id)}
                    className={`
            relative z-10 flex items-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wide uppercase transition-colors duration-200
            ${activeId === profile.id ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}
          `}
                >
                    <span className="w-4 h-4 flex items-center justify-center">
                        {profile.icon}
                    </span>
                    <span className="hidden sm:inline">{profile.label}</span>
                </button>
            ))}
        </div>
    );
}
