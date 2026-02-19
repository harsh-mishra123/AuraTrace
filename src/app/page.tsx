"use client";

import { useEffect, useRef, useCallback } from "react";
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
} from "@/components/Icons";
import SmokeBackground from "@/components/SmokeBackground";

/* ─── Floating particle ring (decorative) ───────────────── */
function OrbitalRing({ radius, duration, color, size }: {
  radius: number;
  duration: number;
  color: string;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${size / 3}px)`,
      }}
      animate={{
        x: [
          Math.cos(0) * radius,
          Math.cos(Math.PI * 0.5) * radius,
          Math.cos(Math.PI) * radius,
          Math.cos(Math.PI * 1.5) * radius,
          Math.cos(Math.PI * 2) * radius,
        ],
        y: [
          Math.sin(0) * radius,
          Math.sin(Math.PI * 0.5) * radius,
          Math.sin(Math.PI) * radius,
          Math.sin(Math.PI * 1.5) * radius,
          Math.sin(Math.PI * 2) * radius,
        ],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ─── Animated counter ──────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (ref.current) {
        ref.current.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, 25);
    return () => clearInterval(timer);
  }, [target, suffix]);

  return <span ref={ref} className="font-mono tabular-nums">0{suffix}</span>;
}

/* ─── Feature card ──────────────────────────────────────── */
function FeatureCard({
  icon,
  title,
  description,
  accent,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
  index: number;
}) {
  return (
    <motion.div
      className="glass-card rounded-lg p-6 group cursor-default"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${accent}12` }}
      >
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-2 tracking-wide">
        {title}
      </h3>
      <p className="text-xs text-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function HomePage() {
  const fade = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const, margin: "-60px" as const },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <>
      <SmokeBackground aqi={140} />

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Decorative gradient orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(255,107,44,0.08) 0%, rgba(44,212,162,0.04) 40%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Orbital particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <OrbitalRing radius={200} duration={20} color="rgba(255,107,44,0.15)" size={8} />
          <OrbitalRing radius={260} duration={28} color="rgba(44,212,162,0.12)" size={6} />
          <OrbitalRing radius={320} duration={35} color="rgba(245,183,49,0.1)" size={5} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto pt-20">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-safe opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-safe" />
            </span>
            <span className="text-[10px] text-text-secondary tracking-[0.15em] uppercase">
              Real-time monitoring active
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-light text-text-primary leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Breathe{" "}
            <span
              className="font-semibold"
              style={{
                background: "linear-gradient(135deg, var(--accent-hazard), var(--accent-safe))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              smarter
            </span>
            .
            <br />
            Live{" "}
            <span className="text-text-secondary font-extralight">safer</span>.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed mb-10 font-light"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            AuraTrace monitors real-time smoke and air quality data to calculate
            personalized health risk scores for vulnerable individuals — people
            with asthma, elderly populations, and infants.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium tracking-wide text-bg-primary overflow-hidden"
              style={{ background: "var(--accent-hazard)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Open Dashboard
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link
              href="/docs"
              className="glass-card inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium tracking-wide text-text-secondary hover:text-text-primary transition-colors"
            >
              Read the Docs
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M7 17l10-10M17 17V7H7" />
              </svg>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <span className="text-[9px] text-text-tertiary uppercase tracking-[0.2em]">
              Explore
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
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR
          ═══════════════════════════════════════════════════ */}
      <motion.section
        className="relative py-16 border-y border-border-subtle"
        {...fade}
      >
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Cities Monitored", value: 240, suffix: "+" },
            { label: "Data Points / Hour", value: 18000, suffix: "" },
            { label: "Vulnerable Users", value: 52000, suffix: "+" },
            { label: "Avg Response Time", value: 12, suffix: "ms" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl md:text-3xl font-light text-text-primary mb-1">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-[10px] text-text-tertiary uppercase tracking-[0.15em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════
          WHAT IS AURATRACE
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <motion.div {...fade} className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-accent-hazard" />
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">
                What is AuraTrace?
              </h2>
            </div>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed pl-[19px]">
              AuraTrace is a real-time atmospheric monitoring platform designed to
              protect the most vulnerable. Using a network of particulate sensors,
              meteorological data, and AI-powered health models, we translate raw
              environmental data into actionable, personalized risk assessments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FeatureCard
              index={0}
              icon={<ActivityIcon size={18} color="var(--accent-hazard)" />}
              title="Personal Risk Scoring"
              description="Our Impact Pulse engine calculates a real-time risk score tailored to your specific health profile — whether you have asthma, are elderly, or are monitoring an infant."
              accent="var(--accent-hazard)"
            />
            <FeatureCard
              index={1}
              icon={<WindIcon size={18} color="var(--accent-warn)" />}
              title="Atmospheric Intelligence"
              description="Track PM2.5, PM10, ozone, and smoke density through an interactive particle map with heat-shimmer visualization of active smoke plumes."
              accent="var(--accent-warn)"
            />
            <FeatureCard
              index={2}
              icon={<ShieldIcon size={18} color="var(--accent-safe)" />}
              title="Predictive Health Forecasts"
              description="See respiratory strain predictions for the next 12 hours, powered by meteorological models and historical pattern analysis."
              accent="var(--accent-safe)"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHO IT'S FOR
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 border-t border-border-subtle">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <motion.div {...fade} className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-accent-safe" />
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">
                Built for the vulnerable
              </h2>
            </div>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed pl-[19px]">
              Smoke and poor air quality don&apos;t affect everyone equally.
              AuraTrace focuses on the populations most at risk, delivering
              tailored guidance that matters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <LungIcon size={22} color="var(--accent-hazard)" />,
                title: "Asthma & Respiratory",
                stat: "72",
                desc: "Individuals with asthma or COPD face dramatically higher risk from fine particulates. AuraTrace monitors bronchospasm triggers and recommends when to use rescue medication.",
                color: "var(--accent-hazard)",
                glow: "var(--accent-hazard-glow)",
              },
              {
                icon: <ElderlyIcon size={22} color="var(--accent-warn)" />,
                title: "Elderly Populations",
                stat: "58",
                desc: "Cardiovascular strain from smoke exposure increases with age. Our platform tracks heart-relevant pollutants and provides activity-level recommendations.",
                color: "var(--accent-warn)",
                glow: "var(--accent-warn-glow)",
              },
              {
                icon: <InfantIcon size={22} color="var(--accent-safe)" />,
                title: "Infants & Children",
                stat: "85",
                desc: "Developing lungs are 6× more susceptible to particulate damage. AuraTrace provides critical alerts for caregivers and safe indoor environment guidance.",
                color: "var(--accent-hazard)",
                glow: "var(--accent-hazard-glow)",
              },
            ].map((group, i) => (
              <motion.div
                key={group.title}
                className="glass-card rounded-lg overflow-hidden group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Header with risk score */}
                <div className="relative p-6 pb-4">
                  <div
                    className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${group.glow}, transparent 70%)`,
                      opacity: 0.3,
                    }}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: `${group.color}12` }}
                    >
                      {group.icon}
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-text-tertiary uppercase tracking-wider block">
                        Risk Score
                      </span>
                      <span
                        className="text-2xl font-mono font-light"
                        style={{ color: group.color }}
                      >
                        {group.stat}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary tracking-wide mb-2">
                    {group.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {group.desc}
                  </p>
                </div>

                {/* Bottom bar */}
                <div className="px-6 py-3 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-[10px] text-text-tertiary uppercase tracking-wider">
                    View profile →
                  </span>
                  <div
                    className="w-16 h-1 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: group.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${group.stat}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 border-t border-border-subtle">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8">
          <motion.div {...fade} className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-accent-warn" />
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary tracking-tight">
                How it works
              </h2>
            </div>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed pl-[19px]">
              From sensor to safety recommendation in under 12 milliseconds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Ingest",
                desc: "Air quality sensors and satellite imagery stream real-time PM2.5, PM10, ozone, and smoke plume data.",
              },
              {
                step: "02",
                title: "Analyze",
                desc: "Our atmospheric engine correlates wind patterns, temperature, and humidity to model particulate dispersion.",
              },
              {
                step: "03",
                title: "Personalize",
                desc: "Health risk models adjust scores based on your specific profile — respiratory conditions, age, and sensitivity.",
              },
              {
                step: "04",
                title: "Protect",
                desc: "You receive a personalized risk score, forecasts, and actionable safety recommendations in real-time.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                {/* Connector line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-border-glass to-transparent z-0" />
                )}

                <span
                  className="text-3xl font-mono font-light block mb-4"
                  style={{
                    background: "linear-gradient(180deg, var(--text-tertiary), transparent)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {item.step}
                </span>
                <h4 className="text-sm font-semibold text-text-primary mb-2 tracking-wide">
                  {item.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 border-t border-border-subtle">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 80%, rgba(255,107,44,0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          className="relative z-10 max-w-2xl mx-auto text-center px-5"
          {...fade}
        >
          <h2 className="text-2xl md:text-4xl font-semibold text-text-primary tracking-tight mb-4">
            Start monitoring now
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-md mx-auto">
            Access your personalized smoke impact dashboard. No sign-up
            required — your health data stays local.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-medium tracking-wide text-bg-primary overflow-hidden"
              style={{ background: "var(--accent-hazard)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Dashboard
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <Link
              href="/docs"
              className="glass-card inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-medium tracking-wide text-text-secondary hover:text-text-primary transition-colors"
            >
              Documentation
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="relative py-10 px-5 md:px-8 border-t border-border-subtle">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,107,44,0.15), rgba(44,212,162,0.1))",
              }}
            >
              <ActivityIcon size={11} color="var(--accent-hazard)" />
            </div>
            <span className="text-[11px] text-text-tertiary tracking-[0.1em] uppercase">
              AuraTrace © 2026
            </span>
          </div>

          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "API", "GitHub"].map((link) => (
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
    </>
  );
}
