import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../utils/permissions';
import { getListingById, getRentalsByListing } from '../mock-data';
import { formatDate, formatCurrency } from '../utils/helpers';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import DataTable from '../components/common/DataTable';
import NotesPanel from '../components/common/NotesPanel';
import ConfirmModal from '../components/common/ConfirmModal';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can } = usePermissions(currentUser?.role);
  const listing = getListingById(id);
  const rentals = useMemo(() => getRentalsByListing(id), [id]);
  const [showConfirm, setShowConfirm] = useState(null);

  if (!listing) {
    return (
      <div>
        <Header title="Listing Not Found" />
        <div className="empty-state">
          <div className="empty-state-text">Listing not found</div>
          <button className="btn btn-outline mt-4" onClick={() => navigate('/listings')}>Back to Listings</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={listing.title} />
      <div className="card">
        <div className="card-body" style={{ padding: 'var(--space-3) var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{listing.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: 13, marginTop: 2 }}>
                <span>by <span className="cell-link" onClick={() => navigate(`/users/${listing.ownerId}`)}>{listing.ownerName}</span></span>
                <span>{listing.category}</span>
                <span>{listing.location}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {can('flagListing') && <button className="btn btn-outline btn-sm" onClick={() => setShowConfirm('flag')}>Flag</button>}
              {can('removeListing') && <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm('remove')}>Remove</button>}
              <button className="btn btn-accent btn-sm" onClick={() => navigate('/messages')}>Message</button>
            </div>
          </div>

          {(listing.images?.length > 0) && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {listing.images.map((url, i) => (
                <div key={i} style={{ width: 200, height: 130, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: 'var(--color-surface-offset)' }}>
                  <img src={url} alt={`${listing.title} photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          )}

          <div className="detail-grid" style={{ gap: 'var(--space-3)' }}>
            <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={listing.status} /></div></div>
            <div className="detail-field"><div className="detail-label">Daily Rate</div><div className="detail-value">{formatCurrency(listing.dailyRate)}</div></div>
            <div className="detail-field"><div className="detail-label">Weekly Rate</div><div className="detail-value">{formatCurrency(listing.weeklyRate)}</div></div>
            <div className="detail-field"><div className="detail-label">Total Rentals</div><div className="detail-value">{listing.rentalCount}</div></div>
            <div className="detail-field"><div className="detail-label">Created</div><div className="detail-value">{formatDate(listing.createdAt)}</div></div>
            <div className="detail-field"><div className="detail-label">Flags</div><div className="detail-value">{listing.flags > 0 ? <StatusBadge status="flagged" /> : 'None'}</div></div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.25rem' }}>Description</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-muted)' }}>{listing.description}</p>
          </div>
        </div>
      </div>

      <div className="detail-strip" style={{ marginTop: 'var(--space-3)', gap: 'var(--space-3)' }}>
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header"><h3>Rental History</h3></div>
          <div className="card-body" style={{ padding: 0 }}>
            <DataTable
              columns={[
                { key: 'renterName', label: 'Renter' },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
                { key: 'totalAmount', label: 'Amount', render: (row) => formatCurrency(row.totalAmount) },
                { key: 'startDate', label: 'Start', render: (row) => formatDate(row.startDate) },
                { key: 'endDate', label: 'End', render: (row) => formatDate(row.endDate) },
              ]}
              data={rentals}
              emptyMessage="No rental history."
              pageSize={5}
            />
          </div>
        </div>
        <div className="card" style={{ width: 280, flexShrink: 0 }}>
          <div className="card-header"><h3>Admin Notes</h3></div>
          <div className="card-body" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <NotesPanel notes={listing.notes || []} onAddNote={(note) => alert(`Note added: ${note.text} (simulated)`)} />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!showConfirm}
        title={showConfirm === 'flag' ? 'Flag Listing' : 'Remove Listing'}
        message={showConfirm === 'flag' ? 'Flag this listing for review?' : 'Remove this listing permanently?'}
        confirmLabel={showConfirm === 'flag' ? 'Flag' : 'Remove'}
        variant={showConfirm === 'remove' ? 'danger' : 'warning'}
        onConfirm={() => { alert(`Listing ${showConfirm}ed (simulated)`); setShowConfirm(null); }}
        onCancel={() => setShowConfirm(null)}
      />
    </div>
  );
}
