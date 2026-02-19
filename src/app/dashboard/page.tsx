"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

/* ─── Types ─────────────────────────────────────────────── */
interface RealtimeData {
  aqi: number;
  pm25: number;
  pm10?: number;
  ozone?: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  category: string;
  color: string;
  source: string;
  location: { lat: number; lon: number };
  timestamp: string;
}

interface ForecastPoint {
  hour: string;
  strain: number;
  aqi: number;
}

interface Recommendation {
  id: string;
  text: string;
  severity: 'safe' | 'warn' | 'hazard';
  icon?: React.ReactNode;
}

interface RiskData {
  profileId: string;
  score: number;
  level: 'low' | 'moderate' | 'high';
  aqi: number;
  contributingFactors: {
    pm25: number;
    temperature: number;
    humidity: number;
    wind: number;
  };
  forecast: ForecastPoint[];
  recommendations: Recommendation[];
  timestamp: string;
}

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

// Map severity to icon
const severityIcon: Record<'safe' | 'warn' | 'hazard', React.ReactNode> = {
  safe: <ShieldIcon size={14} color="var(--accent-safe)" />,
  warn: <AlertIcon size={14} color="var(--accent-warn)" />,
  hazard: <MaskIcon size={14} color="var(--accent-hazard)" />,
};

/* ─── Stats for hero ────────────────────────────────────── */
function HeroStats({ 
  aqi, 
  pm25, 
  visibility, 
  color 
}: { 
  aqi: number; 
  pm25: number; 
  visibility: number; 
  color: string;
}) {
  const stats = [
    { label: "AQI", value: aqi.toString(), color },
    { label: "PM2.5", value: pm25.toFixed(1), color },
    { label: "Visibility", value: visibility.toFixed(1) + " km", color: "var(--text-secondary)" },
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

/* ─── Loading State ─────────────────────────────────────── */
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-accent-hazard border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary">Loading real-time air quality data...</p>
      </div>
    </div>
  );
}

/* ─── Error State ───────────────────────────────────────── */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="w-16 h-16 bg-accent-hazard/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertIcon size={24} color="var(--accent-hazard)" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">Unable to load data</h2>
        <p className="text-text-secondary mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="glass-card px-6 py-3 text-sm font-medium text-text-primary hover:bg-white/5 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/* ─── Page Component ────────────────────────────────────── */
