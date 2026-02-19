"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

import SmokeBackground from "@/components/SmokeBackground";
import ImpactPulse from "@/components/ImpactPulse";
import ProfileToggle, { Profile } from "@/components/ProfileToggle";
import ParticleMap from "@/components/ParticleMap";
import HealthForecast from "@/components/HealthForecast";
import DataCard from "@/components/DataCard";
import RecommendationPanel from "@/components/RecommendationPanel";
import MobileBottomSheet from "@/components/MobileBottomSheet";
import Header from "@/components/Header";
import {
  LungIcon,
  ElderlyIcon,
  InfantIcon,
  WindIcon,
  ThermometerIcon,
  DropletIcon,
  ShieldIcon,
  MaskIcon,
  HomeIcon,
  EyeIcon,
  AlertIcon,
  ActivityIcon,
} from "@/components/Icons";

/* ─── Section Wrapper ───────────────────────────────────── */
function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      className={`relative w-full max-w-[1200px] mx-auto px-5 md:px-8 ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

function SectionHeader({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: accent || "var(--accent-hazard)" }}
        />
        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
      </div>
      <p className="text-sm text-text-tertiary pl-[19px] max-w-lg">
        {subtitle}
      </p>
    </div>
  );
}

/* ─── Navigation ────────────────────────────────────────── */
const navItems = [
  { id: "hero", label: "Overview" },
  { id: "environment", label: "Environment" },
  { id: "map", label: "Map" },
  { id: "forecast", label: "Forecast" },
  { id: "safety", label: "Safety" },
];

function StickyNav({ activeSection }: { activeSection: string }) {
  return (
    <motion.nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card rounded-full px-2 py-1.5 flex items-center gap-1"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`
            px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider uppercase transition-all duration-300
            ${activeSection === item.id
              ? "bg-white/10 text-text-primary"
              : "text-text-tertiary hover:text-text-secondary"
            }
          `}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {item.label}
        </a>
      ))}
    </motion.nav>
  );
}

/* ─── Profile Data ──────────────────────────────────────── */
const profiles: Profile[] = [
  { id: "asthma", label: "Asthma", icon: <LungIcon size={14} /> },
  { id: "elderly", label: "Elderly", icon: <ElderlyIcon size={14} /> },
  { id: "infant", label: "Infant", icon: <InfantIcon size={14} /> },
];

interface ProfileConfig {
  score: number;
  aqi: number;
  color: string;
  glow: string;
  label: string;
  bgTint: string;
  recommendations: {
    id: string;
    icon: React.ReactNode;
    text: string;
    severity: "safe" | "warn" | "hazard";
  }[];
  forecast: { hour: string; strain: number; aqi: number }[];
  cards: {
    title: string;
    value: string;
    unit?: string;
    subtitle: string;
    icon: React.ReactNode;
    accentColor: string;
  }[];
}

const profileData: Record<string, ProfileConfig> = {
  asthma: {
    score: 72,
    aqi: 168,
    color: "var(--accent-hazard)",
    glow: "var(--accent-hazard-glow)",
    label:
      "Elevated PM2.5 levels may trigger bronchospasm. Consider staying indoors with air filtration active.",
    bgTint: "rgba(255,107,44,0.02)",
    recommendations: [
      {
        id: "a1",
        icon: <MaskIcon size={14} color="var(--accent-hazard)" />,
        text: "Wear an N95 mask if going outdoors. Current particulate levels exceed safe thresholds for sensitive airways.",
        severity: "hazard",
      },
      {
        id: "a2",
        icon: <HomeIcon size={14} color="var(--accent-warn)" />,
        text: "Keep windows sealed and run HEPA filtration. Indoor AQI can be 60% lower with proper sealing.",
        severity: "warn",
      },
      {
        id: "a3",
        icon: <ShieldIcon size={14} color="var(--accent-safe)" />,
        text: "Have rescue inhaler accessible. Schedule non-urgent outdoor activities for early morning when AQI typically dips.",
        severity: "safe",
      },
    ],
    forecast: [
      { hour: "Now", strain: 72, aqi: 168 },
      { hour: "1h", strain: 75, aqi: 175 },
      { hour: "2h", strain: 80, aqi: 182 },
      { hour: "3h", strain: 85, aqi: 195 },
      { hour: "4h", strain: 82, aqi: 188 },
      { hour: "5h", strain: 78, aqi: 178 },
      { hour: "6h", strain: 70, aqi: 160 },
      { hour: "7h", strain: 62, aqi: 142 },
      { hour: "8h", strain: 55, aqi: 128 },
      { hour: "9h", strain: 48, aqi: 112 },
      { hour: "10h", strain: 42, aqi: 98 },
      { hour: "11h", strain: 38, aqi: 88 },
      { hour: "12h", strain: 35, aqi: 82 },
    ],
    cards: [
      {
        title: "PM2.5",
        value: "58.4",
        unit: "µg/m³",
        subtitle: "4.8× above WHO guideline",
        icon: <WindIcon size={14} color="var(--accent-hazard)" />,
        accentColor: "var(--accent-hazard)",
      },
      {
        title: "Temperature",
        value: "34",
        unit: "°C",
        subtitle: "Heat compounds respiratory strain",
        icon: <ThermometerIcon size={14} color="var(--accent-warn)" />,
        accentColor: "var(--accent-warn)",
      },
      {
        title: "Humidity",
        value: "28",
        unit: "%",
        subtitle: "Low humidity dries airways",
        icon: <DropletIcon size={14} color="var(--accent-safe)" />,
        accentColor: "var(--accent-safe)",
      },
      {
        title: "Visibility",
        value: "3.2",
        unit: "km",
        subtitle: "Smoke haze reducing visibility",
        icon: <EyeIcon size={14} color="var(--accent-warn)" />,
        accentColor: "var(--accent-warn)",
      },
    ],
  },
  elderly: {
    score: 58,
    aqi: 132,
    color: "var(--accent-warn)",
    glow: "var(--accent-warn-glow)",
    label:
      "Moderate cardiovascular strain expected. Limit outdoor exertion and stay hydrated in climate-controlled spaces.",
    bgTint: "rgba(245,183,49,0.02)",
    recommendations: [
      {
        id: "e1",
        icon: <AlertIcon size={14} color="var(--accent-warn)" />,
        text: "Avoid strenuous outdoor activity. Smoke particles increase cardiovascular event risk in older adults by ~30%.",
        severity: "warn",
      },
      {
        id: "e2",
        icon: <HomeIcon size={14} color="var(--accent-safe)" />,
        text: "Stay in air-conditioned spaces. Monitor blood pressure more frequently during poor AQI days.",
        severity: "safe",
      },
      {
        id: "e3",
        icon: <DropletIcon size={14} color="var(--accent-safe)" />,
        text: "Increase fluid intake to maintain mucosal hydration. Target 2L minimum during smoke events.",
        severity: "safe",
      },
    ],
    forecast: [
      { hour: "Now", strain: 58, aqi: 132 },
      { hour: "1h", strain: 62, aqi: 140 },
      { hour: "2h", strain: 65, aqi: 148 },
      { hour: "3h", strain: 68, aqi: 155 },
      { hour: "4h", strain: 66, aqi: 150 },
      { hour: "5h", strain: 60, aqi: 138 },
      { hour: "6h", strain: 52, aqi: 120 },
      { hour: "7h", strain: 45, aqi: 105 },
      { hour: "8h", strain: 40, aqi: 92 },
      { hour: "9h", strain: 35, aqi: 82 },
      { hour: "10h", strain: 32, aqi: 75 },
      { hour: "11h", strain: 30, aqi: 70 },
      { hour: "12h", strain: 28, aqi: 65 },
    ],
    cards: [
      {
        title: "PM2.5",
        value: "42.1",
        unit: "µg/m³",
        subtitle: "3.5× above WHO guideline",
        icon: <WindIcon size={14} color="var(--accent-warn)" />,
        accentColor: "var(--accent-warn)",
      },
      {
        title: "Temperature",
        value: "31",
        unit: "°C",
        subtitle: "Moderate heat stress advisory",
        icon: <ThermometerIcon size={14} color="var(--accent-warn)" />,
        accentColor: "var(--accent-warn)",
      },
      {
        title: "Humidity",
        value: "35",
        unit: "%",
        subtitle: "Below comfort threshold",
        icon: <DropletIcon size={14} color="var(--accent-safe)" />,
        accentColor: "var(--accent-safe)",
      },
      {
        title: "Visibility",
        value: "5.1",
        unit: "km",
        subtitle: "Light haze conditions",
        icon: <EyeIcon size={14} color="var(--accent-safe)" />,
        accentColor: "var(--accent-safe)",
      },
    ],
  },
  infant: {
    score: 85,
    aqi: 205,
    color: "var(--accent-hazard)",
    glow: "var(--accent-hazard-glow)",
    label:
      "Critical exposure risk for developing lungs. Indoor air purification strongly recommended. Avoid any outdoor time.",
    bgTint: "rgba(255,107,44,0.03)",
    recommendations: [
      {
        id: "i1",
        icon: <AlertIcon size={14} color="var(--accent-hazard)" />,
        text: "Do not take infants outdoors. Developing lungs are 6× more susceptible to fine particulate damage.",
        severity: "hazard",
      },
      {
        id: "i2",
        icon: <MaskIcon size={14} color="var(--accent-hazard)" />,
        text: "N95 masks are NOT designed for infants. Rely entirely on environmental controls and HEPA filtration.",
        severity: "hazard",
      },
      {
        id: "i3",
        icon: <HomeIcon size={14} color="var(--accent-warn)" />,
        text: "Seal nursery windows with damp towels if no air purifier available. Monitor for coughing or labored breathing.",
        severity: "warn",
      },
      {
        id: "i4",
        icon: <ShieldIcon size={14} color="var(--accent-safe)" />,
        text: "Consult pediatrician if respiratory rate exceeds 40 breaths/min during smoke events.",
        severity: "safe",
      },
    ],
    forecast: [
      { hour: "Now", strain: 85, aqi: 205 },
      { hour: "1h", strain: 88, aqi: 215 },
      { hour: "2h", strain: 92, aqi: 228 },
      { hour: "3h", strain: 95, aqi: 240 },
      { hour: "4h", strain: 90, aqi: 220 },
      { hour: "5h", strain: 85, aqi: 200 },
      { hour: "6h", strain: 78, aqi: 180 },
      { hour: "7h", strain: 70, aqi: 158 },
      { hour: "8h", strain: 62, aqi: 140 },
      { hour: "9h", strain: 55, aqi: 125 },
      { hour: "10h", strain: 50, aqi: 115 },
      { hour: "11h", strain: 45, aqi: 105 },
      { hour: "12h", strain: 42, aqi: 98 },
    ],
    cards: [
      {
        title: "PM2.5",
        value: "78.2",
        unit: "µg/m³",
        subtitle: "6.5× above WHO guideline",
        icon: <WindIcon size={14} color="var(--accent-hazard)" />,
        accentColor: "var(--accent-hazard)",
      },
      {
        title: "Temperature",
        value: "36",
        unit: "°C",
        subtitle: "Heat amplifies particulate risk",
        icon: <ThermometerIcon size={14} color="var(--accent-hazard)" />,
        accentColor: "var(--accent-hazard)",
      },
      {
        title: "Humidity",
        value: "22",
        unit: "%",
        subtitle: "Critically dry — humidifier advised",
        icon: <DropletIcon size={14} color="var(--accent-warn)" />,
        accentColor: "var(--accent-warn)",
      },
      {
        title: "Visibility",
        value: "1.8",
        unit: "km",
        subtitle: "Dense smoke — hazardous conditions",
        icon: <EyeIcon size={14} color="var(--accent-hazard)" />,
        accentColor: "var(--accent-hazard)",
      },
    ],
  },
};

/* ─── Stats for hero ────────────────────────────────────── */
function HeroStats({ config }: { config: ProfileConfig }) {
  const stats = [
    { label: "AQI", value: config.aqi.toString(), color: config.color },
    { label: "PM2.5", value: config.cards[0].value, color: config.color },
    { label: "Visibility", value: config.cards[3].value + " km", color: "var(--text-secondary)" },
  ];

  return (
    <div className="flex items-center gap-6 md:gap-10">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1 }}
        >
          <span className="text-[10px] text-text-tertiary uppercase tracking-[0.15em]">
            {stat.label}
          </span>
          <span
            className="text-lg md:text-xl font-mono font-light tabular-nums"
            style={{ color: stat.color }}
          >
            {stat.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Page Component ────────────────────────────────────── */
export default function HomePage() {
  const [activeProfile, setActiveProfile] = useState("asthma");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeSection] = useState("hero");

  const config = useMemo(() => profileData[activeProfile], [activeProfile]);

  const handleProfileChange = useCallback((id: string) => {
    setActiveProfile(id);
  }, []);

  const stagger = {
    container: {
      animate: { transition: { staggerChildren: 0.08 } },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    },
  };

  return (
    <>
      <SmokeBackground aqi={config.aqi} />

      <motion.div
        className="fixed inset-0 pointer-events-none z-[1]"
        animate={{ background: config.bgTint }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10 min-h-screen">
        <Header />
        <StickyNav activeSection={activeSection} />

        {/* ═══════════════════════════════════════════════════
            SECTION 1 — HERO
            ═══════════════════════════════════════════════════ */}
        <section
          id="hero"
          className="relative min-h-[92vh] flex flex-col items-center justify-center px-5 md:px-8"
        >
          {/* Decorative radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${config.glow} 0%, transparent 70%)`,
              opacity: 0.15,
              transition: "background 0.8s ease",
            }}
          />

          {/* Profile switcher */}
          <motion.div
            className="relative z-10 mb-10 md:mb-14"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ProfileToggle
              profiles={profiles}
              activeId={activeProfile}
              onChange={handleProfileChange}
            />
          </motion.div>

          {/* Impact Pulse — the hero element */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProfile + "-pulse"}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ImpactPulse
                  score={config.score}
                  label={config.label}
                  profileColor={config.color}
                  profileGlow={config.glow}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick stats under the pulse */}
          <motion.div className="relative z-10 mt-10">
            <HeroStats config={config} />
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-[9px] text-text-tertiary uppercase tracking-[0.2em]">
              Scroll to explore
            </span>
            <motion.div
              className="w-5 h-8 rounded-full border border-border-glass flex items-start justify-center p-1"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-2 rounded-full bg-text-tertiary"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="w-full max-w-[1200px] mx-auto px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 2 — ENVIRONMENT DATA
            ═══════════════════════════════════════════════════ */}
        <Section id="environment" className="py-20 md:py-28">
          <SectionHeader
            title="Environmental Conditions"
            subtitle="Real-time atmospheric readings affecting your health profile. Data refreshed every 60 seconds."
            accent={config.color}
          />

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={stagger.container}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
          >
            {config.cards.map((card, i) => (
              <DataCard
                key={activeProfile + card.title}
                title={card.title}
                value={card.value}
                unit={card.unit}
                subtitle={card.subtitle}
                icon={card.icon}
                accentColor={card.accentColor}
                index={i}
              />
            ))}
          </motion.div>
        </Section>

        {/* Divider */}
        <div className="w-full max-w-[1200px] mx-auto px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 3 — SMOKE DENSITY MAP
            ═══════════════════════════════════════════════════ */}
        <Section id="map" className="py-20 md:py-28">
          <SectionHeader
            title="Smoke Density Map"
            subtitle="Particulate distribution across your area. Heat zones indicate concentrated smoke plumes with respiratory risk."
            accent="var(--accent-warn)"
          />

          <ParticleMap aqi={config.aqi} />
        </Section>

        {/* Divider */}
        <div className="w-full max-w-[1200px] mx-auto px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 4 — HEALTH FORECAST
            ═══════════════════════════════════════════════════ */}
        <Section id="forecast" className="py-20 md:py-28">
          <SectionHeader
            title="Health Forecast"
            subtitle="Predictive respiratory strain analysis for the next 12 hours based on meteorological models."
            accent="var(--accent-safe)"
          />

          <HealthForecast
            key={activeProfile + "-forecast"}
            data={config.forecast}
            accentColor={config.color}
            accentGlow={config.glow}
          />

          {/* Forecast insight card */}
          <motion.div
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              {
                label: "Peak Strain",
                value:
                  Math.max(...config.forecast.map((f) => f.strain)).toString() + "%",
                desc: "Expected in ~3 hours",
                color: "var(--accent-hazard)",
              },
              {
                label: "Recovery Window",
                value: "7–12h",
                desc: "AQI expected to drop below 100",
                color: "var(--accent-safe)",
              },
              {
                label: "Trend",
                value: "Improving",
                desc: "Gradual decline through the evening",
                color: "var(--accent-safe)",
              },
            ].map((insight, i) => (
              <div
                key={i}
                className="glass-card rounded-lg p-4 flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: `${insight.color}10` }}
                >
                  <ActivityIcon size={18} color={insight.color} />
                </div>
                <div>
                  <p className="text-[10px] text-text-tertiary uppercase tracking-wider">
                    {insight.label}
                  </p>
                  <p
                    className="text-base font-mono font-medium"
                    style={{ color: insight.color }}
                  >
                    {insight.value}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-0.5">
                    {insight.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </Section>

        {/* Divider */}
        <div className="w-full max-w-[1200px] mx-auto px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 5 — SAFETY RECOMMENDATIONS
            ═══════════════════════════════════════════════════ */}
        <Section id="safety" className="py-20 md:py-28">
          <SectionHeader
            title="Safety Recommendations"
            subtitle="Personalized guidance based on your health profile and current conditions."
            accent={config.color}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecommendationPanel
              key={activeProfile + "-recs"}
              recommendations={config.recommendations}
            />

            {/* Summary card */}
            <motion.div
              className="glass-card rounded-lg p-6 flex flex-col justify-between"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ background: `${config.color}15` }}
                  >
                    <ShieldIcon
                      size={16}
                      color={config.color}
                    />
                  </div>
                  <h4 className="text-sm font-medium text-text-primary">
                    Protection Summary
                  </h4>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
                        Indoor Air Quality
                      </span>
                      <span className="text-[11px] font-mono text-accent-safe">Good</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--accent-safe)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "78%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
                        Mask Protection
                      </span>
                      <span className="text-[11px] font-mono text-accent-warn">
                        Recommended
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--accent-warn)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "45%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
                        Outdoor Safety
                      </span>
                      <span className="text-[11px] font-mono text-accent-hazard">Unsafe</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--accent-hazard)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: "22%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle">
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  Last updated 2 minutes ago · Based on{" "}
                  <span className="text-text-secondary">
                    {profiles.find((p) => p.id === activeProfile)?.label}
                  </span>{" "}
                  profile
                </p>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════ */}
        <footer className="relative py-12 px-5 md:px-8 border-t border-border-subtle">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,107,44,0.15), rgba(44,212,162,0.1))",
                }}
              >
                <ActivityIcon size={12} color="var(--accent-hazard)" />
              </div>
              <span className="text-[11px] text-text-tertiary tracking-[0.1em] uppercase">
                AuraTrace · Smoke Impact Monitor
              </span>
            </div>

            <div className="flex items-center gap-6">
              {["Privacy", "Data Sources", "API", "About"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[10px] text-text-tertiary hover:text-text-secondary transition-colors uppercase tracking-wider"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </footer>

        {/* Pad for floating nav */}
        <div className="h-16" />
      </div>

      {/* ═══════════════════════════════════════════════════
          MOBILE BOTTOM SHEET (unchanged)
          ═══════════════════════════════════════════════════ */}
      <MobileBottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Detailed Analysis"
      >
        <div className="flex flex-col gap-5">
          <ParticleMap aqi={config.aqi} />
          <div className="grid grid-cols-2 gap-3">
            {config.cards.map((card, i) => (
              <DataCard
                key={activeProfile + card.title + "-sheet"}
                title={card.title}
                value={card.value}
                unit={card.unit}
                subtitle={card.subtitle}
                icon={card.icon}
                accentColor={card.accentColor}
                index={i}
              />
            ))}
          </div>
          <HealthForecast
            data={config.forecast}
            accentColor={config.color}
            accentGlow={config.glow}
          />
          <RecommendationPanel recommendations={config.recommendations} />
        </div>
      </MobileBottomSheet>
    </>
  );
}
