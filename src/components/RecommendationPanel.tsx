"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Recommendation {
    id: string;
    icon: React.ReactNode;
    text: string;
    severity: "safe" | "warn" | "hazard";
}

interface RecommendationPanelProps {
    recommendations: Recommendation[];
}

const severityColor = {
    safe: "var(--accent-safe)",
    warn: "var(--accent-warn)",
    hazard: "var(--accent-hazard)",
};

const severityBg = {
    safe: "rgba(44, 212, 162, 0.06)",
    warn: "rgba(245, 183, 49, 0.06)",
    hazard: "rgba(255, 107, 44, 0.06)",
};

export default function RecommendationPanel({
    recommendations,
}: RecommendationPanelProps) {
    return (
        <div className="glass-card rounded-lg p-4">
            <h3 className="text-sm font-medium text-text-primary tracking-wide mb-3">
                Recommendations
            </h3>

            <AnimatePresence mode="popLayout">
                <div className="flex flex-col gap-2">
                    {recommendations.map((rec, i) => (
                        <motion.div
                            key={rec.id}
                            layout
                            layoutId={rec.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 12 }}
                            transition={{
                                delay: i * 0.06,
                                duration: 0.35,
                                layout: { type: "spring", stiffness: 500, damping: 35 },
                            }}
                            className="flex items-start gap-3 p-3 rounded-md"
                            style={{ background: severityBg[rec.severity] }}
                        >
                            <span
                                className="flex-shrink-0 mt-0.5"
                                style={{ color: severityColor[rec.severity] }}
                            >
                                {rec.icon}
                            </span>
                            <span className="text-xs text-text-secondary leading-relaxed">
                                {rec.text}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </div>
    );
}
