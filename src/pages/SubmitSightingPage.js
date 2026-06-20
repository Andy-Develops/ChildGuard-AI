import React, { useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_CASES } from '../data/mockData';
import './SubmitSightingPage.css';

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

const UPLOAD_URL_ENDPOINT = '/api/upload';

const INITIAL_FORM = {
  relatedCaseId: '',
  sightingDate: '',
  sightingTime: '',
  sightingLocation: '',
  sightingDescription: '',
  photoFile: null,
  photoPreview: null,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  shareContactWithLE: true,
  certified: false,
};

export default function SubmitSightingPage() {
  const [searchParams] = useSearchParams();
  const preselectedCaseId = searchParams.get('case') || '';

  const [form, setForm] = useState({
    ...INITIAL_FORM,
    relatedCaseId: preselectedCaseId,
  });

  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const preselectedCase = MOCK_CASES.find((c) => c.id === preselectedCaseId);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const processFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photoFile: 'Please upload an image file.' }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photoFile: 'File must be under ' + MAX_FILE_SIZE_MB + 'MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, photoFile: file, photoPreview: reader.result }));
      setErrors((prev) => ({ ...prev, photoFile: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const removePhoto = () => {
    setForm((prev) => ({ ...prev, photoFile: null, photoPreview: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!form.sightingDate) errs.sightingDate = 'Date of sighting is required.';
    if (!form.sightingLocation.trim()) errs.sightingLocation = 'Location is required.';
    if (form.sightingDescription.trim().length < 20) {
      errs.sightingDescription = 'Please provide at least 20 characters of description.';
    }
    if (!form.certified) {
      errs.certified = 'You must certify this report is truthful.';
    }
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.contactEmail)) {
      errs.contactEmail = 'Please enter a valid email address.';
    }
    if (form.sightingDate) {
      const d = new Date(form.sightingDate);
      if (d > new Date()) errs.sightingDate = 'Sighting date cannot be in the future.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitState('submitting');

    try {
      if (form.photoFile) {
        var canvas = document.createElement('canvas');
        var img = new Image();
        var blob = await new Promise(function(resolve) {
          img.onload = function() {
            var maxW = 1200;
            var scale = Math.min(1, maxW / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(function(b) { resolve(b); }, 'image/jpeg', 0.7);
          };
          img.src = URL.createObjectURL(form.photoFile);
        });
        var response = await fetch(UPLOAD_URL_ENDPOINT, {
          method: 'POST',
          body: blob,
          headers: { 'Content-Type': 'image/jpeg' },
        });
        var data = await response.json();
        console.log('Photo uploaded successfully:', data.fileKey);
      }
      setSubmitState('success');
    } catch (err) {
      console.error('Sighting submission error:', err);
      alert('Error: ' + err.message);
      setSubmitState('error');
    }
  };

  if (submitState === 'success') {
    return (
      <div className="submit-page">
        <div className="container">
          <div className="success-screen">
            <h1>Sighting Report Submitted</h1>
            <p>Thank you. Your photo is being analyzed by our AI system. If a match is found, law enforcement will be notified immediately.</p>
            <div className="success-actions">
              <Link to="/gallery" className="btn btn-primary">View More Cases</Link>
              <button className="btn btn-outline" onClick={() => { setForm({ ...INITIAL_FORM, relatedCaseId: preselectedCaseId }); setSubmitState('idle'); }}>Submit Another Sighting</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-page">
      <div className="container">
        <div className="submit-header">
          <div className="page-eyebrow">Community Reporting</div>
          <h1 className="page-title">Submit a Sighting</h1>
          <p className="page-description">
            If you believe you have seen a missing child, please complete this report.
            <strong> For emergencies, call 911 immediately.</strong>
          </p>
        </div>

        <div className="submit-layout">
          <form className="sighting-form" onSubmit={handleSubmit} noValidate>

            <fieldset className="form-section">
              <legend className="form-section-title"><span className="step-num">1</span> Related Case (Optional)</legend>
              {!preselectedCase && (
                <div className="form-field">
                  <label htmlFor="relatedCaseId" className="form-label">Associate with a specific case</label>
                  <select id="relatedCaseId" name="relatedCaseId" className="form-select" value={form.relatedCaseId} onChange={handleChange}>
                    <option value="">-- Not sure / General sighting --</option>
                    {MOCK_CASES.map((c) => (<option key={c.id} value={c.id}>{c.name} ({c.caseNumber})</option>))}
                  </select>
                </div>
              )}
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section-title"><span className="step-num">2</span> Sighting Details</legend>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="sightingDate" className="form-label">Date of Sighting *</label>
                  <input type="date" id="sightingDate" name="sightingDate" className={'form-input' + (errors.sightingDate ? ' input-error' : '')} value={form.sightingDate} onChange={handleChange} required />
                  {errors.sightingDate && <p className="field-error">{errors.sightingDate}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor="sightingTime" className="form-label">Approximate Time</label>
                  <input type="time" id="sightingTime" name="sightingTime" className="form-input" value={form.sightingTime} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="sightingLocation" className="form-label">Location *</label>
                <input type="text" id="sightingLocation" name="sightingLocation" className={'form-input' + (errors.sightingLocation ? ' input-error' : '')} placeholder="Street address, intersection, or landmark" value={form.sightingLocation} onChange={handleChange} required />
                {errors.sightingLocation && <p className="field-error">{errors.sightingLocation}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="sightingDescription" className="form-label">Description *</label>
                <textarea id="sightingDescription" name="sightingDescription" className={'form-textarea' + (errors.sightingDescription ? ' input-error' : '')} rows={6} placeholder="Describe what you saw in detail..." value={form.sightingDescription} onChange={handleChange} required />
                {errors.sightingDescription && <p className="field-error">{errors.sightingDescription}</p>}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section-title"><span className="step-num">3</span> Photo (Optional but Helpful)</legend>
              <p className="section-intro">Photos are stored securely and automatically analyzed by our AI system.</p>
              {!form.photoPreview ? (
                <div className={'photo-dropzone' + (dragOver ? ' drag-over' : '') + (errors.photoFile ? ' dropzone-error' : '')} onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                  <p className="dropzone-text">Drag and drop a photo or click to browse</p>
                  <p className="dropzone-sub">JPG, PNG, WebP, HEIC - max {MAX_FILE_SIZE_MB}MB</p>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="file-input-hidden" />
                </div>
              ) : (
                <div className="photo-preview-container">
                  <img src={form.photoPreview} alt="Preview" className="photo-preview-img" />
                  <div className="photo-preview-info">
                    <p className="photo-preview-name">{form.photoFile.name}</p>
                    <button type="button" className="btn btn-danger btn-sm" onClick={removePhoto}>Remove Photo</button>
                  </div>
                </div>
              )}
              {errors.photoFile && <p className="field-error">{errors.photoFile}</p>}
            </fieldset>

            <fieldset className="form-section">
              <legend className="form-section-title"><span className="step-num">4</span> Your Contact Information (Optional)</legend>
              <p className="section-intro">Anonymous submissions are accepted.</p>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="contactName" className="form-label">Your Name</label>
                  <input type="text" id="contactName" name="contactName" className="form-input" placeholder="First and last name" value={form.contactName} onChange={handleChange} />
                </div>
                <div className="form-field">
                  <label htmlFor="contactPhone" className="form-label">Phone Number</label>
                  <input type="tel" id="contactPhone" name="contactPhone" className="form-input" placeholder="(555) 000-0000" value={form.contactPhone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="contactEmail" className="form-label">Email Address</label>
                <input type="email" id="contactEmail" name="contactEmail" className={'form-input' + (errors.contactEmail ? ' input-error' : '')} placeholder="you@example.com" value={form.contactEmail} onChange={handleChange} />
                {errors.contactEmail && <p className="field-error">{errors.contactEmail}</p>}
              </div>
              <label className="checkbox-label">
                <input type="checkbox" name="shareContactWithLE" checked={form.shareContactWithLE} onChange={handleChange} className="checkbox-input" />
                <span className="checkbox-text">I consent to sharing my contact info with law enforcement</span>
              </label>
            </fieldset>

            <fieldset className="form-section certification-section">
              <legend className="form-section-title"><span className="step-num">5</span> Certification</legend>
              <div className={'certification-box' + (errors.certified ? ' cert-error' : '')}>
                <label className="checkbox-label">
                  <input type="checkbox" name="certified" checked={form.certified} onChange={handleChange} className="checkbox-input" required />
                  <span className="checkbox-text"><strong>I certify that the information I have provided is truthful and accurate.</strong> Filing a false report may be subject to legal penalty.</span>
                </label>
                {errors.certified && <p className="field-error">{errors.certified}</p>}
              </div>
            </fieldset>

            <div className="form-submit-area">
              <button type="submit" className={'btn btn-primary btn-lg submit-btn' + (submitState === 'submitting' ? ' loading' : '')} disabled={submitState === 'submitting'}>
                {submitState === 'submitting' ? 'Submitting Report...' : 'Submit Sighting Report'}
              </button>
              {submitState === 'error' && <p className="field-error">Submission failed. Please try again or call 1-800-THE-LOST directly.</p>}
            </div>
          </form>

          <aside className="submit-sidebar">
            <div className="info-box">
              <h3 className="info-box-title">Emergency?</h3>
              <p>If the child is in immediate danger:</p>
              <div className="emergency-call">Call 911</div>
            </div>
            <div className="info-box">
              <h3 className="info-box-title">What to Include</h3>
              <ul className="info-list">
                <li>Exact location</li>
                <li>Date and approximate time</li>
                <li>Physical description</li>
                <li>Clothing description</li>
                <li>Direction of travel</li>
                <li>Vehicle description if applicable</li>
              </ul>
            </div>
            <div className="info-box">
              <h3 className="info-box-title">Privacy</h3>
              <p>Contact information is encrypted and only accessible to verified law enforcement.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
