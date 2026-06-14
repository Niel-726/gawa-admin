import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { usePermissions } from '../utils/permissions';
import { getAppealById } from '../mock-data';
import { formatDateTime, capitalizeWords } from '../utils/helpers';
import Header from '../components/layout/Header';
import StatusBadge from '../components/common/StatusBadge';
import CaseTimeline from '../components/common/CaseTimeline';
import NotesPanel from '../components/common/NotesPanel';
import ConfirmModal from '../components/common/ConfirmModal';

export default function AppealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can, isSupport } = usePermissions(currentUser?.role);
  const { addNotification } = useNotifications();
  const appeal = getAppealById(id);
  const [showDecision, setShowDecision] = useState(null);

  if (!appeal) {
    return (
      <div>
        <Header title="Appeal Not Found" />
        <div className="empty-state">
          <div className="empty-state-text">Appeal not found</div>
          <button className="btn btn-outline mt-4" onClick={() => navigate('/oversight')}>Back to Oversight</button>
        </div>
      </div>
    );
  }

  const handleDecision = (decision) => {
    addNotification('appeal_decided', 'Appeal Decision', `Appeal decision for ${appeal.userName}: ${decision}`, `/appeals/${appeal.id}`);
    setShowDecision(null);
  };

  const decisionButtons = [];
  if (can('finalizeAppeal')) {
    decisionButtons.push(
      { label: 'Reinstate Account', action: 'reinstated', variant: 'success', show: true },
      { label: 'Extend Suspension', action: 'extend_suspension', variant: 'warning', show: true },
      { label: 'Permanently Delete', action: 'permanently_deleted', variant: 'danger', show: true },
    );
  }
  if (can('forwardAppeal') && isSupport && appeal.status === 'pending') {
    decisionButtons.push({ label: 'Forward to Admin', action: 'forward', variant: 'primary', show: true });
  }

  return (
    <div>
      <Header title={`Appeal - ${appeal.userName}`} />
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{appeal.userName}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: 14, color: 'var(--color-text-muted)', marginTop: 4 }}>
                <StatusBadge status={appeal.userRole} />
                <StatusBadge status={appeal.status} />
                {appeal.decision && <StatusBadge status={appeal.decision} />}
                <span>Filed: {formatDateTime(appeal.filedAt)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              {decisionButtons.filter(b => b.show).map((btn) => (
                <button
                  key={btn.action}
                  className={`btn btn-sm ${btn.variant === 'danger' ? 'btn-danger' : btn.variant === 'success' ? 'btn-success' : btn.variant === 'warning' ? 'btn-warning' : 'btn-accent'}`}
                  onClick={() => setShowDecision(btn.action)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3>Suspension Details</h3></div>
        <div className="card-body">
          <div className="detail-field"><div className="detail-label">Reason for Suspension</div><div className="detail-value">{appeal.suspensionReason}</div></div>
          {appeal.supportRecommendation && (
            <div className="detail-field mt-4"><div className="detail-label">Support Recommendation</div><div className="detail-value" style={{ color: 'var(--color-accent)' }}>{appeal.supportRecommendation}</div></div>
          )}
          {appeal.supportNotes && (
            <div className="detail-field mt-4"><div className="detail-label">Support Notes</div><div className="detail-value" style={{ fontSize: 14 }}>{appeal.supportNotes}</div></div>
          )}
          {appeal.decisionNotes && (
            <div className="detail-field mt-4"><div className="detail-label">Decision Notes</div><div className="detail-value">{appeal.decisionNotes}</div></div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3>Timeline</h3></div>
        <div className="card-body">
          <CaseTimeline entries={appeal.timeline || []} />
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Admin Notes</h3></div>
        <div className="card-body">
          <NotesPanel notes={appeal.notes || []} onAddNote={(note) => addNotification('appeal_forwarded', 'Note Added on Appeal', `Note added for ${appeal.userName}: ${note.text}`, `/appeals/${appeal.id}`)} />
        </div>
      </div>

      <ConfirmModal
        open={!!showDecision}
        title="Appeal Decision"
        message={`Are you sure you want to ${capitalizeWords(showDecision)} for ${appeal.userName}? This action will affect their account status.`}
        confirmLabel={showDecision === 'forward' ? 'Forward' : 'Confirm Decision'}
        variant={showDecision === 'permanently_deleted' ? 'danger' : showDecision === 'reinstated' ? 'success' : 'primary'}
        onConfirm={() => handleDecision(showDecision)}
        onCancel={() => setShowDecision(null)}
      />
    </div>
  );
}
