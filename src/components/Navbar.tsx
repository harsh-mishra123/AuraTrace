"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ActivityIcon } from "./Icons";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/docs", label: "Docs" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div
                className="mx-4 md:mx-8 mt-4 rounded-xl px-5 py-3 flex items-center justify-between"
                style={{
                    background: "rgba(15, 17, 20, 0.7)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255,107,44,0.2), rgba(44,212,162,0.12))",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <ActivityIcon size={15} color="var(--accent-hazard)" strokeWidth={1.5} />
                    </div>
                    <div>
                        <span className="text-sm font-semibold tracking-[0.08em] text-text-primary block leading-tight">
                            AURATRACE
                        </span>
                        <span className="text-[8px] text-text-tertiary tracking-[0.2em] uppercase">
                            Smoke Impact Monitor
                        </span>
                    </div>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`
                  relative px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase rounded-lg transition-colors duration-200
                  ${isActive ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"}
                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute inset-0 rounded-lg"
                                        style={{ background: "rgba(255,255,255,0.06)" }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Status */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-safe opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-safe" />
                        </span>
                        <span className="text-[10px] text-text-tertiary uppercase tracking-wider hidden md:inline">
                            Live
                        </span>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
