import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cases')
      .then(res => res.json())
      .then(data => { setCases(data.cases || []); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return React.createElement('p', null, 'Loading...');

  return React.createElement('div', {style:{maxWidth:'900px',margin:'40px auto',padding:'20px'}},
    React.createElement('h1', null, 'Admin Dashboard'),
    React.createElement('p', null, 'Total: ' + cases.length + ' | Matches: ' + cases.filter(c => c.status === 'match_found').length),
    React.createElement('table', {style:{width:'100%',borderCollapse:'collapse'}},
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', {style:{padding:'8px',border:'1px solid #ddd'}}, 'Status'),
          React.createElement('th', {style:{padding:'8px',border:'1px solid #ddd'}}, 'Case'),
          React.createElement('th', {style:{padding:'8px',border:'1px solid #ddd'}}, 'Similarity'),
          React.createElement('th', {style:{padding:'8px',border:'1px solid #ddd'}}, 'Date')
        )
      ),
      React.createElement('tbody', null,
        ...cases.map((c, i) => React.createElement('tr', {key:i},
          React.createElement('td', {style:{padding:'8px',border:'1px solid #ddd',color:c.status==='match_found'?'red':'green'}}, c.status),
          React.createElement('td', {style:{padding:'8px',border:'1px solid #ddd'}}, c.matchedCaseid || c.childName || c.caseid),
          React.createElement('td', {style:{padding:'8px',border:'1px solid #ddd'}}, c.similarity ? c.similarity + '%' : '-'),
          React.createElement('td', {style:{padding:'8px',border:'1px solid #ddd'}}, c.createdAt ? c.createdAt.split('T') : '-')
        ))
      )
    )
  );
}
