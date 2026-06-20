import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PLATFORM_STATS, MOCK_CASES } from '../data/mockData';
import './HomePage.css';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCountUp(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, shouldStart]);
  return count;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, prefix = '', suffix = '', color }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(value, 1800, visible);

  return (
    <div className="stat-card" ref={ref} aria-label={`${label}: ${value}`}>
      <div className="stat-number" style={{ color }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

// ── Recent Case Preview ────────────────────────────────────────────────────────
function RecentCaseCard({ caseData }) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(caseData.lastSeenDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link to={`/gallery/${caseData.id}`} className="recent-case-card" aria-label={`View case for ${caseData.name}`}>
      <div
        className="case-photo-placeholder"
        style={{ background: `linear-gradient(135deg, ${caseData.photoPlaceholderColor}, #0A1628)` }}
        aria-hidden="true"
      >
        <span>{caseData.photoInitials}</span>
      </div>
      <div className="case-info">
        <div className="case-name">{caseData.name}</div>
        <div className="case-meta">Age {caseData.age} · {caseData.missingFrom}</div>
        <div className="case-days">
          <span className="badge badge-active">Active</span>
          <span className="days-text">{daysAgo}d ago</span>
        </div>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const recentCases = MOCK_CASES.slice(0, 4);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-headline">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-grid" />
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge" aria-label="Platform status">
            <span className="pulse-dot" aria-hidden="true" />
            Live Platform · {PLATFORM_STATS.statesActive} States Active
          </div>

          <h1 id="hero-headline" className="hero-headline">
            Every Second Matters.<br />
            <span className="headline-accent">Find Them Faster.</span>
          </h1>

          <p className="hero-description">
            ChildGuard AI is a national missing child detection and rapid-alert platform —
            connecting law enforcement, communities, and cutting-edge technology to bring
            children home safely.
          </p>

          <div className="hero-actions">
            <Link to="/submit-sighting" className="btn btn-primary btn-lg hero-cta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Submit a Sighting
            </Link>
            <Link to="/gallery" className="btn btn-outline btn-lg">
              View Missing Children
            </Link>
          </div>

          <div className="hero-disclaimer" role="note">
            <strong>Emergency?</strong> Call <strong>911</strong> immediately.
            NCMEC Hotline: <strong>1-800-THE-LOST</strong>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section" aria-labelledby="stats-title">
        <div className="container">
          <div className="stats-label" id="stats-title">Platform Statistics (Demo Data)</div>
          <div className="stats-grid">
            <StatCard
              value={PLATFORM_STATS.casesInDatabase}
              label="Cases in Database"
              color="#3EA8E5"
            />
            <StatCard
              value={PLATFORM_STATS.sightingsSubmitted}
              label="Sightings Submitted"
              color="#F39C12"
            />
            <StatCard
              value={PLATFORM_STATS.casesResolved}
              label="Cases Resolved"
              color="#27AE60"
            />
            <StatCard
              value={PLATFORM_STATS.statesActive}
              label="States Active"
              suffix="+"
              color="#3EA8E5"
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section" aria-labelledby="how-title">
        <div className="container">
          <div className="section-header">
            <h2 id="how-title" className="section-title">How ChildGuard AI Works</h2>
            <p className="section-subtitle">
              A three-step system built for speed, accuracy, and community involvement.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon step-icon-1" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="step-title">1. Case Filed</h3>
              <p className="step-desc">
                Law enforcement submits a missing child case with photos, physical
                description, and last known location into the secure database.
              </p>
            </div>

            <div className="step-connector" aria-hidden="true" />

            <div className="step-card">
              <div className="step-icon step-icon-2" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="step-title">2. Community Alerts</h3>
              <p className="step-desc">
                The public browses the gallery and submits sightings with location,
                time, and optional photos — directly to the case file.
              </p>
              {/* TODO: AWS Rekognition integration — auto-match submitted sighting photos against case database */}
            </div>

            <div className="step-connector" aria-hidden="true" />

            <div className="step-card">
              <div className="step-icon step-icon-3" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="step-title">3. LE Investigation</h3>
              <p className="step-desc">
                Verified law enforcement officers access full case details, review
                sightings, coordinate with agencies, and mark cases resolved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recent Cases ── */}
      <section className="recent-section" aria-labelledby="recent-title">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 id="recent-title" className="section-title">Recently Added Cases</h2>
              <p className="section-subtitle">Help bring these children home.</p>
            </div>
            <Link to="/gallery" className="btn btn-outline">
              View All {MOCK_CASES.length} Cases →
            </Link>
          </div>

          <div className="recent-cases-grid">
            {recentCases.map((c) => (
              <RecentCaseCard key={c.id} caseData={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section" aria-labelledby="cta-title">
        <div className="container">
          <div className="cta-card">
            <div className="cta-text">
              <h2 id="cta-title">Seen Something? Say Something.</h2>
              <p>
                Every sighting tip matters. If you believe you've seen a missing child,
                submit a report immediately. Your information goes directly to investigators.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/submit-sighting" className="btn btn-primary btn-lg">
                Submit a Sighting
              </Link>
              <a href="tel:18008435678" className="btn btn-outline btn-lg">
                📞 1-800-THE-LOST
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partners ── */}
      <section className="partners-section" aria-labelledby="partners-title">
        <div className="container">
          <h2 id="partners-title" className="partners-label">
            In Partnership With
          </h2>
          <div className="partners-row">
            {['NCMEC', 'FBI', 'AMBER Alert', 'DOJ', 'ICE HSI'].map((name) => (
              <div className="partner-logo" key={name}>
                {name}
              </div>
            ))}
          </div>
          <p className="partners-disclaimer">
            * Partnership logos shown for design purposes only. This is a demo platform.
          </p>
        </div>
      </section>
    </div>
  );
}
