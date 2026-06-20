import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const TEAM_PRINCIPLES = [
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'All case data is encrypted at rest and in transit. Public access is limited to basic case information. Full details are restricted to verified law enforcement accounts.',
  },
  {
    icon: '⚡',
    title: 'Speed of Response',
    desc: 'Every second counts. Our infrastructure is built for rapid alert distribution — from case entry to law enforcement notification in under 60 seconds.',
  },
  {
    icon: '🤝',
    title: 'Community Power',
    desc: 'Most missing children are found with community tips. Our platform makes it as easy as possible for the public to submit sightings directly to investigators.',
  },
  {
    icon: '🏛️',
    title: 'LE Partnership',
    desc: 'Built alongside law enforcement agencies. Verified LE accounts have access to full case details, contact information, and case management tools.',
  },
];

const TECH_STACK = [
  {
    service: 'AWS Amplify',
    logo: '🚀',
    role: 'Frontend hosting, CI/CD pipeline, full-stack backend provisioning',
  },
  {
    service: 'Amazon Cognito',
    logo: '👤',
    role: 'User authentication, role-based access control (Public / Law Enforcement / Admin)',
  },
  {
    service: 'Amazon S3',
    logo: '🗄️',
    role: 'Secure photo storage with pre-signed URLs and restricted bucket policies',
  },
  {
    service: 'Amazon DynamoDB',
    logo: '💾',
    role: 'Case database, sightings storage, audit logging — serverless and auto-scaling',
  },
  {
    service: 'AWS Rekognition',
    logo: '👁️',
    role: '[ COMING SOON ] Facial recognition for sighting-to-case photo matching',
    comingSoon: true,
  },
  {
    service: 'Amazon SNS',
    logo: '🔔',
    role: 'Real-time alerts to law enforcement when high-confidence sightings are submitted',
  },
  {
    service: 'Amazon SES',
    logo: '📧',
    role: 'Confirmation emails to tipsters, case update notifications',
  },
  {
    service: 'AWS Lambda',
    logo: '⚡',
    role: 'Serverless backend functions: Rekognition triggers, alert routing, audit logging',
  },
];

