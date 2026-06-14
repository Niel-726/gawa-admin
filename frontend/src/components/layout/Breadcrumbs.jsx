import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const pageNames = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/verifications': 'Verifications',
  '/jobs': 'Jobs',
  '/listings': 'Listings',
  '/transactions': 'Transactions',
  '/oversight': 'Oversight',
  '/galaw-points': 'Galaw Points',
  '/messages': 'Messages',
  '/settings': 'Settings',
  '/support': 'Support Dashboard',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  const crumbs = [{ label: 'Home', path: '/' }];

  let current = '';
  for (const part of parts) {
    current += '/' + part;
    const label = pageNames[current] || part.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    crumbs.push({ label, path: current });
  }

  if (crumbs.length <= 1) return null;

  return (
    <div className="breadcrumbs">
      {crumbs.map((crumb, idx) => (
        <React.Fragment key={crumb.path}>
          {idx > 0 && <span className="breadcrumb-sep">/</span>}
          {idx < crumbs.length - 1 ? (
            <Link to={crumb.path}>{crumb.label}</Link>
          ) : (
            <span>{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
