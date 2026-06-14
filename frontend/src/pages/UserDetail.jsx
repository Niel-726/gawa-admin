import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { usePermissions } from '../utils/permissions';
import { getUserById, getVerificationsByUser, getJobsByUser, getListingsByOwner, getTransactionsByUser, getDisputesByUser, getReviewsByTarget, getRentalsByUser, updateUser, getAssessmentsByUser, getCategoryById, getResponsesByAssessment } from '../mock-data';
import { formatDate, formatDateTime, formatCurrency, getInitials, capitalizeWords } from '../utils/helpers';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import Tabs from '../components/common/Tabs';
import NotesPanel from '../components/common/NotesPanel';
import ConfirmModal from '../components/common/ConfirmModal';
import DataTable from '../components/common/DataTable';
import { Mail, Phone, Star, PhilippinePeso, ShieldAlert, Ban, RotateCcw, Flag, MapPin, ClipboardCheck } from 'lucide-react';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can } = usePermissions(currentUser?.role);
  const { addNotification } = useNotifications();
  const user = getUserById(id);

  const [activeTab, setActiveTab] = useState('profile');
  const [showConfirm, setShowConfirm] = useState(null);

  const verifications = useMemo(() => getVerificationsByUser(id), [id]);
  const userJobs = useMemo(() => getJobsByUser(id, user.role), [id, user.role]);
  const userListings = useMemo(() => getListingsByOwner(id), [id]);
  const userTransactions = useMemo(() => getTransactionsByUser(id), [id]);
  const userDisputes = useMemo(() => getDisputesByUser(id), [id]);
  const userReviews = useMemo(() => getReviewsByTarget(id), [id]);
  const userRentals = useMemo(() => getRentalsByUser(id), [id]);
  const userAssessments = useMemo(() => getAssessmentsByUser(id), [id]);

  if (!user) {
    return (
      <div>
        <Header title="User Not Found" />
        <div className="empty-state">
          <div className="empty-state-text">User not found</div>
          <button className="btn btn-outline mt-4" onClick={() => navigate('/users')}>Back to Users</button>
        </div>
      </div>
    );
  }

  const tabs = ['profile', 'jobs', 'listings', 'transactions', 'disputes', 'reviews', 'assessments', 'notes'];

  const handleAction = (action) => {
    setShowConfirm(action);
  };

  const confirmActions = () => {
    const actionMap = {
      approve_verification: { status: 'verified', verified: true },
      reject_verification: { status: 'unverified', verified: false },
      suspend: { status: 'suspended' },
      reinstate: { status: 'verified', verified: true },
      revoke_verification: { status: 'unverified', verified: false },
      flag: { flags: (user.flags || 0) + 1 },
    };
    const updates = actionMap[showConfirm];
    if (updates) {
      updateUser(user.id, updates);
      Object.assign(user, updates);
    }
    addNotification('moderation_decision', 'User Action Applied', `Action: ${showConfirm} applied to ${user.name}`, `/users/${user.id}`);
    setShowConfirm(null);
  };

  const actionButtons = [
    { label: 'Approve Verification', action: 'approve_verification', permission: 'approveVerification', show: user.status === 'unverified' },
    { label: 'Reject Verification', action: 'reject_verification', permission: 'rejectVerification', show: user.status === 'unverified' },
    { label: 'Suspend Account', action: 'suspend', permission: 'suspendUser', show: user.status === 'verified' },
    { label: 'Reinstate Account', action: 'reinstate', permission: 'reinstateUser', show: user.status === 'suspended' },
    { label: 'Revoke Verification', action: 'revoke_verification', permission: 'revokeVerification', show: user.status === 'verified' || user.status === 'flagged' },
    { label: 'Flag Account', action: 'flag', permission: 'flagJob', show: true },
  ];

  const jobColumns = [
    { key: 'title', label: 'Job', render: (row) => <span className="cell-link" onClick={() => navigate(`/jobs/${row.id}`)}>{row.title}</span> },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'budget', label: 'Budget', render: (row) => formatCurrency(row.budget) },
    { key: 'createdAt', label: 'Created', render: (row) => formatDate(row.createdAt) },
  ];

  return (
    <div>
      <Header title="User Detail" />
      <div className="user-detail-header card p-4">
        <div className="user-avatar-lg">{getInitials(user.name)}</div>
        <div className="user-detail-info flex-1">
          <h1>{user.name}</h1>
          <div className="user-detail-meta">
            <span><Mail size={15} /> {user.email}</span>
            <span><Phone size={15} /> {user.phone}</span>
            <span><MapPin size={15} /> {user.location}</span>
            <span><Star size={15} /> {user.rating || 'N/A'}</span>
            <span className="text-accent"><PhilippinePeso size={15} /> {user.galawPoints} GP</span>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <StatusBadge status={user.status} />
            <span className="status-badge" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>{capitalizeWords(user.role)}</span>
            {user.flags > 0 && <StatusBadge status="flagged" label={`${user.flags} flag(s)`} />}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {actionButtons.filter(b => b.show && can(b.permission)).map((btn) => (
            <button key={btn.action} className="btn btn-outline btn-sm" onClick={() => handleAction(btn.action)}>{btn.label}</button>
          ))}
          <button className="btn btn-accent btn-sm" onClick={() => navigate('/messages')}>Send Message</button>
        </div>
      </div>

      <Tabs tabs={tabs.map(t => ({ key: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} activeTab={activeTab} onChange={setActiveTab} />
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="card">
            <div className="card-body">
              <div className="detail-grid">
                <div className="detail-field"><div className="detail-label">Full Name</div><div className="detail-value">{user.name}</div></div>
                <div className="detail-field"><div className="detail-label">Email</div><div className="detail-value">{user.email}</div></div>
                <div className="detail-field"><div className="detail-label">Phone</div><div className="detail-value">{user.phone}</div></div>
                <div className="detail-field"><div className="detail-label">Location</div><div className="detail-value">{user.location}</div></div>
                <div className="detail-field"><div className="detail-label">Role</div><div className="detail-value">{capitalizeWords(user.role)}</div></div>
                <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={user.status} /></div></div>
                <div className="detail-field"><div className="detail-label">Verified</div><div className="detail-value">{user.verified ? 'Yes' : 'No'}</div></div>
                <div className="detail-field"><div className="detail-label">Joined</div><div className="detail-value">{formatDate(user.joinedAt)}</div></div>
                <div className="detail-field"><div className="detail-label">Rating</div><div className="detail-value">{user.rating || 'N/A'} / 5.0</div></div>
                <div className="detail-field"><div className="detail-label">Total Jobs</div><div className="detail-value">{user.totalJobs}</div></div>
                <div className="detail-field"><div className="detail-label">Galaw Points</div><div className="detail-value">{user.galawPoints}</div></div>
                <div className="detail-field"><div className="detail-label">Flags</div><div className="detail-value">{user.flags}</div></div>
              </div>
              {user.skills?.length > 0 && (
                <div className="mt-4">
                  <div className="detail-label mb-2">Skills</div>
                  <div className="flex gap-1 flex-wrap">
                    {user.skills.map((s, idx) => <span key={idx} className="status-badge" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>{s}</span>)}
                  </div>
                </div>
              )}
              {verifications.length > 0 && (
                <div className="mt-4">
                  <div className="detail-label mb-2">Verification History</div>
                  {verifications.map((v) => (
                    <div key={v.id} className="detail-field mb-1">
                      <div className="flex justify-between" style={{ fontSize: 'var(--text-sm)' }}>
                        <span>{capitalizeWords(v.type)} - <StatusBadge status={v.status} /></span>
                        <span className="text-muted text-xs">{formatDate(v.submittedAt)}</span>
                      </div>
                      {v.remarks && <div className="text-xs text-muted mt-1">Remarks: {v.remarks}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="card">
            <div className="card-body p-0">
              <DataTable columns={jobColumns} data={userJobs} emptyMessage="No jobs found for this user." pageSize={5} />
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="card">
            <div className="card-body p-0">
              <DataTable
                columns={[
                  { key: 'title', label: 'Listing', render: (row) => <span className="cell-link" onClick={() => navigate(`/listings/${row.id}`)}>{row.title}</span> },
                  { key: 'category', label: 'Category' },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
                  { key: 'dailyRate', label: 'Daily Rate', render: (row) => formatCurrency(row.dailyRate) },
                ]}
                data={userListings}
                emptyMessage="No listings found."
                pageSize={5}
              />
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="card">
            <div className="card-body p-0">
              <DataTable
                columns={[
                  { key: 'type', label: 'Type', render: (row) => <StatusBadge status={row.type} /> },
                  { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
                  { key: 'description', label: 'Description' },
                  { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
                ]}
                data={userTransactions}
                emptyMessage="No transactions found."
                pageSize={5}
              />
            </div>
          </div>
        )}

        {activeTab === 'disputes' && (
          <div className="card">
            <div className="card-body p-0">
              <DataTable
                columns={[
                  { key: 'title', label: 'Title', render: (row) => <span className="cell-link" onClick={() => navigate(`/disputes/${row.id}`)}>{row.title}</span> },
                  { key: 'type', label: 'Type', render: (row) => <StatusBadge status={row.type} /> },
                  { key: 'severity', label: 'Severity', render: (row) => <StatusBadge status={row.severity} /> },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
                ]}
                data={userDisputes}
                emptyMessage="No disputes found."
                pageSize={5}
              />
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card">
            <div className="card-body">
              {userReviews.length === 0 ? (
                <div className="empty-state"><div className="empty-state-text">No reviews</div></div>
              ) : (
                userReviews.map((r) => (
                  <div key={r.id} className="py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div className="flex justify-between">
                      <span className="font-semibold">{r.reviewerName}</span>
                      <span className="flex gap-0">
                        {Array.from({length: r.rating}, (_, i) => <Star key={`f-${i}`} size={13} fill="var(--color-warning)" color="var(--color-warning)" />)}
                        {Array.from({length: 5 - r.rating}, (_, i) => <Star key={`e-${i}`} size={13} color="var(--color-border)" />)}
                        <span className="ml-1 text-sm">{r.rating}/5</span>
                      </span>
                    </div>
                    <div className="text-sm mt-1">{r.text}</div>
                    <div className="text-xs text-muted mt-1">{formatDate(r.createdAt)} - <StatusBadge status={r.status} /></div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="card">
            <div className="card-header">
              <h3>Skill Assessments</h3>
              {user.role !== 'client' && user.role !== 'admin' && user.role !== 'customer_support' && (
                <button className="btn btn-accent btn-sm" onClick={() => navigate('/assessments')}>
                  <ClipboardCheck size={14} /> Take Assessment
                </button>
              )}
            </div>
            <div className="card-body p-0">
              {userAssessments.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-state-icon"><ClipboardCheck size={36} /></div>
                  <div className="empty-state-text">No assessments taken</div>
                  <div className="empty-state-sub">
                    {user.role !== 'client' && user.role !== 'admin' && user.role !== 'customer_support'
                      ? 'Take a skill assessment to verify your expertise'
                      : 'This user has not taken any assessments'}
                  </div>
                </div>
              ) : (
                userAssessments.map((a) => {
                  const cat = getCategoryById(a.categoryId);
                  const responses = getResponsesByAssessment(a.id);
                  const pct = a.totalPoints > 0 ? Math.round((a.score / a.totalPoints) * 100) : 0;
                  return (
                    <div key={a.id} className="flex items-center justify-between p-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <div>
                        <div className="font-medium text-sm">{cat?.name || 'Unknown Category'}</div>
                        <div className="text-xs text-muted mt-1">
                          {formatDate(a.startedAt)} · {responses.length} questions · {a.score}/{a.totalPoints} pts
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-semibold" style={{ color: pct >= 80 ? 'var(--color-success)' : pct >= 60 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                          {pct}%
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="card">
            <div className="card-header"><h3>Internal Notes</h3></div>
            <div className="card-body">
              <NotesPanel
                notes={user.notes || []}
                onAddNote={(note) => {
                  addNotification('moderation_decision', 'Note Added', `Note added to ${user.name}: ${note.text}`, `/users/${user.id}`);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!showConfirm}
        title={`${capitalizeWords(showConfirm)}`}
        message={`Are you sure you want to ${showConfirm?.replace(/_/g, ' ')} for ${user.name}?`}
        confirmLabel="Confirm"
        variant={showConfirm?.includes('suspend') || showConfirm?.includes('reject') || showConfirm?.includes('revoke') ? 'danger' : 'primary'}
        onConfirm={confirmActions}
        onCancel={() => setShowConfirm(null)}
      />
    </div>
  );
}
