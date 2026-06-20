import React from 'react';
import './DemoBanner.css';

/**
 * DemoBanner — fixed top strip present on every page.
 * Clearly labels the environment as non-production so no real data is mistakenly entered.
 */
export default function DemoBanner() {
  return (
    <div className="demo-banner" role="banner" aria-label="Demo environment notice">
      ⚠️&nbsp;&nbsp;DEMO ENVIRONMENT — ALL DATA IS FICTIONAL — NOT FOR OPERATIONAL USE&nbsp;&nbsp;⚠️
    </div>
  );
}
