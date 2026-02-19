"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ActivityIcon,
    LungIcon,
    ElderlyIcon,
    InfantIcon,
    ShieldIcon,
    WindIcon,
    EyeIcon,
    ThermometerIcon,
    DropletIcon,
    AlertIcon,
    MaskIcon,
    HomeIcon,
} from "@/components/Icons";

/* ─── Helpers ───────────────────────────────────────────── */
function SectionAnchor({ id }: { id: string }) {
    return <div id={id} className="scroll-mt-28" />;
}

function DocSection({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            className={`mb-16 md:mb-20 ${className}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

function H2({
    children,
    accent = "var(--accent-hazard)",
}: {
    children: React.ReactNode;
    accent?: string;
}) {
    return (
        <h2 className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-text-primary tracking-tight mb-4">
            <span className="w-1 h-6 rounded-full flex-shrink-0" style={{ background: accent }} />
            {children}
        </h2>
    );
}

function H3({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="text-sm md:text-base font-semibold text-text-primary tracking-wide mb-2 mt-8">
            {children}
        </h3>
    );
}

function P({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-sm text-text-secondary leading-[1.8] mb-4">{children}</p>
    );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
    return (
        <div className="glass-card rounded-lg overflow-hidden my-4">
            {title && (
                <div className="px-4 py-2 border-b border-border-subtle flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent-hazard/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-accent-warn/40" />
                        <span className="w-2.5 h-2.5 rounded-full bg-accent-safe/40" />
                    </div>
                    <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider ml-2">
                        {title}
                    </span>
                </div>
            )}
            <pre className="p-4 overflow-x-auto text-xs font-mono text-text-secondary leading-relaxed">
                <code>{children}</code>
            </pre>
        </div>
    );
}

function InfoCard({
    icon,
    title,
    children,
    accent,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    accent: string;
}) {
    return (
        <div className="glass-card rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
                <div
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ background: `${accent}12` }}
                >
                    {icon}
                </div>
                <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
            </div>
            <div className="text-xs text-text-secondary leading-[1.8]">{children}</div>
        </div>
    );
}

function TableRow({
    cells,
    isHeader = false,
}: {
    cells: string[];
    isHeader?: boolean;
}) {
    const Tag = isHeader ? "th" : "td";
    return (
        <tr className={isHeader ? "border-b border-border-subtle" : "border-b border-border-subtle/50"}>
            {cells.map((cell, i) => (
                <Tag
                    key={i}
                    className={`
            px-4 py-3 text-left text-xs
            ${isHeader ? "text-text-tertiary uppercase tracking-wider font-medium" : "text-text-secondary"}
            ${i === 0 ? "font-mono" : ""}
          `}
                >
                    {cell}
                </Tag>
            ))}
        </tr>
    );
}

/* ─── Sidebar nav config ────────────────────────────────── */
const sidebarSections = [
    {
        group: "Getting Started",
        items: [
            { id: "overview", label: "Overview" },
            { id: "quick-start", label: "Quick Start" },
            { id: "architecture", label: "Architecture" },
        ],
    },
    {
        group: "Core Concepts",
        items: [
            { id: "risk-scoring", label: "Risk Scoring" },
            { id: "health-profiles", label: "Health Profiles" },
            { id: "air-quality", label: "Air Quality Index" },
        ],
    },
    {
        group: "Features",
        items: [
            { id: "impact-pulse", label: "Impact Pulse" },
            { id: "smoke-map", label: "Smoke Density Map" },
            { id: "health-forecast", label: "Health Forecast" },
            { id: "recommendations", label: "Recommendations" },
        ],
    },
    {
        group: "Reference",
        items: [
            { id: "api-endpoints", label: "API Endpoints" },
            { id: "data-sources", label: "Data Sources" },
            { id: "faq", label: "FAQ" },
        ],
    },
];

/* ─── Page ──────────────────────────────────────────────── */
export default function DocsPage() {
    return (
        <div className="relative min-h-screen pt-24">
            {/* Subtle background glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 30% at 20% 20%, rgba(44,212,162,0.03) 0%, transparent 70%), radial-gradient(ellipse 50% 30% at 80% 80%, rgba(255,107,44,0.03) 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-8 flex gap-10">
                {/* ── Sidebar ──────────────────────────────────── */}
                <aside className="hidden lg:block w-56 flex-shrink-0">
                    <div className="sticky top-28">
                        <nav className="flex flex-col gap-6">
                            {sidebarSections.map((section) => (
                                <div key={section.group}>
                                    <span className="text-[10px] text-text-tertiary uppercase tracking-[0.15em] font-medium block mb-2 pl-3">
                                        {section.group}
                                    </span>
                                    <ul className="flex flex-col gap-0.5">
                                        {section.items.map((item) => (
                                            <li key={item.id}>
                                                <a
                                                    href={`#${item.id}`}
                                                    className="block px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-white/4 rounded-md transition-colors"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document
                                                            .getElementById(item.id)
                                                            ?.scrollIntoView({ behavior: "smooth" });
                                                    }}
                                                >
                                                    {item.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div className="border-t border-border-subtle pt-4 mt-2">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-accent-hazard hover:bg-white/4 rounded-md transition-colors"
                                >
                                    <ActivityIcon size={12} color="var(--accent-hazard)" />
                                    Open Dashboard →
                                </Link>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* ── Main content ─────────────────────────────── */}
                <main className="flex-1 min-w-0 pb-24">
                    {/* Hero banner */}
                    <motion.div
                        className="glass-card rounded-lg p-8 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <div
                                className="w-6 h-6 rounded flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(255,107,44,0.2), rgba(44,212,162,0.12))",
                                }}
                            >
                                <ActivityIcon size={12} color="var(--accent-hazard)" />
                            </div>
                            <span className="text-[10px] text-text-tertiary uppercase tracking-[0.15em]">
                                Documentation
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-semibold text-text-primary tracking-tight mb-3">
                            AuraTrace Documentation
                        </h1>
                        <p className="text-sm md:text-base text-text-secondary max-w-xl leading-relaxed">
                            Everything you need to understand, deploy, and integrate the
                            AuraTrace real-time smoke impact monitoring platform.
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                            <span className="glass-card rounded-md px-3 py-1.5 text-[10px] font-mono text-text-tertiary">
                                v2.4.1
                            </span>
                            <span className="text-[10px] text-text-tertiary">
                                Last updated: Feb 2026
                            </span>
                        </div>
                    </motion.div>

                    {/* ─── OVERVIEW ──────────────────────────────── */}
                    <SectionAnchor id="overview" />
                    <DocSection>
                        <H2 accent="var(--accent-hazard)">Overview</H2>
                        <P>
                            AuraTrace is a real-time atmospheric monitoring and health risk
                            assessment platform. It ingests data from particulate sensors,
                            satellite imagery, and meteorological stations to compute
                            personalized health risk scores for vulnerable populations —
                            people with respiratory conditions, elderly individuals, and
                            infants.
                        </P>
                        <P>
                            The platform operates on a simple principle: air quality data is
                            meaningless without context. A PM2.5 reading of 55 µg/m³ means
                            something very different to a healthy adult than it does to an
                            infant or someone with severe asthma. AuraTrace bridges that gap
                            by translating raw atmospheric data into actionable, personalized
                            health guidance.
                        </P>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <InfoCard
                                icon={<ActivityIcon size={14} color="var(--accent-hazard)" />}
                                title="Real-time Scoring"
                                accent="var(--accent-hazard)"
                            >
                                Personal risk scores updated every 60 seconds based on live
                                atmospheric conditions and your health profile.
                            </InfoCard>
                            <InfoCard
                                icon={<WindIcon size={14} color="var(--accent-warn)" />}
                                title="Predictive Models"
                                accent="var(--accent-warn)"
                            >
                                12-hour health forecasts powered by meteorological models and
                                historical pattern data for proactive protection.
                            </InfoCard>
                            <InfoCard
                                icon={<ShieldIcon size={14} color="var(--accent-safe)" />}
                                title="Actionable Safety"
                                accent="var(--accent-safe)"
                            >
                                Profile-specific recommendations with severity grading — not
                                generic advice, but guidance tuned to your vulnerability.
                            </InfoCard>
                        </div>
                    </DocSection>

                    {/* ─── QUICK START ───────────────────────────── */}
                    <SectionAnchor id="quick-start" />
                    <DocSection>
                        <H2 accent="var(--accent-safe)">Quick Start</H2>
                        <P>
                            Get AuraTrace running locally in under two minutes. The platform
                            is built with Next.js 16, Tailwind CSS v4, and Framer Motion.
                        </P>

                        <H3>Installation</H3>
                        <CodeBlock title="terminal">
                            {`# Clone the repository
git clone https://github.com/auratrace/auratrace.git
cd auratrace

# Install dependencies
npm install

# Start the development server
npm run dev`}
                        </CodeBlock>
                        <P>
                            Navigate to <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 font-mono text-accent-safe">http://localhost:3000</code> to
                            see the landing page. The dashboard is available at <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 font-mono text-accent-safe">/dashboard</code>.
                        </P>

                        <H3>Project Structure</H3>
                        <CodeBlock title="file tree">
                            {`auratrace/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Landing homepage
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Main monitoring dashboard
│   │   ├── docs/
│   │   │   └── page.tsx        # Documentation (this page)
│   │   ├── layout.tsx          # Root layout with Navbar
│   │   └── globals.css         # Design system & animations
│   └── components/
│       ├── SmokeBackground.tsx # Canvas particle system
│       ├── ImpactPulse.tsx     # Circular risk gauge
│       ├── ProfileToggle.tsx   # Health profile switcher
│       ├── ParticleMap.tsx     # Smoke density map
│       ├── HealthForecast.tsx  # SVG timeline chart
│       ├── DataCard.tsx        # Environmental data card
│       ├── RecommendationPanel.tsx
│       ├── MobileBottomSheet.tsx
│       ├── Navbar.tsx          # Shared navigation
│       ├── Icons.tsx           # Custom icon set
│       └── Header.tsx          # Dashboard header
└── package.json`}
                        </CodeBlock>
                    </DocSection>

                    {/* ─── ARCHITECTURE ──────────────────────────── */}
                    <SectionAnchor id="architecture" />
                    <DocSection>
                        <H2 accent="var(--accent-warn)">Architecture</H2>
                        <P>
                            AuraTrace follows a layered architecture designed for real-time
                            data processing and responsive UI delivery:
                        </P>

                        <div className="glass-card rounded-lg p-6 my-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                {[
                                    { layer: "Data Layer", desc: "Sensor APIs, satellite feeds, weather stations", color: "var(--accent-safe)" },
                                    { layer: "Processing", desc: "Particulate modeling, dispersion analysis, correlation", color: "var(--accent-warn)" },
                                    { layer: "Risk Engine", desc: "Profile-adjusted scoring, forecast generation", color: "var(--accent-hazard)" },
                                    { layer: "Presentation", desc: "Next.js frontend, Canvas animations, SVG charts", color: "var(--accent-hazard)" },
                                ].map((item, i) => (
                                    <div key={item.layer} className="relative">
                                        {i < 3 && (
                                            <div className="hidden md:block absolute top-1/2 -right-2 w-4 text-text-tertiary text-xs">→</div>
                                        )}
                                        <div
                                            className="w-3 h-3 rounded-full mx-auto mb-2"
                                            style={{ background: item.color }}
                                        />
                                        <span className="text-xs font-semibold text-text-primary block mb-1">
                                            {item.layer}
                                        </span>
                                        <span className="text-[10px] text-text-tertiary leading-tight">
                                            {item.desc}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <P>
                            The frontend uses a canvas-based particle system for the ambient
                            smoke background, which responds dynamically to the current AQI
                            value. Higher AQI increases particle density, opacity, and
                            warm-hue mixing. All UI transitions use Framer Motion with
                            spring physics for organic movement.
                        </P>
                    </DocSection>

                    {/* ─── RISK SCORING ──────────────────────────── */}
                    <SectionAnchor id="risk-scoring" />
                    <DocSection>
                        <H2 accent="var(--accent-hazard)">Risk Scoring</H2>
                        <P>
                            The Personal Risk Score (0–100) is the core metric of AuraTrace.
                            It represents the combined health impact of current atmospheric
                            conditions on a specific health profile. The score drives the
                            Impact Pulse visualization and determines the severity of
                            recommendations.
                        </P>

                        <H3>Score Ranges</H3>
                        <div className="glass-card rounded-lg overflow-hidden my-4">
                            <table className="w-full">
                                <thead>
                                    <TableRow cells={["Range", "Level", "Visual", "Response"]} isHeader />
                                </thead>
                                <tbody>
                                    <TableRow cells={["0–30", "Low Risk", "Teal glow, slow pulse", "Normal outdoor activity"]} />
                                    <TableRow cells={["31–60", "Moderate", "Amber glow, medium pulse", "Limit extended exposure"]} />
                                    <TableRow cells={["61–100", "High Risk", "Orange glow, rapid pulse", "Stay indoors, activate filtration"]} />
                                </tbody>
                            </table>
                        </div>

                        <H3>Calculation Factors</H3>
                        <P>
                            The risk score is computed from multiple weighted inputs:
                        </P>
                        <CodeBlock title="risk model">
                            {`RiskScore = (
  PM2.5_weight × PM2.5_normalized +
  Temperature_weight × Heat_index +
  Humidity_weight × Dryness_factor +
  Wind_weight × Dispersion_factor
) × Profile_multiplier

// Profile multipliers:
// Asthma:  1.4x (heightened PM2.5 sensitivity)
// Elderly: 1.2x (cardiovascular compound)
// Infant:  1.6x (developing lung vulnerability)`}
                        </CodeBlock>
                    </DocSection>

                    {/* ─── HEALTH PROFILES ───────────────────────── */}
                    <SectionAnchor id="health-profiles" />
                    <DocSection>
                        <H2 accent="var(--accent-safe)">Health Profiles</H2>
                        <P>
                            AuraTrace supports three vulnerable population profiles. Each
                            profile adjusts the risk scoring model, changes the visual
                            presentation, and tailors recommendations to the specific health
                            concerns of that population.
                        </P>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            {[
                                {
                                    icon: <LungIcon size={18} color="var(--accent-hazard)" />,
                                    title: "Asthma Profile",
                                    accent: "var(--accent-hazard)",
                                    details: [
                                        "Heightened PM2.5 sensitivity weighting (1.4×)",
                                        "Bronchospasm trigger monitoring",
                                        "Rescue inhaler timing recommendations",
                                        "Peak flow prediction based on particulate trends",
                                    ],
                                },
                                {
                                    icon: <ElderlyIcon size={18} color="var(--accent-warn)" />,
                                    title: "Elderly Profile",
                                    accent: "var(--accent-warn)",
                                    details: [
                                        "Cardiovascular compound risk model (1.2×)",
                                        "Blood pressure correlation tracking",
                                        "Activity-level adjustment guidance",
                                        "Heat-smoke compound stress analysis",
                                    ],
                                },
                                {
                                    icon: <InfantIcon size={18} color="var(--accent-safe)" />,
                                    title: "Infant Profile",
                                    accent: "var(--accent-safe)",
                                    details: [
                                        "Developing lung vulnerability factor (1.6×)",
                                        "Caregiver-focused alert system",
                                        "Indoor environment optimization",
                                        "Respiratory rate monitoring guidance",
                                    ],
                                },
                            ].map((profile) => (
                                <div key={profile.title} className="glass-card rounded-lg p-5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="w-9 h-9 rounded-lg flex items-center justify-center"
                                            style={{ background: `${profile.accent}12` }}
                                        >
                                            {profile.icon}
                                        </div>
                                        <h4 className="text-sm font-semibold text-text-primary">
                                            {profile.title}
                                        </h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {profile.details.map((detail, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2 text-xs text-text-secondary leading-relaxed"
                                            >
                                                <span
                                                    className="w-1 h-1 rounded-full flex-shrink-0 mt-1.5"
                                                    style={{ background: profile.accent }}
                                                />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </DocSection>

                    {/* ─── AIR QUALITY INDEX ─────────────────────── */}
                    <SectionAnchor id="air-quality" />
                    <DocSection>
                        <H2 accent="var(--accent-warn)">Air Quality Index</H2>
                        <P>
                            AuraTrace uses a composite Air Quality Index (AQI) that synthesizes
                            multiple pollutant measurements into a single 0–500 score. The AQI
                            drives the smoke particle background density and map heat zones.
                        </P>

                        <div className="glass-card rounded-lg overflow-hidden my-4">
                            <table className="w-full">
                                <thead>
                                    <TableRow cells={["AQI Range", "Category", "PM2.5 (µg/m³)", "Health Impact"]} isHeader />
                                </thead>
                                <tbody>
                                    <TableRow cells={["0–50", "Good", "0–12", "Minimal to no risk"]} />
                                    <TableRow cells={["51–100", "Moderate", "12.1–35.4", "Sensitive groups may notice effects"]} />
                                    <TableRow cells={["101–150", "Unhealthy (Sensitive)", "35.5–55.4", "Increased risk for vulnerable populations"]} />
                                    <TableRow cells={["151–200", "Unhealthy", "55.5–150.4", "All individuals may experience health effects"]} />
                                    <TableRow cells={["201–300", "Very Unhealthy", "150.5–250.4", "Serious health effects for entire population"]} />
                                    <TableRow cells={["301–500", "Hazardous", "250.5–500.4", "Emergency conditions — full avoidance"]} />
                                </tbody>
                            </table>
                        </div>
                    </DocSection>

                    {/* ─── IMPACT PULSE ──────────────────────────── */}
                    <SectionAnchor id="impact-pulse" />
                    <DocSection>
                        <H2 accent="var(--accent-hazard)">Impact Pulse</H2>
                        <P>
                            The Impact Pulse is the centerpiece visualization — a circular
                            gauge that communicates risk through multiple visual channels
                            simultaneously:
                        </P>
                        <ul className="space-y-3 my-4">
                            {[
                                { label: "Ring Progress", desc: "SVG arc fills proportionally to the risk score (0–100%)" },
                                { label: "Pulse Rate", desc: "The heartbeat animation speeds up as risk increases — high risk pulses at 0.5s intervals, low risk at 2s" },
                                { label: "Glow Intensity", desc: "Drop-shadow filter scales from subtle to intense based on score" },
                                { label: "Color Coding", desc: "Teal (safe) → Amber (moderate) → Orange (high risk)" },
                                { label: "Score Counter", desc: "Animated number counter ticks up with 18ms frame intervals" },
                            ].map((item) => (
                                <li key={item.label} className="flex items-start gap-3 text-sm">
                                    <span className="text-xs font-mono text-accent-hazard font-medium w-28 flex-shrink-0 mt-0.5">
                                        {item.label}
                                    </span>
                                    <span className="text-xs text-text-secondary leading-relaxed">
                                        {item.desc}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </DocSection>

                    {/* ─── SMOKE MAP ─────────────────────────────── */}
                    <SectionAnchor id="smoke-map" />
                    <DocSection>
                        <H2 accent="var(--accent-warn)">Smoke Density Map</H2>
                        <P>
                            The map visualization provides spatial context for smoke distribution.
                            It uses a dark-mode grid overlay with animated radial gradient heat
                            zones that pulse and scale based on the current AQI. A CSS
                            heat-shimmer animation overlays the entire map for atmospheric depth.
                        </P>

                        <H3>Heat Zone Properties</H3>
                        <div className="glass-card rounded-lg overflow-hidden my-4">
                            <table className="w-full">
                                <thead>
                                    <TableRow cells={["Property", "Value", "Behavior"]} isHeader />
                                </thead>
                                <tbody>
                                    <TableRow cells={["Center", "% coordinates", "Fixed positions on the map grid"]} />
                                    <TableRow cells={["Intensity", "0.3–0.9", "Opacity multiplier for the radial gradient"]} />
                                    <TableRow cells={["Size", "50–120px", "Base radius × AQI density factor"]} />
                                    <TableRow cells={["Animation", "3–6s cycle", "Scale & opacity oscillation per zone"]} />
                                </tbody>
                            </table>
                        </div>
                    </DocSection>

                    {/* ─── HEALTH FORECAST ────────────────────────── */}
                    <SectionAnchor id="health-forecast" />
                    <DocSection>
                        <H2 accent="var(--accent-safe)">Health Forecast</H2>
                        <P>
                            The 12-hour forecast uses a custom SVG line chart with Bézier curve
                            smoothing. The chart features a glowing stroke with a gaussian blur
                            filter, animated path drawing via <code className="text-xs px-1.5 py-0.5 rounded bg-white/5 font-mono text-accent-safe">pathLength</code>,
                            and a gradient fill area beneath the curve.
                        </P>
                        <P>
                            Forecast data is derived from meteorological wind models, historical
                            AQI patterns, and atmospheric dispersion simulations. Each data point
                            includes both the predicted respiratory strain percentage and the
                            expected AQI value at that future hour.
                        </P>
                    </DocSection>

                    {/* ─── RECOMMENDATIONS ────────────────────────── */}
                    <SectionAnchor id="recommendations" />
                    <DocSection>
                        <H2 accent="var(--accent-safe)">Recommendations</H2>
                        <P>
                            Recommendations are severity-graded (safe, warn, hazard) and
                            personalized to the active health profile. They use Framer Motion
                            layout animations for smooth enter/exit transitions when profiles
                            switch.
                        </P>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {[
                                { sev: "Safe", color: "var(--accent-safe)", icon: <ShieldIcon size={14} color="var(--accent-safe)" />, desc: "General precautionary guidance. Maintain current protection level." },
                                { sev: "Warning", color: "var(--accent-warn)", icon: <AlertIcon size={14} color="var(--accent-warn)" />, desc: "Active environmental countermeasures recommended. Seal windows, filtration." },
                                { sev: "Hazard", color: "var(--accent-hazard)", icon: <MaskIcon size={14} color="var(--accent-hazard)" />, desc: "Immediate protective action required. Avoid outdoor exposure entirely." },
                            ].map((r) => (
                                <div key={r.sev} className="glass-card rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        {r.icon}
                                        <span className="text-xs font-semibold" style={{ color: r.color }}>{r.sev}</span>
                                    </div>
                                    <p className="text-[11px] text-text-secondary leading-relaxed">{r.desc}</p>
                                </div>
                            ))}
                        </div>
                    </DocSection>

                    {/* ─── API ENDPOINTS ──────────────────────────── */}
                    <SectionAnchor id="api-endpoints" />
                    <DocSection>
                        <H2 accent="var(--accent-hazard)">API Endpoints</H2>
                        <P>
                            AuraTrace exposes a RESTful API for programmatic access to risk
                            scores, forecasts, and atmospheric data.
                        </P>

                        <div className="space-y-3 my-4">
                            {[
                                { method: "GET", path: "/api/risk/:profileId", desc: "Current risk score for a health profile" },
                                { method: "GET", path: "/api/aqi", desc: "Current composite AQI and component readings" },
                                { method: "GET", path: "/api/forecast/:profileId", desc: "12-hour strain forecast for a profile" },
                                { method: "GET", path: "/api/map/zones", desc: "Active heat zone coordinates and intensities" },
                                { method: "GET", path: "/api/recommendations/:profileId", desc: "Current safety recommendations" },
                                { method: "POST", path: "/api/alerts/subscribe", desc: "Subscribe to threshold-based push alerts" },
                            ].map((ep) => (
                                <div key={ep.path} className="glass-card rounded-lg px-4 py-3 flex items-center gap-4">
                                    <span
                                        className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                                        style={{
                                            background: ep.method === "GET" ? "rgba(44,212,162,0.1)" : "rgba(255,107,44,0.1)",
                                            color: ep.method === "GET" ? "var(--accent-safe)" : "var(--accent-hazard)",
                                        }}
                                    >
                                        {ep.method}
                                    </span>
                                    <code className="text-xs font-mono text-text-primary flex-1">{ep.path}</code>
                                    <span className="text-[11px] text-text-tertiary hidden md:inline">{ep.desc}</span>
                                </div>
                            ))}
                        </div>

                        <H3>Example Request</H3>
                        <CodeBlock title="curl">
                            {`curl -X GET https://api.auratrace.io/v1/risk/asthma \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Response
{
  "profile": "asthma",
  "riskScore": 72,
  "level": "high",
  "aqi": 168,
  "pm25": 58.4,
  "updatedAt": "2026-02-19T02:30:00Z"
}`}
                        </CodeBlock>
                    </DocSection>

                    {/* ─── DATA SOURCES ──────────────────────────── */}
                    <SectionAnchor id="data-sources" />
                    <DocSection>
                        <H2 accent="var(--accent-warn)">Data Sources</H2>
                        <P>
                            AuraTrace aggregates data from multiple authoritative sources to
                            ensure accuracy and coverage:
                        </P>
                        <div className="glass-card rounded-lg overflow-hidden my-4">
                            <table className="w-full">
                                <thead>
                                    <TableRow cells={["Source", "Data Type", "Update Frequency"]} isHeader />
                                </thead>
                                <tbody>
                                    <TableRow cells={["EPA AirNow", "PM2.5, PM10, Ozone", "Hourly"]} />
                                    <TableRow cells={["PurpleAir Network", "Real-time PM2.5", "~2 minutes"]} />
                                    <TableRow cells={["NOAA HRRR", "Wind, temperature, humidity", "Hourly"]} />
                                    <TableRow cells={["NASA FIRMS", "Active fire/smoke plume detection", "~3 hours"]} />
                                    <TableRow cells={["OpenWeatherMap", "Local weather conditions", "10 minutes"]} />
                                </tbody>
                            </table>
                        </div>
                    </DocSection>

                    {/* ─── FAQ ───────────────────────────────────── */}
                    <SectionAnchor id="faq" />
                    <DocSection>
                        <H2 accent="var(--accent-safe)">Frequently Asked Questions</H2>

                        {[
                            {
                                q: "Is AuraTrace a medical device?",
                                a: "No. AuraTrace is an environmental monitoring and information tool. It does not provide medical diagnoses. Always consult healthcare providers for medical decisions.",
                            },
                            {
                                q: "How accurate is the risk score?",
                                a: "Risk scores are based on EPA air quality standards and peer-reviewed health impact research. However, individual sensitivity varies. Use scores as directional guidance, not absolute medical thresholds.",
                            },
                            {
                                q: "Does AuraTrace collect personal health data?",
                                a: "No. Profile selection (Asthma/Elderly/Infant) is processed entirely client-side. No personal health information is transmitted to our servers.",
                            },
                            {
                                q: "Can I integrate AuraTrace with smart home devices?",
                                a: "Yes. Our API supports webhooks and threshold-based alerts that can trigger IFTTT workflows, smart air purifier activation, or HVAC adjustments.",
                            },
                            {
                                q: "What areas are covered?",
                                a: "AuraTrace currently covers 240+ cities across North America, Europe, and Southeast Asia. Coverage is expanding monthly as we onboard new sensor networks.",
                            },
                        ].map((faq, i) => (
                            <div key={i} className="border-b border-border-subtle py-5 last:border-b-0">
                                <h4 className="text-sm font-semibold text-text-primary mb-2">
                                    {faq.q}
                                </h4>
                                <p className="text-xs text-text-secondary leading-[1.8]">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </DocSection>

                    {/* ─── Back to top ───────────────────────────── */}
                    <div className="text-center pt-8 border-t border-border-subtle">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="text-[10px] text-text-tertiary hover:text-text-secondary uppercase tracking-wider transition-colors"
                        >
                            ↑ Back to top
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
