import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-col footer-brand-col">
            <div className="footer-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="#2E86C1"
                  opacity="0.9"
                />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>ChildGuard AI</span>
            </div>
            <p className="footer-tagline">
              Missing Child Detection &amp; Alert Platform
            </p>
            <div className="footer-demo-note" role="note">
              ⚠️ DEMO ENVIRONMENT — Fictional data only
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h3 className="footer-heading">Platform</h3>
            <ul role="list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/gallery">Missing Children Gallery</Link></li>
              <li><Link to="/submit-sighting">Submit a Sighting</Link></li>
              <li><Link to="/about">About ChildGuard AI</Link></li>
              <li><Link to="/login">Law Enforcement Login</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h3 className="footer-heading">Resources</h3>
            <ul role="list">
              <li>
                <a href="https://www.missingkids.org" target="_blank" rel="noopener noreferrer">
                  NCMEC ↗
                </a>
              </li>
              <li>
                <a href="https://www.fbi.gov/investigate/violent-crime/missing-persons" target="_blank" rel="noopener noreferrer">
                  FBI Missing Persons ↗
                </a>
              </li>
              <li>
                <a href="https://www.amberalert.gov" target="_blank" rel="noopener noreferrer">
                  AMBER Alert ↗
                </a>
              </li>
              <li>
                <a href="https://www.childhelp.org/hotline/" target="_blank" rel="noopener noreferrer">
                  Childhelp Hotline ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Emergency */}
          <div className="footer-col">
            <h3 className="footer-heading">Emergency</h3>
            <div className="emergency-box" role="note">
              <p className="emergency-label">If a child is in immediate danger</p>
              <p className="emergency-number">Call 911</p>
              <p className="emergency-label" style={{ marginTop: '12px' }}>NCMEC Hotline</p>
              <p className="emergency-number ncmec">1-800-THE-LOST</p>
              <p className="emergency-sub">(1-800-843-5678)</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>
            &copy; {year} ChildGuard AI — Demo Platform. All cases and persons depicted are entirely fictional.
          </p>
          <p className="footer-tech">
            Powered by&nbsp;
            <span className="tech-tag">AWS Amplify</span>
            <span className="tech-tag">Amazon Cognito</span>
            <span className="tech-tag">Amazon S3</span>
            <span className="tech-tag">DynamoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
