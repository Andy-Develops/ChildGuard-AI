import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_CASES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './GalleryPage.css';

const STATES = [...new Set(MOCK_CASES.map((c) => c.missingFrom.split(', ')[1]))].sort();
const GENDERS = ['Male', 'Female'];

function CaseCard({ caseData, isLE }) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(caseData.lastSeenDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const urgencyClass = daysAgo < 7 ? 'urgency-critical' : daysAgo < 30 ? 'urgency-high' : 'urgency-normal';

  return (
    <article className={`case-card ${urgencyClass}`} aria-label={`Missing child case: ${caseData.name}`}>
      <div
        className="case-card-photo"
        style={{ background: `linear-gradient(135deg, ${caseData.photoPlaceholderColor} 0%, #060E1C 100%)` }}
        aria-hidden="true"
      >
        {/* In production: <img src={presignedUrl} alt={`${caseData.name}`} /> */}
        {/* TODO: AWS Rekognition integration — face search across case photos on sighting submission */}
        <div className="photo-initials">{caseData.photoInitials}</div>
        <div className="photo-demo-label">DEMO PHOTO</div>
        <div className={`status-dot ${caseData.status === 'active' ? 'active' : 'found'}`} aria-label={`Status: ${caseData.status}`} />
      </div>

      <div className="case-card-body">
        <div className="case-card-header">
          <span className="case-number">{caseData.caseNumber}</span>
          <span className={`badge ${caseData.status === 'active' ? 'badge-active' : 'badge-found'}`}>
            {caseData.status === 'active' ? 'ACTIVE' : 'FOUND'}
          </span>
        </div>

        <h2 className="case-card-name">{caseData.name}</h2>

        <div className="case-card-details">
          <div className="detail-row">
            <span className="detail-label">Age</span>
            <span className="detail-value">{caseData.age} years old</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{caseData.gender}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Missing From</span>
            <span className="detail-value">{caseData.missingFrom}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Seen</span>
            <span className="detail-value">
              {new Date(caseData.lastSeenDate).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
              {' '}
              <span className="days-ago">({daysAgo} days ago)</span>
            </span>
          </div>
          {isLE && (
            <div className="detail-row">
              <span className="detail-label">Agency</span>
              <span className="detail-value le-only">{caseData.caseAgency}</span>
            </div>
          )}
        </div>

        <div className="case-card-excerpt">
          {caseData.circumstance.substring(0, 100)}…
        </div>

        <div className="case-card-actions">
          <Link to={`/gallery/${caseData.id}`} className="btn btn-primary case-btn">
            View Full Case
          </Link>
          <Link to={`/submit-sighting?case=${caseData.id}`} className="btn btn-outline case-btn">
            Submit Sighting
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function GalleryPage() {
  const { isLawEnforcement } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [sortBy, setSortBy] = useState('recent');

  const filteredCases = useMemo(() => {
    let cases = [...MOCK_CASES];

    // Text search: name, location, case number, description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cases = cases.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.missingFrom.toLowerCase().includes(q) ||
        c.lastSeenLocation.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.circumstance.toLowerCase().includes(q)
      );
    }

    if (filterState) {
      cases = cases.filter((c) => c.missingFrom.includes(filterState));
    }

    if (filterGender) {
      cases = cases.filter((c) => c.gender === filterGender);
    }

    if (filterStatus) {
      cases = cases.filter((c) => c.status === filterStatus);
    }

    // Sort
    if (sortBy === 'recent') {
      cases.sort((a, b) => new Date(b.lastSeenDate) - new Date(a.lastSeenDate));
    } else if (sortBy === 'oldest') {
      cases.sort((a, b) => new Date(a.lastSeenDate) - new Date(b.lastSeenDate));
    } else if (sortBy === 'name') {
      cases.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'age') {
      cases.sort((a, b) => a.age - b.age);
    }

    return cases;
  }, [searchQuery, filterState, filterGender, filterStatus, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setFilterState('');
    setFilterGender('');
    setFilterStatus('active');
    setSortBy('recent');
  };

  const activeFilterCount = [
    searchQuery,
    filterState,
    filterGender,
    filterStatus !== 'active' ? filterStatus : '',
    sortBy !== 'recent' ? sortBy : '',
  ].filter(Boolean).length;

  return (
    <div className="gallery-page">
      {/* ── Page Header ── */}
      <div className="gallery-header">
        <div className="container">
          <div className="gallery-header-content">
            <div>
              <div className="page-eyebrow">Missing Children Database</div>
              <h1 className="page-title">Missing Children Gallery</h1>
              <p className="page-description">
                {MOCK_CASES.filter((c) => c.status === 'active').length} active cases.
                If you have information about any of these individuals, please submit a sighting
                or contact the listed agency directly.
              </p>
            </div>
            {isLawEnforcement && (
              <div className="le-access-badge" role="note">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" />
                </svg>
                Law Enforcement Access — Full Details Visible
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="filters-bar">
        <div className="container">
          <div className="filters-inner">
            {/* Search */}
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="search-input"
                placeholder="Search by name, location, case number…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search missing children cases"
              />
            </div>

            {/* Filter controls */}
            <div className="filter-controls">
              <select
                className="filter-select"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                aria-label="Filter by state"
              >
                <option value="">All States</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                aria-label="Filter by gender"
              >
                <option value="">All Genders</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="Filter by case status"
              >
                <option value="">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="found">Found / Resolved</option>
              </select>

              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort cases"
              >
                <option value="recent">Sort: Most Recent</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="name">Sort: Name A–Z</option>
                <option value="age">Sort: Youngest First</option>
              </select>

              {activeFilterCount > 0 && (
                <button className="clear-filters-btn" onClick={clearFilters} aria-label="Clear all filters">
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="gallery-content container">
        <div className="results-info" role="status" aria-live="polite">
          Showing <strong>{filteredCases.length}</strong> of{' '}
          <strong>{MOCK_CASES.length}</strong> cases
          {searchQuery && (
            <span className="search-term"> for "{searchQuery}"</span>
          )}
        </div>

        {filteredCases.length === 0 ? (
          <div className="no-results" role="alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <h3>No cases found</h3>
            <p>Try adjusting your search or clearing filters.</p>
            <button className="btn btn-outline" onClick={clearFilters}>Clear All Filters</button>
          </div>
        ) : (
          <div className="cases-grid" role="list" aria-label="Missing children cases">
            {filteredCases.map((c) => (
              <div key={c.id} role="listitem">
                <CaseCard caseData={c} isLE={isLawEnforcement} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Submit tip banner ── */}
      <div className="gallery-tip-banner container">
        <div className="tip-banner-inner">
          <div className="tip-banner-text">
            <strong>Have you seen someone?</strong>
            <span> Submit a sighting report — all tips go directly to investigators.</span>
          </div>
          <Link to="/submit-sighting" className="btn btn-primary">
            Submit a Sighting
          </Link>
        </div>
      </div>
    </div>
  );
}
