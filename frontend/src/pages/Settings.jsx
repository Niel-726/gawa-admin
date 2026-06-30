import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { usePermissions } from '../utils/permissions';
import { createUser, incidents } from '../mock-data';
import { formatDateTime } from '../utils/helpers';
import Header from '../components/layout/Header';
import Tabs from '../components/common/Tabs';
import StatusBadge from '../components/common/StatusBadge';
import DataTable from '../components/common/DataTable';

const DEFAULT_CREDENTIALS = { password: 'gawa@123' };

export default function Settings() {
  const { user } = useAuth();
  const { can } = usePermissions(user?.role);
  const { preferences, togglePreference } = useNotifications();
  const [tab, setTab] = useState('profile');
  const [twoFA, setTwoFA] = useState(false);

  // Password reset state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');

  // Invitation state
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'admin' });
  const [inviteMsg, setInviteMsg] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    { id: 'user-016', name: 'Miguel Santos', email: 'miguel.santos@gawa.ph', role: 'admin' },
    { id: 'user-017', name: 'Angela Cruz', email: 'angela.cruz@gawa.ph', role: 'customer_support' },
  ]);

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Password & Security' },
    { key: 'sessions', label: 'Active Sessions' },
    { key: 'activity', label: 'Admin Activity' },
    ...(can('manageSettings') ? [{ key: 'team', label: 'Team Members' }, { key: 'service-area', label: 'Service Area' }, { key: 'notifications', label: 'Notifications' }] : []),
  ];

  const activeSessions = [
    { device: 'Chrome on Windows', ip: '192.168.1.100', lastActive: '2025-05-20T14:30:00Z', current: true },
    { device: 'Safari on macOS', ip: '192.168.1.101', lastActive: '2025-05-19T09:00:00Z', current: false },
    { device: 'Firefox on Linux', ip: '203.0.113.45', lastActive: '2025-05-18T16:00:00Z', current: false },
  ];

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg('Passwords do not match');
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwMsg('Password must be at least 6 characters');
      return;
    }
    setPwMsg('Password updated successfully');
    setPwForm({ current: '', newPw: '', confirm: '' });
    setTimeout(() => setPwMsg(''), 3000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email) {
      setInviteMsg('Please fill in all fields');
      return;
    }
    const newMember = {
      id: `user-${Date.now()}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      password: DEFAULT_CREDENTIALS.password,
    };
    createUser({
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'verified',
      verified: true,
      phone: '',
      location: '',
      skills: [],
      rating: 0,
      totalJobs: 0,
      galawPoints: 0,
      flags: 0,
      notes: [],
    });
    setTeamMembers((prev) => [...prev, newMember]);
    setInviteMsg(`Invitation sent to ${inviteForm.email}. Default password: ${DEFAULT_CREDENTIALS.password}`);
    setInviteForm({ name: '', email: '', role: 'admin' });
    setTimeout(() => setInviteMsg(''), 5000);
  };

  return (
    <div>
      <Header title="Settings" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <div className="tab-content">
        {tab === 'profile' && (
          <div className="settings-card">
            <div className="settings-card-title">Profile Settings</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" defaultValue={user?.name} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" defaultValue={user?.email} />
              </div>
            </div>
            <button className="btn btn-primary mt-4">Save Changes</button>
          </div>
        )}

        {tab === 'security' && (
          <div className="settings-card">
            <div className="settings-card-title">Password & Security</div>
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Enter current password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter new password"
                    value={pwForm.newPw}
                    onChange={(e) => setPwForm((p) => ({ ...p, newPw: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Confirm new password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
                    required
                  />
                </div>
              </div>
              {pwMsg && (
                <div style={{ fontSize: 13, color: pwMsg.includes('success') ? 'var(--color-success)' : 'var(--color-error)', marginBottom: 12 }}>
                  {pwMsg}
                </div>
              )}
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

            <div className="settings-row">
              <div>
                <div style={{ fontWeight: 500 }}>Two-Factor Authentication</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Add an extra layer of security to your account</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        )}

        {tab === 'sessions' && (
          <div className="settings-card">
            <div className="settings-card-title">Active Sessions</div>
            {activeSessions.map((s, idx) => (
              <div key={idx} className="settings-row">
                <div>
                  <div style={{ fontWeight: 500 }}>{s.device} {s.current && <span style={{ fontSize: 12, color: 'var(--color-success)' }}>(Current)</span>}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>IP: {s.ip}</div>
                </div>
                {!s.current && <button className="btn btn-sm btn-outline">Revoke</button>}
              </div>
            ))}
          </div>
        )}

        {tab === 'activity' && (
          <div className="settings-card">
            <div className="settings-card-title">Admin Activity Log</div>
            <div className="card-body" style={{ padding: 0 }}>
              <DataTable
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'agentName', label: 'Agent' },
                  { key: 'action', label: 'Action', render: (row) => <StatusBadge status={row.action} /> },
                  { key: 'module', label: 'Module', render: (row) => <StatusBadge status={row.module} /> },
                  { key: 'description', label: 'Description' },
                  { key: 'createdAt', label: 'Timestamp', render: (row) => formatDateTime(row.createdAt) },
                ]}
                data={incidents}
                pageSize={15}
                emptyMessage="No activity logs."
                sortable={false}
              />
            </div>
          </div>
        )}

        {tab === 'team' && can('manageSettings') && (
          <div className="settings-card">
            <div className="settings-card-title">Team Members</div>
            <div style={{ marginBottom: 24 }}>
              {teamMembers.map((m) => (
                <div key={m.id} className="settings-row">
                  <div>
                    <div style={{ fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{m.email}</div>
                  </div>
                  <StatusBadge status={m.role} />
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 16, color: 'var(--color-text)' }}>Invite New Team Member</div>
              <form onSubmit={handleInvite}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      placeholder="e.g. Juan Cruz"
                      value={inviteForm.name}
                      onChange={(e) => setInviteForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="e.g. juan.cruz@gawa.ph"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm((p) => ({ ...p, role: e.target.value }))}
                  >
                    <option value="admin">Admin</option>
                    <option value="customer_support">Customer Support</option>
                  </select>
                </div>
                {inviteMsg && (
                  <div style={{ fontSize: 13, color: inviteMsg.includes('success') ? 'var(--color-success)' : 'var(--color-warning)', marginBottom: 12 }}>
                    {inviteMsg}
                  </div>
                )}
                <button type="submit" className="btn btn-primary">Send Invitation</button>
              </form>
            </div>
          </div>
        )}

        {tab === 'service-area' && can('manageSettings') && (
          <div className="settings-card">
            <div className="settings-card-title">Service Area Configuration</div>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Configure the geographic areas where GAWA operates.</p>
            <div className="form-group">
              <label className="form-label">Covered Provinces</label>
              <textarea className="form-textarea" rows={4} defaultValue="Bulacan, Metro Manila, Pampanga, Nueva Ecija, Rizal, Laguna, Cavite" />
            </div>
            <button className="btn btn-primary">Save Configuration</button>
          </div>
        )}

        {tab === 'notifications' && can('manageSettings') && (
          <div className="settings-card">
            <div className="settings-card-title">Notification Preferences</div>
            <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Choose which types of notifications you'd like to receive.</p>
            {[
              { key: 'user_registrations', label: 'New user registrations' },
              { key: 'verification_requests', label: 'Verification requests' },
              { key: 'dispute_filings', label: 'Dispute filings' },
              { key: 'appeal_filings', label: 'Appeal filings' },
              { key: 'flagged_content', label: 'Flagged content' },
              { key: 'new_reports', label: 'New reports' },
            ].map(({ key, label }) => (
              <div key={key} className="settings-row">
                <span style={{ fontSize: 14 }}>{label}</span>
                <label className="toggle">
                  <input type="checkbox" checked={preferences[key]} onChange={() => togglePreference(key)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
