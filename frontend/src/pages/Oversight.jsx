import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { usePermissions } from '../utils/permissions';
import { disputes, reviews, reports, appeals, userIncidents } from '../mock-data';
import { formatDate, formatDateTime, timeAgo } from '../utils/helpers';
import Header from '../components/layout/Header';
import Tabs from '../components/common/Tabs';
import FilterBar from '../components/common/FilterBar';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import SeverityBadge from '../components/common/SeverityBadge';
import DetailPanel from '../components/common/DetailPanel';
import { Star } from 'lucide-react';

const oversightTabs = [
  { key: 'disputes', label: 'Disputes' },
  { key: 'moderation', label: 'Moderation' },
  { key: 'incidents', label: 'Incidents' },
  { key: 'appeals', label: 'Appeals' },
];

const disputeFilters = [
  { key: 'type', label: 'Type', placeholder: 'All Types', options: [
    { value: 'job_dispute', label: 'Job Dispute' },
    { value: 'damage_report', label: 'Damage Report' },
    { value: 'fraud_report', label: 'Fraud Report' },
    { value: 'abuse_report', label: 'Abuse Report' },
    { value: 'report', label: 'Report' },
  ]},
  { key: 'severity', label: 'Severity', placeholder: 'All Severities', options: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ]},
  { key: 'status', label: 'Status', placeholder: 'All Statuses', options: [
    { value: 'pending', label: 'Pending' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' },
  ]},
];

const incidentFilters = [
  { key: 'type', label: 'Type', placeholder: 'All Types', options: [
    { value: 'match', label: 'Match' },
    { value: 'violation', label: 'Violation' },
    { value: 'fraud', label: 'Fraud' },
    { value: 'damage', label: 'Damage' },
    { value: 'incomplete', label: 'Incomplete' },
    { value: 'escalation', label: 'Escalation' },
  ]},
  { key: 'severity', label: 'Severity', placeholder: 'All Severities', options: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ]},
  { key: 'status', label: 'Status', placeholder: 'All Statuses', options: [
    { value: 'open', label: 'Open' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'resolved', label: 'Resolved' },
  ]},
];

const appealFilters = [
  { key: 'status', label: 'Status', placeholder: 'All Statuses', options: [
    { value: 'pending', label: 'Pending' },
    { value: 'forwarded', label: 'Forwarded' },
    { value: 'decided', label: 'Decided' },
  ]},
];

const disputeColumns = [
  { key: 'title', label: 'Case', render: (row) => <span className="cell-link">{row.title}</span> },
  { key: 'type', label: 'Type', render: (row) => <StatusBadge status={row.type} /> },
  { key: 'severity', label: 'Severity', render: (row) => <SeverityBadge severity={row.severity} /> },
  { key: 'reporterName', label: 'Reporter' },
  { key: 'respondentName', label: 'Respondent' },
  { key: 'assignedName', label: 'Assigned To', render: (row) => row.assignedName || <span className="text-muted text-xs">Unassigned</span> },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'createdAt', label: 'Filed', render: (row) => timeAgo(row.createdAt) },
];

const reviewColumns = [
  { key: 'id', label: 'ID', render: (row) => <span className="text-xs text-muted font-mono">{row.id}</span> },
  { key: 'reviewerName', label: 'Reviewer' },
  { key: 'targetName', label: 'Target' },
  { key: 'rating', label: 'Rating', render: (row) => (
    <div className="flex items-center gap-0" style={{ whiteSpace: 'nowrap' }}>
      {Array.from({length: row.rating}, (_, i) => <Star key={`f-${i}`} size={13} fill="var(--color-warning)" color="var(--color-warning)" />)}
      {Array.from({length: 5 - row.rating}, (_, i) => <Star key={`e-${i}`} size={13} color="var(--color-border)" />)}
    </div>
  )},
  { key: 'text', label: 'Content', render: (row) => <span className="truncate" style={{ maxWidth: 250, display: 'inline-block' }}>{row.text}</span> },
  { key: 'flags', label: 'Flags', render: (row) => row.flags > 0 ? <StatusBadge status="flagged" label={row.flags} /> : '-' },
  { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
];

const reportColumns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'reporterName', label: 'Reporter' },
  { key: 'severity', label: 'Severity', render: (row) => <SeverityBadge severity={row.severity} /> },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'targetType', label: 'Target Type' },
  { key: 'createdAt', label: 'Filed', render: (row) => formatDate(row.createdAt) },
];