const TIMELINE = [
  { phase: 'Phase 1', label: 'Core Platform', status: 'current', desc: 'Case gallery, community sighting submission, Cognito auth, S3 photo storage' },
  { phase: 'Phase 2', label: 'AI Matching', status: 'upcoming', desc: 'AWS Rekognition face indexing, automated sighting-to-case matching, confidence scoring' },
  { phase: 'Phase 3', label: 'LE Tools', status: 'upcoming', desc: 'Case management dashboard, inter-agency sharing, real-time AMBER alert integration' },
  { phase: 'Phase 4', label: 'Mobile', status: 'upcoming', desc: 'React Native mobile apps for public sighting submission and LE field access' },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container">
          <div className="page-eyebrow">About the Platform</div>
          <h1 className="about-title">ChildGuard AI</h1>
          <p className="about-subtitle">
            Missing Child Detection &amp; Rapid Alert Platform
          </p>
          <p className="about-description">
            ChildGuard AI is a demonstration platform designed to showcase how modern
            cloud technology — AWS Amplify, Amazon Cognito, S3, DynamoDB, and AI services
            — can be combined to create a powerful missing child detection and alert system.
          </p>
          <div className="demo-callout" role="note">
            <strong>⚠️ Important:</strong> This is a demonstration environment. All cases,
            persons, and data shown are entirely fictional. This platform is not connected to
            any real law enforcement database or active missing child cases.
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-section">
        <div className="container">
          <div className="about-split">
            <div className="about-split-text">
              <h2 className="section-title">Our Mission</h2>
              <p>
                Every year, hundreds of thousands of children are reported missing in the United
                States alone. The National Center for Missing &amp; Exploited Children (NCMEC)
                handles over 20,000 cases annually. The first hours after a child goes missing
                are the most critical.
              </p>
              <p>
                ChildGuard AI is built around the belief that technology — specifically cloud
                computing and artificial intelligence — can significantly reduce the time between
                a child going missing and a successful recovery.
              </p>
              <p>
                By creating a centralized, searchable case database accessible to both the public
                and law enforcement, and by enabling rapid community sighting reports, we create
                a network effect that amplifies the reach of every investigation.
              </p>
            </div>
            <div className="about-split-stats">
              <div className="mission-stat">
                <div className="mission-stat-num">800K+</div>
                <div className="mission-stat-label">Children reported missing in the US annually</div>
                <div className="mission-stat-source">Source: NCMEC (illustrative)</div>
              </div>
              <div className="mission-stat">
                <div className="mission-stat-num">76%</div>
                <div className="mission-stat-label">Of abducted children are killed within the first 3 hours</div>
                <div className="mission-stat-source">Source: Research literature (illustrative)</div>
              </div>
              <div className="mission-stat">
                <div className="mission-stat-num">97%</div>
                <div className="mission-stat-label">Recovery rate when AMBER Alert is activated quickly</div>
                <div className="mission-stat-source">Source: AMBER Alert program (illustrative)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NCMEC Partnership ── */}
      <section className="ncmec-section">
        <div className="container">
          <div className="ncmec-card">
            <div className="ncmec-badge" aria-hidden="true">🤝</div>
            <div className="ncmec-content">
              <h2>NCMEC Partnership</h2>
              <p>
                ChildGuard AI is designed to integrate with the National Center for Missing
                &amp; Exploited Children (NCMEC) data feeds, allowing case information to be
                synchronized with the national database automatically.
              </p>
              <p>
                The NCMEC operates the CyberTipline, the national 24-hour hotline
                (1-800-THE-LOST), and coordinates with law enforcement agencies nationwide.
                ChildGuard AI is built to complement — not replace — the NCMEC infrastructure.
              </p>
              <div className="ncmec-links">
                <a
                  href="https://www.missingkids.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  Visit NCMEC.org ↗
                </a>
                <a
                  href="tel:18008435678"
                  className="btn btn-outline"
                >
                  📞 1-800-THE-LOST
                </a>
              </div>
              <p className="ncmec-disclaimer">
                * This platform is a technical demonstration. There is no current formal
                partnership with NCMEC. The NCMEC name and logo are used here for illustrative
                purposes only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Principles ── */}
      <section className="about-section">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title">Core Principles</h2>
          </div>
          <div className="principles-grid">
            {TEAM_PRINCIPLES.map((p) => (
              <div className="principle-card" key={p.title}>
                <div className="principle-icon" aria-hidden="true">{p.icon}</div>
                <h3 className="principle-title">{p.title}</h3>
                <p className="principle-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology ── */}
      <section className="about-section tech-section">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-title">Technology Stack</h2>
            <p className="section-subtitle">Built entirely on AWS — secure, scalable, and serverless.</p>
          </div>

          <div className="tech-grid">
            {TECH_STACK.map((t) => (
              <div className={`tech-card ${t.comingSoon ? 'tech-coming-soon' : ''}`} key={t.service}>
                <div className="tech-logo" aria-hidden="true">{t.logo}</div>
                <div className="tech-info">
                  <div className="tech-name">
                    {t.service}
                    {t.comingSoon && (
                      <span className="coming-soon-tag">Coming Soon</span>
                    )}
                  </div>
                  <div className="tech-role">{t.role}</div>
                  {t.service === 'AWS Rekognition' && (
                    <div className="rekognition-todo">
                      {/* TODO: AWS Rekognition integration — Phase 2 feature */}
                      See Phase 2 roadmap below for implementation details.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture diagram placeholder ── */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 24 }}>System Architecture</h2>
          <div className="arch-diagram" aria-label="System architecture diagram placeholder">
            <div className="arch-layer arch-layer-client">
              <div className="arch-layer-label">Client Layer</div>
              <div className="arch-nodes">
                <div className="arch-node">React App<br /><small>Amplify Hosting</small></div>
                <div className="arch-node">Mobile App<br /><small>Phase 4</small></div>
              </div>
            </div>
            <div className="arch-arrow" aria-hidden="true">↕</div>
            <div className="arch-layer arch-layer-auth">
              <div className="arch-layer-label">Auth Layer</div>
              <div className="arch-nodes">
                <div className="arch-node">Amazon Cognito<br /><small>User Pools + Groups</small></div>
              </div>
            </div>
            <div className="arch-arrow" aria-hidden="true">↕</div>
            <div className="arch-layer arch-layer-api">
              <div className="arch-layer-label">API Layer</div>
              <div className="arch-nodes">
                <div className="arch-node">AppSync<br /><small>GraphQL API</small></div>
                <div className="arch-node">API Gateway<br /><small>REST endpoints</small></div>
              </div>
            </div>
            <div className="arch-arrow" aria-hidden="true">↕</div>
            <div className="arch-layer arch-layer-data">
              <div className="arch-layer-label">Data Layer</div>
              <div className="arch-nodes">
                <div className="arch-node">DynamoDB<br /><small>Cases / Sightings</small></div>
                <div className="arch-node">S3<br /><small>Photos</small></div>
                <div className="arch-node arch-node-future">Rekognition<br /><small>Phase 2</small></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 32 }}>Product Roadmap</h2>
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <div key={i} className={`timeline-item ${item.status}`}>
                <div className="timeline-marker" aria-hidden="true">
                  {item.status === 'current' ? '●' : '○'}
                </div>
                <div className="timeline-content">
                  <div className="timeline-phase">{item.phase}</div>
                  <div className="timeline-label">
                    {item.label}
                    {item.status === 'current' && (
                      <span className="timeline-badge">IN PROGRESS</span>
                    )}
                  </div>
                  <div className="timeline-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2>Ready to Explore the Platform?</h2>
            <p>
              Browse the demo gallery, try submitting a sighting report, or sign in with
              one of the test accounts to explore role-based access control.
            </p>
            <div className="about-cta-actions">
              <Link to="/gallery" className="btn btn-primary btn-lg">View Missing Children Gallery</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Sign In with Demo Account</Link>
            </div>
            <div className="demo-accounts-preview">
              <p className="demo-accounts-label">Demo Login Credentials</p>
              <div className="demo-accounts-grid">
                <div className="demo-account">
                  <span className="demo-role role-public">Public</span>
                  <code>public.demo@childguard-demo.test</code>
                  <code>Demo@Public2024</code>
                </div>
                <div className="demo-account">
                  <span className="demo-role role-le">Law Enforcement</span>
                  <code>officer.demo@childguard-demo.test</code>
                  <code>Demo@Officer2024</code>
                </div>
                <div className="demo-account">
                  <span className="demo-role role-admin">Admin</span>
                  <code>admin.demo@childguard-demo.test</code>
                  <code>Demo@Admin2024</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