export default function DashboardPage() {
  const [activeProfile, setActiveProfile] = useState("asthma");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-time AQI data
  const fetchRealtimeData = useCallback(async () => {
    try {
      const response = await fetch('/api/aqi');
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      const data = await response.json();
      setRealtimeData(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, []);

  // Fetch risk data for current profile
  const fetchRiskData = useCallback(async (profileId: string) => {
    try {
      const response = await fetch(`/api/risk/${profileId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch risk data');
      }
      const data = await response.json();
      
      // Add icons to recommendations
      if (data.recommendations) {
        data.recommendations = data.recommendations.map((rec: Recommendation) => ({
          ...rec,
          icon: severityIcon[rec.severity],
        }));
      }
      
      setRiskData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      const realtime = await fetchRealtimeData();
      if (realtime) {
        await fetchRiskData(activeProfile);
      }
      
      setLoading(false);
    };

    loadData();
  }, [fetchRealtimeData, fetchRiskData, activeProfile]);

  // Handle profile change
  const handleProfileChange = useCallback(async (id: string) => {
    setActiveProfile(id);
    setLoading(true);
    await fetchRiskData(id);
    setLoading(false);
  }, [fetchRiskData]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchRealtimeData().then((data) => {
      if (data) {
        fetchRiskData(activeProfile);
      }
      setLoading(false);
    });
  }, [activeProfile, fetchRealtimeData, fetchRiskData]);

  // Track active section for sticky nav
  useEffect(() => {
    const observers = navItems.map((item) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(item.id);
            }
          });
        },
        { threshold: 0.5 }
      );

      const element = document.getElementById(item.id);
      if (element) observer.observe(element);

      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !realtimeData || !riskData) {
    return <ErrorState message={error || 'Unable to load data'} onRetry={handleRetry} />;
  }

  // Determine colors based on risk score
  const getScoreColor = (score: number) => {
    if (score > 60) return "var(--accent-hazard)";
    if (score > 30) return "var(--accent-warn)";
    return "var(--accent-safe)";
  };

  const getScoreGlow = (score: number) => {
    if (score > 60) return "var(--accent-hazard-glow)";
    if (score > 30) return "var(--accent-warn-glow)";
    return "var(--accent-safe-glow)";
  };

  const scoreColor = getScoreColor(riskData.score);
  const scoreGlow = getScoreGlow(riskData.score);

  // Prepare cards from realtime data
  const cards = [
    {
      title: "PM2.5",
      value: realtimeData.pm25.toFixed(1),
      unit: "µg/m³",
      subtitle: `${Math.min(100, Math.round((realtimeData.pm25 / 12) * 100))}% above WHO guideline`,
      icon: <WindIcon size={14} color={scoreColor} />,
      accentColor: scoreColor,
    },
    {
      title: "Temperature",
      value: realtimeData.temperature.toString(),
      unit: "°C",
      subtitle: realtimeData.temperature > 30 ? "Heat compounds respiratory strain" : "Moderate temperature",
      icon: <ThermometerIcon size={14} color="var(--accent-warn)" />,
      accentColor: "var(--accent-warn)",
    },
    {
      title: "Humidity",
      value: realtimeData.humidity.toString(),
      unit: "%",
      subtitle: realtimeData.humidity < 30 ? "Low humidity dries airways" : "Comfortable humidity",
      icon: <DropletIcon size={14} color="var(--accent-safe)" />,
      accentColor: "var(--accent-safe)",
    },
    {
      title: "Visibility",
      value: realtimeData.visibility.toFixed(1),
      unit: "km",
      subtitle: realtimeData.visibility < 5 ? "Smoke haze reducing visibility" : "Clear visibility",
      icon: <EyeIcon size={14} color="var(--accent-warn)" />,
      accentColor: "var(--accent-warn)",
    },
  ];

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
      <SmokeBackground aqi={realtimeData.aqi} />

      <motion.div
        className="fixed inset-0 pointer-events-none z-[1]"
        animate={{ background: `${scoreColor}08` }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10 min-h-screen">
        <Header />
        <StickyNav activeSection={activeSection} />

        {/* SECTION 1 — HERO */}
        <section
          id="hero"
          className="relative min-h-[92vh] flex flex-col items-center justify-center px-5 md:px-8"
        >
          {/* Decorative radial */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${scoreGlow} 0%, transparent 70%)`,
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
                  score={riskData.score}
                  label={`${realtimeData.category} · AQI ${realtimeData.aqi} · ${riskData.level} risk for ${activeProfile}`}
                  profileColor={scoreColor}
                  profileGlow={scoreGlow}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick stats under the pulse */}
          <motion.div className="relative z-10 mt-10">
            <HeroStats 
              aqi={realtimeData.aqi}
              pm25={realtimeData.pm25}
              visibility={realtimeData.visibility}
              color={scoreColor}
            />
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

        {/* SECTION 2 — ENVIRONMENT DATA */}
        <Section id="environment" className="py-20 md:py-28">
          <SectionHeader
            title="Environmental Conditions"
            subtitle="Real-time atmospheric readings affecting your health profile. Data refreshed every 60 seconds."
            accent={scoreColor}
          />

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={stagger.container}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
          >
            {cards.map((card, i) => (
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

        {/* SECTION 3 — SMOKE DENSITY MAP */}
        <Section id="map" className="py-20 md:py-28">
          <SectionHeader
            title="Smoke Density Map"
            subtitle="Particulate distribution across your area. Heat zones indicate concentrated smoke plumes with respiratory risk."
            accent="var(--accent-warn)"
          />

          <ParticleMap aqi={realtimeData.aqi} />
        </Section>

        {/* Divider */}
        <div className="w-full max-w-[1200px] mx-auto px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />
        </div>

        {/* SECTION 4 — HEALTH FORECAST */}
        <Section id="forecast" className="py-20 md:py-28">
          <SectionHeader
            title="Health Forecast"
            subtitle="Predictive respiratory strain analysis for the next 12 hours based on meteorological models."
            accent="var(--accent-safe)"
          />

          <HealthForecast
            key={activeProfile + "-forecast"}
            data={riskData.forecast}
            accentColor={scoreColor}
            accentGlow={scoreGlow}
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
                value: Math.max(...riskData.forecast.map((f) => f.strain)).toString() + "%",
                desc: "Expected in next few hours",
                color: "var(--accent-hazard)",
              },
              {
                label: "Current AQI",
                value: realtimeData.aqi.toString(),
                desc: realtimeData.category,
                color: scoreColor,
              },
              {
                label: "Trend",
                value: riskData.forecast[riskData.forecast.length - 1].strain < riskData.forecast[0].strain ? "Improving" : "Worsening",
                desc: "Based on 12-hour forecast",
                color: riskData.forecast[riskData.forecast.length - 1].strain < riskData.forecast[0].strain ? "var(--accent-safe)" : "var(--accent-hazard)",
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

        {/* SECTION 5 — SAFETY RECOMMENDATIONS */}
        <Section id="safety" className="py-20 md:py-28">
          <SectionHeader
            title="Safety Recommendations"
            subtitle="Personalized guidance based on your health profile and current conditions."
            accent={scoreColor}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecommendationPanel
              key={activeProfile + "-recs"}
              recommendations={riskData.recommendations}
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
                    style={{ background: `${scoreColor}15` }}
                  >
                    <ShieldIcon size={16} color={scoreColor} />
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
                      <span className="text-[11px] font-mono" style={{ color: realtimeData.aqi > 100 ? "var(--accent-warn)" : "var(--accent-safe)" }}>
                        {realtimeData.aqi > 100 ? "Recommended" : "Optional"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: realtimeData.aqi > 100 ? "var(--accent-warn)" : "var(--accent-safe)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: realtimeData.aqi > 100 ? "45%" : "15%" }}
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
                      <span className="text-[11px] font-mono" style={{ color: realtimeData.aqi > 150 ? "var(--accent-hazard)" : realtimeData.aqi > 50 ? "var(--accent-warn)" : "var(--accent-safe)" }}>
                        {realtimeData.aqi > 150 ? "Unsafe" : realtimeData.aqi > 50 ? "Caution" : "Safe"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: realtimeData.aqi > 150 ? "var(--accent-hazard)" : realtimeData.aqi > 50 ? "var(--accent-warn)" : "var(--accent-safe)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: realtimeData.aqi > 150 ? "22%" : realtimeData.aqi > 50 ? "55%" : "88%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle">
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  Last updated {new Date(realtimeData.timestamp).toLocaleTimeString()} · Based on{" "}
                  <span className="text-text-secondary">
                    {profiles.find((p) => p.id === activeProfile)?.label}
                  </span>{" "}
                  profile · Source: {realtimeData.source}
                </p>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* FOOTER */}
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

      {/* MOBILE BOTTOM SHEET */}
      <MobileBottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Detailed Analysis"
      >
        <div className="flex flex-col gap-5">
          <ParticleMap aqi={realtimeData.aqi} />
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card, i) => (
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
            data={riskData.forecast}
            accentColor={scoreColor}
            accentGlow={scoreGlow}
          />
          <RecommendationPanel recommendations={riskData.recommendations} />
        </div>
      </MobileBottomSheet>
    </>
  );
}