const incidentColumns = [
  { key: 'title', label: 'Incident', render: (row) => <span className="cell-link">{row.title}</span> },
  { key: 'type', label: 'Type', render: (row) => <StatusBadge status={row.type} /> },
  { key: 'severity', label: 'Severity', render: (row) => <SeverityBadge severity={row.severity} /> },
  { key: 'module', label: 'Module', render: (row) => <StatusBadge status={row.module} /> },
  { key: 'reporter', label: 'Reporter' },
  { key: 'respondentName', label: 'User Involved' },
  { key: 'assignedName', label: 'Assigned To', render: (row) => row.assignedName || <span className="text-muted text-xs">Unassigned</span> },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'createdAt', label: 'Reported', render: (row) => timeAgo(row.createdAt) },
];

const appealColumns = [
  { key: 'userName', label: 'User', render: (row) => <span className="cell-link">{row.userName}</span> },
  { key: 'userRole', label: 'Role', render: (row) => <StatusBadge status={row.userRole} /> },
  { key: 'suspensionReason', label: 'Suspension Reason', render: (row) => <span className="truncate" style={{ maxWidth: 250, display: 'inline-block' }}>{row.suspensionReason}</span> },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'filedAt', label: 'Filed', render: (row) => formatDate(row.filedAt) },
  { key: 'decidedAt', label: 'Decided', render: (row) => row.decidedAt ? formatDate(row.decidedAt) : '-' },
  { key: 'decision', label: 'Decision', render: (row) => row.decision ? <StatusBadge status={row.decision} /> : '-' },
];

