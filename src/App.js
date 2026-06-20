import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import DemoBanner from './components/DemoBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import CaseDetailPage from './pages/CaseDetailPage';
import SubmitSightingPage from './pages/SubmitSightingPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Fixed demo environment banner — always visible */}
        <DemoBanner />

        {/* Fixed top navigation */}
        <Navbar />

        {/* Page content */}
        <main id="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/gallery/:caseId" element={<CaseDetailPage />} />
            <Route path="/submit-sighting" element={<SubmitSightingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </Router>
    </AuthProvider>
  );
}
