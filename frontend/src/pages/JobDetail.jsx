import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { usePermissions } from '../utils/permissions';
import { getJobById, getProposalsByJob, updateJobStatus } from '../mock-data';
import { formatDate, formatCurrency } from '../utils/helpers';
import Header from '../components/layout/Header';
import Tabs from '../components/common/Tabs';
import StatusBadge from '../components/common/StatusBadge';
import NotesPanel from '../components/common/NotesPanel';
import ConfirmModal from '../components/common/ConfirmModal';
import { Check, Circle, ChevronRight } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { can } = usePermissions(currentUser?.role);
  const { addNotification } = useNotifications();
  const job = getJobById(id);
  const [refresh, setRefresh] = useState(0);
  const proposals = useMemo(() => getProposalsByJob(id), [id, refresh]);
  const [activeTab, setActiveTab] = useState('Proposals');
  const [showConfirm, setShowConfirm] = useState(null);

  if (!job) {
    return (
      <div>
        <Header title="Job Not Found" />
        <div className="empty-state">
          <div className="empty-state-text">Job not found</div>
          <button className="btn btn-outline mt-4" onClick={() => navigate('/jobs')}>Back to Jobs</button>
        </div>
      </div>
    );
  }

  const acceptedProp = proposals.find((p) => p.id === job.acceptedProposalId);
  const allTasksDone = job.tasks?.length > 0 && job.tasks.every((t) => t.status === 'completed');
  const taskProgress = job.tasks?.length > 0 ? Math.round((job.tasks.filter((t) => t.status === 'completed').length / job.tasks.length) * 100) : 0;

  return (
    <div>
      <Header title={job.title} />
      <div className="card">
        <div className="card-body" style={{ padding: 'var(--space-3) var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{job.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', color: 'var(--color-text-muted)', fontSize: 13, marginTop: 2 }}>
                <span>by {job.clientName}</span>
                <span>{job.category}</span>
                <span>{job.type}</span>
                <span>{job.location}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {job.status === 'active' && can('finishJob') && <button className="btn btn-accent btn-sm" onClick={() => setShowConfirm('finish')}>Finish</button>}
              {job.status === 'finished' && can('completeJob') && <button className="btn btn-success btn-sm" onClick={() => setShowConfirm('complete')}>Complete</button>}
              {can('flagJob') && <button className="btn btn-outline btn-sm" onClick={() => setShowConfirm('flag')}>Flag</button>}
              {can('removeJob') && <button className="btn btn-danger btn-sm" onClick={() => setShowConfirm('remove')}>Remove</button>}
              <button className="btn btn-accent btn-sm" onClick={() => navigate('/messages')}>Message</button>
            </div>
          </div>

          {(job.images?.length > 0) && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {job.images.map((url, i) => (
                <div key={i} style={{ width: 200, height: 130, borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: 'var(--color-surface-offset)' }}>
                  <img src={url} alt={`${job.title} photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          )}

          <div className="detail-grid" style={{ gap: 'var(--space-3)' }}>
            <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={job.status} /></div></div>
            <div className="detail-field"><div className="detail-label">Budget</div><div className="detail-value">{formatCurrency(job.budget)}</div></div>
            <div className="detail-field"><div className="detail-label">Deadline</div><div className="detail-value">{formatDate(job.deadline)}</div></div>
            <div className="detail-field"><div className="detail-label">Proposals</div><div className="detail-value">{job.proposalCount}</div></div>
            <div className="detail-field"><div className="detail-label">Created</div><div className="detail-value">{formatDate(job.createdAt)}</div></div>
            <div className="detail-field"><div className="detail-label">Flags</div><div className="detail-value">{job.flags > 0 ? <StatusBadge status="flagged" /> : 'None'}</div></div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <div className="detail-label" style={{ marginBottom: '0.25rem' }}>Description</div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text-muted)' }}>{job.description}</p>
          </div>
          {job.skills?.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div className="detail-label" style={{ marginBottom: '0.25rem' }}>Skills Required</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {job.skills.map((s, idx) => <span key={idx} className="status-badge" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="detail-strip" style={{ marginTop: 'var(--space-3)', gap: 'var(--space-3)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Tabs tabs={['Proposals', 'Tasks']} activeTab={activeTab} onChange={setActiveTab} />
          <div className="tab-content" style={{ marginTop: 'var(--space-3)' }}>
            {activeTab === 'Proposals' && (
              <div className="card">
                <div className="card-header">
                  <h3>Proposals</h3>
                  {job.proposalCount > 0 && <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{job.proposalCount} total</span>}
                </div>
                <div className="card-body">
                  {acceptedProp && (
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 6 }}><Check size={14} /> Accepted Proposal</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13 }}><strong>{acceptedProp.talentName}</strong> - {formatCurrency(acceptedProp.amount)}</span>
                        <StatusBadge status={acceptedProp.completionStatus || 'pending'} label={acceptedProp.completionStatus || 'Not started'} />
                      </div>
                    </div>
                  )}
                  {proposals.length === 0 ? (
                    <div className="empty-state" style={{ padding: 'var(--space-8) var(--space-5)' }}><div className="empty-state-text">No proposals yet</div></div>
                  ) : (
                    proposals.map((p) => (
                      <div key={p.id} className="proposal-card" style={{ marginBottom: '0.75rem', padding: 'var(--space-4) var(--space-5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{p.talentName}</span>
                          <span style={{ fontSize: 13 }}>{formatCurrency(p.amount)}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>{p.coverLetter}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span>GP Used: {p.galawPointsUsed}</span>
                          <span><StatusBadge status={p.status} /></span>
                          <span>{formatDate(p.submittedAt)}</span>
                          {p.status === 'pending' && !acceptedProp && can('acceptProposal') && (
                            <button className="btn btn-sm btn-success" style={{ marginLeft: 'auto' }} onClick={() => addNotification('moderation_decision', 'Proposal Acceptance', 'Proposal acceptance is for users only (simulated).', `/jobs/${job.id}`)}>Accept</button>
                          )}
                        </div>
                        {p.proofOfCompletion && (
                          <div style={{ marginTop: 6, padding: '0.5rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)' }}>
                            <span style={{ fontSize: 12, fontWeight: 500 }}>Proof: </span>
                            {p.proofOfCompletion.map((f, idx) => <span key={idx} style={{ fontSize: 12, color: 'var(--color-blue)', marginRight: 6 }}>{f}</span>)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {activeTab === 'Tasks' && (
              <div className="card">
                <div className="card-header">
                  <h3>Tasks & Milestones</h3>
                  {job.tasks?.length > 0 && (
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                      {taskProgress}% complete ({job.tasks.filter((t) => t.status === 'completed').length}/{job.tasks.length} tasks)
                    </span>
                  )}
                </div>
                <div className="card-body">
                  {job.status !== 'finished' && job.status !== 'completed' ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      <Circle size={28} style={{ opacity: 0.3, marginBottom: 6 }} />
                      <p style={{ fontSize: 13 }}>Tasks are available once the job is finished.</p>
                    </div>
                  ) : job.tasks?.length === 0 ? (
                    <div className="empty-state"><div className="empty-state-text">No tasks configured for this job.</div></div>
                  ) : (
                    <>
                      <div style={{ marginBottom: '0.75rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', height: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${taskProgress}%`, height: '100%', background: taskProgress === 100 ? 'var(--color-success)' : 'var(--color-accent)', borderRadius: 'var(--radius-md)', transition: 'width 0.3s' }} />
                      </div>
                      {job.tasks.map((task) => (
                        <div key={task.id} className="task-card">
                          <div className="task-card-left">
                            <div className={`task-status-icon ${task.status === 'completed' ? 'done' : task.status === 'in-progress' ? 'active' : ''}`}>
                              {task.status === 'completed' ? <Check size={14} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: task.status === 'in-progress' ? 'var(--color-warning)' : 'var(--color-border)' }} />}
                            </div>
                            <div>
                              <div className="task-card-name" style={{ fontSize: 13 }}>{task.name}</div>
                              {task.milestone && <div className="task-card-milestone"><ChevronRight size={10} /> {task.milestone}</div>}
                            </div>
                          </div>
                          <StatusBadge status={task.status} />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="card" style={{ width: 280, flexShrink: 0 }}>
          <div className="card-header"><h3>Admin Notes</h3></div>
          <div className="card-body" style={{ padding: 'var(--space-3) var(--space-4)' }}>
            <NotesPanel
              notes={job.notes || []}
              onAddNote={(note) => { addNotification('moderation_decision', 'Note Added on Job', `Note added to job "${job.title}": ${note.text}`, `/jobs/${job.id}`); }}
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!showConfirm}
        title={showConfirm === 'flag' ? 'Flag Job' : showConfirm === 'remove' ? 'Remove Job' : showConfirm === 'finish' ? 'Mark Job as Finished' : 'Mark Job as Completed'}
        message={
          showConfirm === 'flag' ? 'Are you sure you want to flag this job for review?' :
          showConfirm === 'remove' ? 'Are you sure you want to remove this job permanently?' :
          showConfirm === 'finish' ? 'Mark this job as finished? All pending proposals will be rejected and GP refunded.' :
          'Mark this job as completed? This confirms all work is done.'
        }
        confirmLabel={showConfirm === 'flag' ? 'Flag' : showConfirm === 'remove' ? 'Remove' : showConfirm === 'finish' ? 'Mark Finished' : 'Mark Completed'}
        variant={showConfirm === 'remove' ? 'danger' : showConfirm === 'flag' ? 'warning' : 'success'}
        onConfirm={() => {
          if (showConfirm === 'finish') updateJobStatus(job.id, 'finished');
          else if (showConfirm === 'complete') updateJobStatus(job.id, 'completed');
          addNotification('job_completed', 'Job Status Changed', `Job "${job.title}" ${showConfirm}ed`, `/jobs/${job.id}`);
          setShowConfirm(null);
        }}
        onCancel={() => setShowConfirm(null)}
      />
    </div>
  );
}
