import React, { useState } from 'react';
const UPLOAD_URL = '/api/upload';
const CREATE_CASE_URL = '/api/create-case';
export default function AdminCreateCase() {
  const [form, setForm] = useState({caseNumber:'', childName:'', age:'', description:''});
  const [photo, setPhoto] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (field) => (e) => setForm({...form, [field]: e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo || !form.caseNumber || !form.childName) {
      setStatus('Fill in required fields and upload a photo.');
      return;
    }
    setLoading(true);
    setStatus('Uploading...');
    try {
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({filename: photo.name, contentType: photo.type})
      });
      const data = await res.json();
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {'Content-Type': photo.type},
        body: photo
      });
      setStatus('Creating case...');
      const caseRes = await fetch(CREATE_CASE_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...form, photoKey: data.fileKey})
      });
      const caseData = await caseRes.json();
      if (caseData.status === 'case_created') {
        setStatus('Case created! Face indexed. Case: ' + form.caseNumber);
        setForm({caseNumber:'', childName:'', age:'', description:''});
        setPhoto(null);
      } else {
        setStatus('Error: ' + (caseData.error || 'Unknown'));
      }
    } catch (err) { setStatus('Error: ' + err.message); }
    setLoading(false);
  };
  return (
    <div style={{maxWidth:'600px', margin:'40px auto', padding:'20px'}}>
      <h1>Admin - Create Missing Child Case</h1>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:'12px'}}>
          <label>Case Number *</label><br/>
          <input value={form.caseNumber} onChange={update('caseNumber')} style={{width:'100%', padding:'8px'}} />
        </div>
        <div style={{marginBottom:'12px'}}>
          <label>Child Name *</label><br/>
          <input value={form.childName} onChange={update('childName')} style={{width:'100%', padding:'8px'}} />
        </div>
        <div style={{marginBottom:'12px'}}>
          <label>Age</label><br/>
          <input value={form.age} onChange={update('age')} style={{width:'100%', padding:'8px'}} />
        </div>
        <div style={{marginBottom:'12px'}}>
          <label>Description</label><br/>
          <textarea value={form.description} onChange={update('description')} style={{width:'100%', padding:'8px', height:'60px'}} />
        </div>
        <div style={{marginBottom:'12px'}}>
          <label>Photo *</label><br/>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files.item(0))} />
        </div>
        <button type="submit" disabled={loading} style={{padding:'10px 20px', background:'#1a73e8', color:'white', border:'none'}}>
          {loading ? 'Processing...' : 'Create Case'}
        </button>
      </form>
      {status && <p style={{marginTop:'15px', fontWeight:'bold'}}>{status}</p>}
    </div>
  );
}
