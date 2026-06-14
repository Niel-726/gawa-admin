import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../utils/permissions';
import { getPendingVerifications, getOpenDisputes, getPendingAppeals, getFlaggedReviews, getPendingReports } from '../mock-data';
import { timeAgo, formatNumber, capitalizeWords } from '../utils/helpers';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import { Check, Scale, RotateCcw, Sword, Smile } from 'lucide-react';

export default function SupportDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { can } = usePermissions(user?.role);

  const pendingVerifications = useMemo(() => getPendingVerifications(), []);
  const openDisputes = useMemo(() => getOpenDisputes(), []);
  const pendingAppeals = useMemo(() => getPendingAppeals(), []);
  const flaggedReviews = useMemo(() => getFlaggedReviews(), []);
  const pendingReports = useMemo(() => getPendingReports(), []);

  const stats = [
    { label: 'Pending Verifications', value: formatNumber(pendingVerifications.length), icon: <Check size={20} />, color: 'var(--color-info)' },
    { label: 'Open Disputes', value: formatNumber(openDisputes.length), icon: <Scale size={20} />, color: 'var(--color-warning)' },
    { label: 'Pending Appeals', value: formatNumber(pendingAppeals.length), icon: <RotateCcw size={20} />, color: 'var(--color-accent)' },
    { label: 'Flagged Reviews', value: formatNumber(flaggedReviews.length), icon: <Sword size={20} />, color: 'var(--color-danger)' },
  ];

  return (
    <div>
      <Header title={`Support Dashboard - ${user?.name || 'Support Agent'}`} />

      <div className="dashboard-grid">
        {stats.map((s, idx) => <StatCard key={idx} {...s} />)}
      </div>

      <div className="mb-4">
        <div className="dashboard-section-title">Quick Access</div>
        <div className="quick-actions">
          {can('viewVerifications') && (
            <div className="quick-action-card" onClick={() => navigate('/verifications')}>
              <div className="quick-action-icon"><Check size={18} /></div>
              <div className="quick-action-text">Review Verifications</div>
            </div>
          )}
          {can('viewDisputes') && (
            <div className="quick-action-card" onClick={() => navigate('/oversight')}>
              <div className="quick-action-icon"><Scale size={18} /></div>
              <div className="quick-action-text">View Disputes</div>
            </div>
          )}
          {can('viewDisputes') && (
            <div className="quick-action-card" onClick={() => navigate('/oversight')}>
              <div className="quick-action-icon"><Sword size={18} /></div>
              <div className="quick-action-text">Moderate Content</div>
            </div>
          )}
          {can('viewDisputes') && (
            <div className="quick-action-card" onClick={() => navigate('/oversight')}>
              <div className="quick-action-icon"><RotateCcw size={18} /></div>
              <div className="quick-action-text">Review Appeals</div>
            </div>
          )}
          {can('viewUsers') && (
            <div className="quick-action-card" onClick={() => navigate('/users')}>
              <div className="quick-action-icon"><Smile size={18} /></div>
              <div className="quick-action-text">Search Users</div>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-activity-grid">
        <div className="card">
          <div className="card-header"><h3>Pending Verifications</h3></div>
          <div className="card-body">
            {pendingVerifications.length === 0 ? (
              <div className="empty-state" style={{ padding: '1rem' }}><div className="empty-state-text">No pending verifications</div></div>
            ) : (
              pendingVerifications.map((v) => (
                <div key={v.id} className="recent-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/verifications')}>
                  <div className="recent-item-info">
                    <div className="recent-item-title">{v.userName}</div>
                    <div className="recent-item-sub">{v.userRole} - {timeAgo(v.submittedAt)}</div>
                  </div>
                  <StatusBadge status="pending" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Open Disputes</h3></div>
          <div className="card-body">
            {openDisputes.length === 0 ? (
              <div className="empty-state" style={{ padding: '1rem' }}><div className="empty-state-text">No open disputes</div></div>
            ) : (
              openDisputes.slice(0, 4).map((d) => (
                <div key={d.id} className="recent-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/disputes/${d.id}`)}>
                  <div className="recent-item-info">
                    <div className="recent-item-title">{d.title}</div>
                    <div className="recent-item-sub">{capitalizeWords(d.type)} - {timeAgo(d.createdAt)}</div>
                  </div>
                  <SeverityBadge severity={d.severity} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Flagged Content</h3></div>
          <div className="card-body">
            {flaggedReviews.length === 0 && pendingReports.length === 0 ? (
              <div className="empty-state" style={{ padding: '1rem' }}><div className="empty-state-text">No flagged content</div></div>
            ) : (
              <>
                {flaggedReviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="recent-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/oversight')}>
                    <div className="recent-item-info">
                      <div className="recent-item-title">Flagged Review by {r.reviewerName}</div>
                      <div className="recent-item-sub">Rating: {r.rating}/5 - {timeAgo(r.createdAt)}</div>
                    </div>
                    <StatusBadge status="flagged" />
                  </div>
                ))}
                {pendingReports.slice(0, 2).map((r) => (
                  <div key={r.id} className="recent-item" style={{ cursor: 'pointer' }} onClick={() => navigate('/oversight')}>
                    <div className="recent-item-info">
                      <div className="recent-item-title">{r.title}</div>
                      <div className="recent-item-sub">{r.targetType} - {timeAgo(r.createdAt)}</div>
                    </div>
                    <SeverityBadge severity={r.severity} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Pending Appeals</h3></div>
          <div className="card-body">
            {pendingAppeals.length === 0 ? (
              <div className="empty-state" style={{ padding: '1rem' }}><div className="empty-state-text">No pending appeals</div></div>
            ) : (
              pendingAppeals.map((a) => (
                <div key={a.id} className="recent-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/appeals/${a.id}`)}>
                  <div className="recent-item-info">
                    <div className="recent-item-title">{a.userName}</div>
                    <div className="recent-item-sub">{a.suspensionReason?.substring(0, 60)}...</div>
                  </div>
                  <StatusBadge status="pending" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <div><strong>Support Agent:</strong> {user?.name}</div>
          <div><strong>Role:</strong> Customer Support</div>
          <div><strong>Permissions:</strong> Verification, Disputes, Moderation, Appeals (forward only)</div>
          <div><strong>Restricted:</strong> Financial records, audit logs, account governance actions</div>
        </div>
      </div>
    </div>
  );
}
