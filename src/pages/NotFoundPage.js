import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="notfound-page container">
      <div className="notfound-content">
        <div className="notfound-code" aria-hidden="true">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-desc">
          This page doesn't exist in the ChildGuard AI platform.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">Go to Homepage</Link>
          <Link to="/gallery" className="btn btn-outline">View Missing Children Gallery</Link>
        </div>
      </div>
    </div>
  );
}