export default function Oversight() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can } = usePermissions(currentUser?.role);
  const { addNotification } = useNotifications();
  const [tab, setTab] = useState('disputes');
  const [dFil, dSetFil] = useState({ type: '', severity: '', status: '' });
  const [iFil, iSetFil] = useState({ type: '', severity: '', status: '' });
  const [aFil, aSetFil] = useState({ status: '' });
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [modTab, setModTab] = useState('reviews');

  const filteredDisputes = useMemo(() => {
    let data = [...disputes];
    if (dFil.type) data = data.filter((d) => d.type === dFil.type);
    if (dFil.severity) data = data.filter((d) => d.severity === dFil.severity);
    if (dFil.status) data = data.filter((d) => d.status === dFil.status);
    return data;
  }, [dFil]);

  const flaggedReviews = useMemo(() => reviews.filter((r) => r.status === 'flagged'), []);
  const flaggedReports = useMemo(() => reports.filter((r) => r.status === 'pending' || r.status === 'under-review'), []);

  const filteredIncidents = useMemo(() => {
    let data = [...userIncidents];
    if (iFil.type) data = data.filter((i) => i.type === iFil.type);
    if (iFil.severity) data = data.filter((i) => i.severity === iFil.severity);
    if (iFil.status) data = data.filter((i) => i.status === iFil.status);
    return data;
  }, [iFil]);

  const filteredAppeals = useMemo(() => {
    let data = [...appeals];
    if (aFil.status) data = data.filter((a) => a.status === aFil.status);
    return data;
  }, [aFil]);

  const handleModDecision = (decision) => {
    const task = selectedReview ? selectedReview.id : '';
    const reason = prompt(`Enter notes for ${decision} decision:`);
    if (reason) {
      addNotification('moderation_decision', 'Moderation Decision', `Decision: ${decision} on ${task} - ${reason}`, '/oversight');
      setSelectedReview(null);
    }
  };

  const handleIncidentAction = (action) => {
    const task = selectedIncident ? selectedIncident.id : '';
    const reason = prompt(`Enter notes for ${action} action:`);
    if (reason) {
      addNotification('moderation_decision', 'Incident Action', `Incident ${action} on ${task} - ${reason}`, '/oversight');
      setSelectedIncident(null);
    }
  };

  const renderModeration = () => (
    <>
      <div className="mb-4">
        <Tabs
          tabs={[{ key: 'reviews', label: 'Flagged Reviews' }, { key: 'reports', label: 'Flagged Reports' }]}
          activeTab={modTab}
          onChange={setModTab}
        />
      </div>
      <div className="card">
        <div className="card-body p-0">
          <DataTable
            columns={modTab === 'reviews' ? reviewColumns : reportColumns}
            data={modTab === 'reviews' ? flaggedReviews : flaggedReports}
            onRowClick={(row) => setSelectedReview(row)}
            pageSize={10}
            emptyMessage={modTab === 'reviews' ? 'No flagged reviews.' : 'No flagged reports.'}
          />
        </div>
      </div>
      <DetailPanel open={!!selectedReview} onClose={() => setSelectedReview(null)} title="Moderation Decision">
        {selectedReview && (
          <div>
            <div className="detail-panel-section">
              <h4>Details</h4>
              <div className="detail-field"><div className="detail-label">ID</div><div className="detail-value">{selectedReview.id}</div></div>
              {selectedReview.reviewerName && <div className="detail-field"><div className="detail-label">Reviewer</div><div className="detail-value">{selectedReview.reviewerName}</div></div>}
              {selectedReview.targetName && <div className="detail-field"><div className="detail-label">Target</div><div className="detail-value">{selectedReview.targetName}</div></div>}
              {selectedReview.title && <div className="detail-field"><div className="detail-label">Title</div><div className="detail-value">{selectedReview.title}</div></div>}
              {selectedReview.text && <div className="detail-field"><div className="detail-label">Content</div><div className="detail-value">{selectedReview.text}</div></div>}
              {selectedReview.description && <div className="detail-field"><div className="detail-label">Description</div><div className="detail-value">{selectedReview.description}</div></div>}
              {selectedReview.rating && (
                <div className="detail-field">
                  <div className="detail-label">Rating</div>
                  <div className="detail-value flex items-center gap-0" style={{ whiteSpace: 'nowrap' }}>
                    {Array.from({length: selectedReview.rating}, (_, i) => <Star key={`f-${i}`} size={13} fill="var(--color-warning)" color="var(--color-warning)" />)}
                    {Array.from({length: 5 - selectedReview.rating}, (_, i) => <Star key={`e-${i}`} size={13} color="var(--color-border)" />)}
                  </div>
                </div>
              )}
              <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={selectedReview.status} /></div></div>
            </div>
            <div className="detail-panel-section">
              <h4>Moderation Actions</h4>
              <div className="flex flex-col gap-2">
                <button className="btn btn-success" onClick={() => handleModDecision('keep')}>Keep (No Action)</button>
                <button className="btn btn-warning" onClick={() => handleModDecision('warn')}>Warn User</button>
                <button className="btn btn-outline" onClick={() => handleModDecision('hide')}>Hide Content</button>
                {can('removeJob') && <button className="btn btn-danger" onClick={() => handleModDecision('remove')}>Remove Content</button>}
              </div>
            </div>
            {selectedReview.decision && (
              <div className="detail-panel-section">
                <h4>Previous Decision</h4>
                <div className="detail-field"><div className="detail-label">Decision</div><div className="detail-value">{selectedReview.decision}</div></div>
                {selectedReview.decisionNotes && <div className="detail-field"><div className="detail-label">Notes</div><div className="detail-value">{selectedReview.decisionNotes}</div></div>}
              </div>
            )}
          </div>
        )}
      </DetailPanel>
    </>
  );

  return (
    <div>
      <Header title="Oversight" />
      <Tabs tabs={oversightTabs} activeTab={tab} onChange={setTab} />
      <div className="tab-content">
        {tab === 'disputes' && (
          <div className="card">
            <div className="card-header">
              <FilterBar filters={disputeFilters} values={dFil} onChange={(key, value) => dSetFil((p) => ({ ...p, [key]: value }))} />
            </div>
            <div className="card-body p-0">
              <DataTable columns={disputeColumns} data={filteredDisputes} onRowClick={(row) => navigate(`/disputes/${row.id}`)} pageSize={10} emptyMessage="No disputes or reports found." />
            </div>
          </div>
        )}
        {tab === 'moderation' && renderModeration()}
        {tab === 'incidents' && (
          <div>
            <div className="card">
              <div className="card-header">
                <FilterBar filters={incidentFilters} values={iFil} onChange={(key, value) => iSetFil((p) => ({ ...p, [key]: value }))} />
              </div>
              <div className="card-body p-0">
                <DataTable columns={incidentColumns} data={filteredIncidents} onRowClick={(row) => setSelectedIncident(row)} pageSize={10} emptyMessage="No user incidents found." />
              </div>
            </div>
            <DetailPanel open={!!selectedIncident} onClose={() => setSelectedIncident(null)} title="Incident Details">
              {selectedIncident && (
                <div>
                  <div className="detail-panel-section">
                    <h4>Overview</h4>
                    <div className="detail-field"><div className="detail-label">ID</div><div className="detail-value">{selectedIncident.id}</div></div>
                    <div className="detail-field"><div className="detail-label">Title</div><div className="detail-value">{selectedIncident.title}</div></div>
                    <div className="detail-field"><div className="detail-label">Description</div><div className="detail-value">{selectedIncident.description}</div></div>
                    <div className="detail-field"><div className="detail-label">Type</div><div className="detail-value"><StatusBadge status={selectedIncident.type} /></div></div>
                    <div className="detail-field"><div className="detail-label">Severity</div><div className="detail-value"><SeverityBadge severity={selectedIncident.severity} /></div></div>
                    <div className="detail-field"><div className="detail-label">Module</div><div className="detail-value"><StatusBadge status={selectedIncident.module} /></div></div>
                    <div className="detail-field"><div className="detail-label">Reporter</div><div className="detail-value">{selectedIncident.reporter}</div></div>
                    <div className="detail-field"><div className="detail-label">User Involved</div><div className="detail-value">{selectedIncident.respondentName}</div></div>
                    <div className="detail-field"><div className="detail-label">Assigned To</div><div className="detail-value">{selectedIncident.assignedName || <span className="text-muted">Unassigned</span>}</div></div>
                    <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={selectedIncident.status} /></div></div>
                  </div>
                  {selectedIncident.resolution && (
                    <div className="detail-panel-section">
                      <h4>Resolution</h4>
                      <div className="detail-field"><div className="detail-label">Resolution</div><div className="detail-value">{selectedIncident.resolution}</div></div>
                      {selectedIncident.resolvedAt && <div className="detail-field"><div className="detail-label">Resolved At</div><div className="detail-value">{formatDateTime(selectedIncident.resolvedAt)}</div></div>}
                    </div>
                  )}
                  <div className="detail-panel-section">
                    <h4>Actions</h4>
                    <div className="flex flex-col gap-2">
                      {selectedIncident.status !== 'resolved' && (
                        <>
                          <button className="btn btn-success" onClick={() => handleIncidentAction('resolve')}>Resolve Incident</button>
                          <button className="btn btn-outline" onClick={() => handleIncidentAction('assign')}>Assign to Me</button>
                          <button className="btn btn-outline" onClick={() => handleIncidentAction('escalate')}>Escalate</button>
                        </>
                      )}
                      {selectedIncident.status === 'resolved' && (
                        <button className="btn btn-outline" onClick={() => handleIncidentAction('reopen')}>Reopen Incident</button>
                      )}
                    </div>
                  </div>
                  {selectedIncident.timeline && selectedIncident.timeline.length > 0 && (
                    <div className="detail-panel-section">
                      <h4>Timeline</h4>
                      {selectedIncident.timeline.map((entry, i) => (
                        <div key={i} className="flex gap-3 py-2" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                          <div className="text-xs text-muted" style={{ minWidth: 140 }}>{formatDateTime(entry.date)}</div>
                          <div className="flex-1">
                            <div className="font-medium text-xs">{entry.title}</div>
                            <div className="text-xs text-muted">{entry.actor}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </DetailPanel>
          </div>
        )}
        {tab === 'appeals' && (
          <div className="card">
            <div className="card-header">
              <FilterBar filters={appealFilters} values={aFil} onChange={(key, value) => aSetFil((p) => ({ ...p, [key]: value }))} />
            </div>
            <div className="card-body p-0">
              <DataTable columns={appealColumns} data={filteredAppeals} onRowClick={(row) => navigate(`/appeals/${row.id}`)} pageSize={10} emptyMessage="No appeals found." />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
