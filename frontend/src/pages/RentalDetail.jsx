import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRentalById, getUserById, getListingById } from '../mock-data';
import { formatDateTime, formatCurrency } from '../utils/helpers';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import { Calendar, User, Package, PhilippinePeso, Shield } from 'lucide-react';

export default function RentalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const rental = getRentalById(id);

  if (!rental) {
    return (
      <div>
        <Header title="Rental Not Found" />
        <div className="empty-state">
          <div className="empty-state-text">Rental not found</div>
          <button className="btn btn-outline mt-4" onClick={() => navigate('/rentals')}>Back to Rentals</button>
        </div>
      </div>
    );
  }

  const renter = getUserById(rental.renterId);
  const owner = getUserById(rental.ownerId);
  const listing = getListingById(rental.listingId);

  return (
    <div>
      <Header title={`Rental ${rental.id}`} />
      <div className="card mb-4">
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-field">
              <div className="detail-label">Equipment</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Package size={14} /> {rental.listingTitle}
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Status</div>
              <div className="detail-value"><StatusBadge status={rental.status} /></div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Renter</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} />
                <span className="cell-link" onClick={() => navigate(`/users/${rental.renterId}`)}>{rental.renterName}</span>
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Owner</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={14} />
                <span className="cell-link" onClick={() => navigate(`/users/${rental.ownerId}`)}>{rental.ownerName}</span>
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Rental Period</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} />
                {formatDateTime(rental.startDate)} - {formatDateTime(rental.endDate)}
              </div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Total Amount</div>
              <div className="detail-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PhilippinePeso size={14} /> {formatCurrency(rental.totalAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3><Shield size={16} style={{ marginRight: 6 }} />Deposit Information</h3></div>
        <div className="card-body">
          <div className="detail-grid">
            <div className="detail-field">
              <div className="detail-label">Deposit Amount</div>
              <div className="detail-value">{formatCurrency(rental.depositAmount)}</div>
            </div>
            <div className="detail-field">
              <div className="detail-label">Deposit Status</div>
              <div className="detail-value"><StatusBadge status={rental.depositStatus} /></div>
            </div>
          </div>
          {rental.damageReport && (
            <div className="detail-field" style={{ marginTop: 16 }}>
              <div className="detail-label">Damage Report</div>
              <div className="detail-value" style={{ color: 'var(--color-danger)', marginTop: 4 }}>{rental.damageReport}</div>
            </div>
          )}
        </div>
      </div>

      {listing && (
        <div className="card mb-4">
          <div className="card-header"><h3>Related Listing</h3></div>
          <div className="card-body">
            <div className="detail-field">
              <div className="detail-label">Listing</div>
              <div className="detail-value"><span className="cell-link" onClick={() => navigate(`/listings/${listing.id}`)}>{listing.title}</span></div>
            </div>
            {listing.ownerName && (
              <div className="detail-field" style={{ marginTop: 8 }}>
                <div className="detail-label">Owner</div>
                <div className="detail-value">{listing.ownerName}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header"><h3>Timeline</h3></div>
        <div className="card-body">
          <div className="case-timeline">
            <div className="timeline-item">
              <div className={`timeline-dot completed`} />
              <div className="timeline-date">{formatDateTime(rental.createdAt)}</div>
              <div className="timeline-title">Rental Created</div>
            </div>
            <div className="timeline-item">
              <div className={`timeline-dot ${rental.status !== 'pending' ? 'completed' : ''}`} />
              <div className="timeline-date">{formatDateTime(rental.startDate)}</div>
              <div className="timeline-title">Rental Started</div>
            </div>
            <div className="timeline-item">
              <div className={`timeline-dot ${rental.status === 'completed' ? 'completed' : ''}`} />
              <div className="timeline-date">{formatDateTime(rental.endDate)}</div>
              <div className="timeline-title">Rental Ended</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
