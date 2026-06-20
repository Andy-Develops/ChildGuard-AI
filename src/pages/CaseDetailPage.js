import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_CASES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './CaseDetailPage.css';

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const { isLawEnforcement, isAdmin } = useAuth();
  const navigate = useNavigate();

  const caseData = MOCK_CASES.find((c) => c.id === caseId);

  if (!caseData) {
    return (
      <div className="case-not-found container">
        <h1>Case Not Found</h1>
        <p>Case ID "{caseId}" does not exist in the database.</p>
        <Link to="/gallery" className="btn btn-primary">← Back to Gallery</Link>
      </div>
    );
  }

  const daysAgo = Math.floor(
    (Date.now() - new Date(caseData.lastSeenDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="case-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/gallery">Missing Children Gallery</Link>
          <span aria-hidden="true"> / </span>
          <span>{caseData.name}</span>
        </nav>

        {/* Alert banner */}
        <div className="case-alert-banner" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <strong>ACTIVE MISSING PERSON CASE</strong>
            <p>
              If you have seen or have information about {caseData.name}, contact{' '}
              <strong>{caseData.caseAgency}</strong> immediately or call{' '}
              <strong>1-800-THE-LOST (1-800-843-5678)</strong>.
              For emergencies, call <strong>911</strong>.
            </p>
          </div>
        </div>

        <div className="case-detail-layout">
          {/* ── Left: Photo + quick facts ── */}
          <aside className="case-sidebar">
            {/* Photo */}
            <div
              className="case-detail-photo"
              style={{ background: `linear-gradient(135deg, ${caseData.photoPlaceholderColor} 0%, #060E1C 100%)` }}
              aria-label={`Photo placeholder for ${caseData.name}`}
            >
              {/* In production: <img src={s3PresignedUrl} alt={`${caseData.name}`} /> */}
              {/* TODO: AWS Rekognition integration — face index this photo for sighting match queries */}
              <div className="detail-photo-initials">{caseData.photoInitials}</div>
              <div className="detail-photo-demo">DEMO ONLY — NOT A REAL PERSON</div>
            </div>

            {/* Quick Physical Description */}
            <div className="quick-facts">
              <h3 className="quick-facts-title">Physical Description</h3>
              <table className="facts-table" aria-label="Physical description">
                <tbody>
                  {[
                    ['Height', caseData.height],
                    ['Weight', caseData.weight],
                    ['Hair', caseData.hairColor],
                    ['Eyes', caseData.eyeColor],
                    ['Race', caseData.race],
                    ['Gender', caseData.gender],
                    ['Age', `${caseData.age} years`],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Case metadata */}
            <div className="quick-facts">
              <h3 className="quick-facts-title">Case Information</h3>
              <table className="facts-table" aria-label="Case information">
                <tbody>
                  <tr>
                    <th scope="row">Case #</th>
                    <td>{caseData.caseNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">NCMEC</th>
                    <td>{caseData.ncmecNumber}</td>
                  </tr>
                  <tr>
                    <th scope="row">Status</th>
                    <td>
                      <span className={`badge ${caseData.status === 'active' ? 'badge-active' : 'badge-found'}`}>
                        {caseData.status === 'active' ? 'ACTIVE' : 'FOUND'}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Missing</th>
                    <td>{daysAgo} days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* LE-only contact info */}
            {isLawEnforcement && (
              <div className="le-only-panel" role="region" aria-label="Law enforcement information">
                <div className="le-panel-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                  </svg>
                  Law Enforcement Only
                </div>
                <div className="le-panel-body">
                  <p className="le-field-label">Investigating Agency</p>
                  <p className="le-field-value">{caseData.caseAgency}</p>
                  <p className="le-field-label" style={{ marginTop: 12 }}>Case Contact (Demo)</p>
                  <p className="le-field-value">Det. Jane Smith — (555) 000-0000</p>
                  <p className="le-field-label" style={{ marginTop: 12 }}>Family Contact (Demo)</p>
                  <p className="le-field-value">Redacted — Available in production</p>
                  <p className="le-note">
                    ⚠️ All contact information is fictional. In production this data
                    is encrypted in DynamoDB and accessible only to verified LE accounts.
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="sidebar-actions">
              <Link
                to={`/submit-sighting?case=${caseData.id}`}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Submit a Sighting
              </Link>
              <button
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                Share This Case
              </button>
            </div>
          </aside>

          {/* ── Right: Case details ── */}
          <div className="case-main">
            {/* Name & badge */}
            <div className="case-main-header">
              <div className="case-main-meta">
                <span className="case-main-number">{caseData.caseNumber}</span>
                <span className={`badge ${caseData.status === 'active' ? 'badge-active' : 'badge-found'}`}>
                  {caseData.status === 'active' ? 'ACTIVE' : 'FOUND'}
                </span>
              </div>
              <h1 className="case-main-name">{caseData.name}</h1>
              <p className="case-main-subtitle">
                {caseData.age} years old · {caseData.gender} · {caseData.race}
              </p>
            </div>

            {/* Last known info */}
            <div className="info-section">
              <h2 className="info-section-title">Last Known Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-item-icon" aria-hidden="true">📍</div>
                  <div>
                    <div className="info-item-label">Last Seen Location</div>
                    <div className="info-item-value">{caseData.lastSeenLocation}</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon" aria-hidden="true">📅</div>
                  <div>
                    <div className="info-item-label">Date Last Seen</div>
                    <div className="info-item-value">
                      {new Date(caseData.lastSeenDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      <span className="info-days-ago"> ({daysAgo} days ago)</span>
                    </div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon" aria-hidden="true">🏠</div>
                  <div>
                    <div className="info-item-label">Missing From</div>
                    <div className="info-item-value">{caseData.missingFrom}</div>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-item-icon" aria-hidden="true">🏛️</div>
                  <div>
                    <div className="info-item-label">Investigating Agency</div>
                    <div className="info-item-value">{caseData.caseAgency}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Circumstances */}
            <div className="info-section">
              <h2 className="info-section-title">Circumstances of Disappearance</h2>
              <div className="circumstances-box">
                <p>{caseData.circumstance}</p>
                <p className="circumstances-demo-note">
                  [DEMO] — This is fictional narrative. In production, case narratives are
                  submitted by law enforcement and stored in DynamoDB.
                </p>
              </div>
            </div>

            {/* How to help */}
            <div className="info-section">
              <h2 className="info-section-title">How You Can Help</h2>
              <div className="help-cards">
                <div className="help-card">
                  <div className="help-card-num">1</div>
                  <h3>Check Your Photos</h3>
                  <p>Review photos and videos from the area around {caseData.lastSeenLocation} on {new Date(caseData.lastSeenDate).toLocaleDateString()}.</p>
                </div>
                <div className="help-card">
                  <div className="help-card-num">2</div>
                  <h3>Submit a Sighting</h3>
                  <p>If you believe you've seen {caseData.name.split(' ')[0]}, submit a sighting report with location and description.</p>
                </div>
                <div className="help-card">
                  <div className="help-card-num">3</div>
                  <h3>Share This Case</h3>
                  <p>Share this page on social media. The more eyes on a case, the higher the chance of a successful tip.</p>
                </div>
              </div>
            </div>

            {/* AI Future Integration Note */}
            <div className="rekognition-note">
              {/* TODO: AWS Rekognition integration — when a sighting photo is submitted,
                   Rekognition CompareFaces API will be called to calculate a similarity score
                   against this case's indexed face. Matches above 90% confidence will
                   auto-alert the investigating LE agency. */}
              <div className="rekognition-note-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4l3 3" strokeLinecap="round" />
                </svg>
                <div>
                  <strong>Coming Soon: AI-Powered Matching</strong>
                  <p>
                    Facial recognition via AWS Rekognition will automatically compare sighting
                    photos against case database records, flagging potential matches for
                    investigator review.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="case-navigation">
              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <Link to="/gallery" className="btn btn-outline">
                All Cases
              </Link>
              <Link to={`/submit-sighting?case=${caseData.id}`} className="btn btn-primary">
                Submit Sighting for This Case
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
