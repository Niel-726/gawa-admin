import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../utils/permissions';
import { getListingById, getRentalsByListing } from '../mock-data';
import { formatDate, formatCurrency } from '../utils/helpers';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import Tabs from '../components/common/Tabs';
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
  const [activeTab, setActiveTab] = useState('details');
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

  const tabs = ['details', 'rental history', 'notes'];

  return (
    <div>
      <Header title={listing.title} />
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{listing.title}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: 14 }}>
                <span>by <span className="cell-link" onClick={() => navigate(`/users/${listing.ownerId}`)}>{listing.ownerName}</span></span>
                <span>{listing.category}</span>
                <span>{listing.location}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {can('flagListing') && <button className="btn btn-outline btn-sm" onClick={() => setShowConfirm('flag')}>Flag Listing</button>}
              {can('removeListing') && <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm('remove')}>Remove Listing</button>}
              <button className="btn btn-accent btn-sm" onClick={() => navigate('/messages')}>Message Owner</button>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={listing.status} /></div></div>
            <div className="detail-field"><div className="detail-label">Daily Rate</div><div className="detail-value">{formatCurrency(listing.dailyRate)}</div></div>
            <div className="detail-field"><div className="detail-label">Weekly Rate</div><div className="detail-value">{formatCurrency(listing.weeklyRate)}</div></div>
            <div className="detail-field"><div className="detail-label">Total Rentals</div><div className="detail-value">{listing.rentalCount}</div></div>
            <div className="detail-field"><div className="detail-label">Created</div><div className="detail-value">{formatDate(listing.createdAt)}</div></div>
            <div className="detail-field"><div className="detail-label">Flags</div><div className="detail-value">{listing.flags > 0 ? <StatusBadge status="flagged" /> : 'None'}</div></div>
          </div>
          <div className="mt-4">
            <div className="detail-label mb-2">Description</div>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{listing.description}</p>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'rental history' && (
          <div className="card">
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
        )}
        {activeTab === 'notes' && (
          <div className="card">
            <div className="card-header"><h3>Admin Notes</h3></div>
            <div className="card-body">
              <NotesPanel notes={listing.notes || []} onAddNote={(note) => alert(`Note added: ${note.text} (simulated)`)} />
            </div>
          </div>
        )}
        {activeTab === 'details' && (
          <div className="card">
            <div className="card-body">
              <div className="detail-grid">
                <div className="detail-field"><div className="detail-label">Owner</div><div className="detail-value"><span className="cell-link" onClick={() => navigate(`/users/${listing.ownerId}`)}>{listing.ownerName}</span></div></div>
                <div className="detail-field"><div className="detail-label">Category</div><div className="detail-value">{listing.category}</div></div>
                <div className="detail-field"><div className="detail-label">Location</div><div className="detail-value">{listing.location}</div></div>
                <div className="detail-field"><div className="detail-label">Daily Rate</div><div className="detail-value">{formatCurrency(listing.dailyRate)}</div></div>
                <div className="detail-field"><div className="detail-label">Weekly Rate</div><div className="detail-value">{formatCurrency(listing.weeklyRate)}</div></div>
                <div className="detail-field"><div className="detail-label">Created</div><div className="detail-value">{formatDate(listing.createdAt)}</div></div>
              </div>
            </div>
          </div>
        )}
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
