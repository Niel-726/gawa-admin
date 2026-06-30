import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../utils/permissions';
import {
  getActiveGalawPointsPacks, getAllGalawPointsTransactions, getDashboardStats,
  getGalawPointsPacks, createGalawPack, updateGalawPack, deleteGalawPack, setActiveGalawPack,
  issueGalawPoints, deductGalawPoints, users,
  getFeeConfigs, getActiveFeeConfig, createFeeConfig, updateFeeConfig,
  deleteFeeConfig, setActiveFeeConfig,
} from '../mock-data';
import { formatDate, formatCurrency, formatNumber } from '../utils/helpers';
import Header from '../components/layout/Header';
import Tabs from '../components/common/Tabs';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import StatCard from '../components/common/StatCard';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  Star, ArrowRight, RotateCcw, PhilippinePeso, Check, X, Plus, Minus, Save, Settings2,
} from 'lucide-react';

const emptyPackForm = { name: '', points: '', price: '', description: '' };

const emptyFeeForm = {
  name: '', proposalGpCost: '50', platformFeePercent: '2.5', gpConversionRate: '1.0',
  listingFee: '0', rentalCommission: '10',
};

const modalStyles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem',
  },
  modal: {
    background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
    width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto', padding: '1.5rem 2rem',
  },
  title: { fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--color-text)' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' },
};

export default function GalawPoints() {
  const { user: currentUser } = useAuth();
  const { can } = usePermissions(currentUser?.role);
  const [tab, setTab] = useState('packs');
  const [refreshKey, setRefreshKey] = useState(0);
  const [message, setMessage] = useState('');

  // --- Pack state ---
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ ...emptyPackForm });
  const [editingPack, setEditingPack] = useState(null);
  const [editForm, setEditForm] = useState({ ...emptyPackForm });
  const [deletingPack, setDeletingPack] = useState(null);
  const [togglingPack, setTogglingPack] = useState(null);
  const [showIssue, setShowIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({ userId: '', points: '', reason: '' });
  const [showDeduct, setShowDeduct] = useState(false);
  const [deductForm, setDeductForm] = useState({ userId: '', points: '', reason: '' });

  // --- Fee config state ---
  const [showFeeCreate, setShowFeeCreate] = useState(false);
  const [feeCreateForm, setFeeCreateForm] = useState({ ...emptyFeeForm });
  const [editingFee, setEditingFee] = useState(null);
  const [feeEditForm, setFeeEditForm] = useState({ ...emptyFeeForm });
  const [deletingFee, setDeletingFee] = useState(null);
  const [activatingFee, setActivatingFee] = useState(null);

  const allPacks = useMemo(() => getGalawPointsPacks(), [refreshKey]);
  const activePacks = useMemo(() => allPacks.filter((p) => p.isActive), [allPacks]);
  const transactions = useMemo(() => getAllGalawPointsTransactions(), [refreshKey]);
  const dashStats = getDashboardStats();
  const userOptions = useMemo(() => users.filter((u) => !['admin', 'customer_support'].includes(u.role)), []);
  const feeConfigs = useMemo(() => getFeeConfigs(), [refreshKey]);
  const activeFee = useMemo(() => getActiveFeeConfig(), [refreshKey]);

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 4000);
  };

  // --- Pack handlers ---
  const handleCreatePack = (e) => {
    e.preventDefault();
    const pack = createGalawPack({
      name: createForm.name,
      points: parseInt(createForm.points),
      price: parseFloat(createForm.price),
      description: createForm.description,
    });
    setShowCreate(false);
    setCreateForm({ ...emptyPackForm });
    setRefreshKey((k) => k + 1);
    showMsg(`Pack "${pack.name}" created`);
  };

  const handleEditPack = (e) => {
    e.preventDefault();
    updateGalawPack(editingPack.id, {
      name: editForm.name,
      points: parseInt(editForm.points),
      price: parseFloat(editForm.price),
      description: editForm.description,
    });
    setEditingPack(null);
    setRefreshKey((k) => k + 1);
    showMsg('Pack updated');
  };

  const handleDeletePack = () => {
    deleteGalawPack(deletingPack.id);
    setDeletingPack(null);
    setRefreshKey((k) => k + 1);
    showMsg(`Pack "${deletingPack.name}" deleted`);
  };

  const handleTogglePack = () => {
    const pack = togglingPack;
    setActiveGalawPack(pack.id, !pack.isActive);
    setTogglingPack(null);
    setRefreshKey((k) => k + 1);
    showMsg(`Pack "${pack.name}" ${pack.isActive ? 'deactivated' : 'activated'}`);
  };

  const openEditPack = (pack) => {
    setEditingPack(pack);
    setEditForm({
      name: pack.name,
      points: String(pack.points),
      price: String(pack.price),
      description: pack.description || '',
    });
  };

  const handleIssue = (e) => {
    e.preventDefault();
    const pts = parseInt(issueForm.points);
    if (!issueForm.userId || !pts || pts <= 0) return;
    issueGalawPoints(issueForm.userId, pts, issueForm.reason, currentUser?.name);
    setShowIssue(false);
    setIssueForm({ userId: '', points: '', reason: '' });
    setRefreshKey((k) => k + 1);
    showMsg(`Issued ${pts} GP`);
  };

  const handleDeduct = (e) => {
    e.preventDefault();
    const pts = parseInt(deductForm.points);
    if (!deductForm.userId || !pts || pts <= 0) return;
    deductGalawPoints(deductForm.userId, pts, deductForm.reason, currentUser?.name);
    setShowDeduct(false);
    setDeductForm({ userId: '', points: '', reason: '' });
    setRefreshKey((k) => k + 1);
    showMsg(`Deducted ${pts} GP`);
  };

  // --- Fee config handlers ---
  const handleCreateFee = (e) => {
    e.preventDefault();
    const cfg = createFeeConfig({
      name: feeCreateForm.name,
      proposalGpCost: parseFloat(feeCreateForm.proposalGpCost) || 0,
      platformFeePercent: parseFloat(feeCreateForm.platformFeePercent) || 0,
      gpConversionRate: parseFloat(feeCreateForm.gpConversionRate) || 0,
      listingFee: parseFloat(feeCreateForm.listingFee) || 0,
      rentalCommission: parseFloat(feeCreateForm.rentalCommission) || 0,
      updatedBy: currentUser?.name || 'Admin',
    });
    setShowFeeCreate(false);
    setFeeCreateForm({ ...emptyFeeForm });
    setRefreshKey((k) => k + 1);
    showMsg(`Fee config "${cfg.name}" created`);
  };

  const handleEditFee = (e) => {
    e.preventDefault();
    updateFeeConfig(editingFee.id, {
      name: feeEditForm.name,
      proposalGpCost: parseFloat(feeEditForm.proposalGpCost) || 0,
      platformFeePercent: parseFloat(feeEditForm.platformFeePercent) || 0,
      gpConversionRate: parseFloat(feeEditForm.gpConversionRate) || 0,
      listingFee: parseFloat(feeEditForm.listingFee) || 0,
      rentalCommission: parseFloat(feeEditForm.rentalCommission) || 0,
      updatedBy: currentUser?.name || 'Admin',
    });
    setEditingFee(null);
    setRefreshKey((k) => k + 1);
    showMsg('Fee config updated');
  };

  const handleDeleteFee = () => {
    const ok = deleteFeeConfig(deletingFee.id);
    if (!ok) {
      showMsg('Cannot delete the active fee config. Set another config as active first.', 'error');
      setDeletingFee(null);
      return;
    }
    setDeletingFee(null);
    setRefreshKey((k) => k + 1);
    showMsg(`Fee config "${deletingFee.name}" deleted`);
  };

  const handleSetActiveFee = () => {
    setActiveFeeConfig(activatingFee.id);
    setActivatingFee(null);
    setRefreshKey((k) => k + 1);
    showMsg(`"${activatingFee.name}" is now active`);
  };

  const openEditFee = (cfg) => {
    setEditingFee(cfg);
    setFeeEditForm({
      name: cfg.name,
      proposalGpCost: String(cfg.proposalGpCost),
      platformFeePercent: String(cfg.platformFeePercent),
      gpConversionRate: String(cfg.gpConversionRate),
      listingFee: String(cfg.listingFee),
      rentalCommission: String(cfg.rentalCommission),
    });
  };

  // --- Table columns ---
  const packCols = [
    { key: 'name', label: 'Pack Name' },
    { key: 'points', label: 'Points', render: (row) => <strong>{formatNumber(row.points)}</strong> },
    { key: 'price', label: 'Price', render: (row) => formatCurrency(row.price) },
    { key: 'description', label: 'Description' },
    { key: 'isActive', label: 'Active', render: (row) => row.isActive ? <Check size={16} color="var(--color-success)" /> : <X size={16} color="var(--color-error)" /> },
    { key: 'createdAt', label: 'Created', render: (row) => formatDate(row.createdAt) },
    ...(can('managePacks') ? [{
      key: 'actions', label: 'Actions', render: (row) => (
        <div className="table-actions">
          {row.isActive ? (
            <button className="btn btn-sm btn-outline" onClick={() => setTogglingPack(row)}>Deactivate</button>
          ) : (
            <button className="btn btn-sm btn-success" onClick={() => setTogglingPack(row)}>Set Active</button>
          )}
          <button className="btn btn-sm btn-outline" onClick={() => openEditPack(row)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => setDeletingPack(row)}>Delete</button>
        </div>
      ),
    }] : []),
  ];

  const txnCols = [
    { key: 'id', label: 'ID' },
    { key: 'userName', label: 'User' },
    { key: 'type', label: 'Type', render: (row) => <StatusBadge status={row.type} /> },
    { key: 'points', label: 'Points', render: (row) => (
      <span style={{ color: row.points > 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600 }}>
        {row.points > 0 ? '+' : ''}{row.points}
      </span>
    )},
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
  ];

  const feeCols = [
    { key: 'name', label: 'Name' },
    { key: 'proposalGpCost', label: 'GP/Proposal', render: (row) => `${row.proposalGpCost} GP` },
    { key: 'platformFeePercent', label: 'Fee %', render: (row) => `${row.platformFeePercent}%` },
    { key: 'gpConversionRate', label: 'GP Rate', render: (row) => `PHP ${row.gpConversionRate} / GP` },
    {
      key: 'isActive', label: 'Active', render: (row) => row.isActive
        ? <span className="status-badge active">Active</span>
        : <span className="status-badge inactive">Inactive</span>,
    },
    { key: 'updatedAt', label: 'Updated', render: (row) => formatDate(row.updatedAt) },
    ...(can('managePacks') ? [{
      key: 'actions', label: 'Actions', render: (row) => (
        <div className="table-actions">
          {!row.isActive && (
            <button className="btn btn-sm btn-success" onClick={() => setActivatingFee(row)}>Set Active</button>
          )}
          <button className="btn btn-sm btn-outline" onClick={() => openEditFee(row)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => setDeletingFee(row)} disabled={row.isActive}>Delete</button>
        </div>
      ),
    }] : []),
  ];

  const tabs = [
    { key: 'packs', label: 'Points Packs' },
    { key: 'transactions', label: 'Transaction History' },
    { key: 'fee-config', label: 'Fee Configuration' },
    { key: 'metrics', label: 'Platform Metrics' },
  ];

  // --- Render helpers ---
  const renderFeeConfigFields = (form, setter, prefix = '') => {
    const set = (key) => (e) => setter((p) => ({ ...p, [key]: e.target.value }));
    return (
      <>
        <div className="form-group">
          <label className="form-label">Configuration Name</label>
          <input className="form-input" placeholder="e.g. Default Rates" value={form.name} onChange={set('name')} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">GP Cost per Proposal</label>
            <input className="form-input" type="number" min="0" value={form.proposalGpCost} onChange={set('proposalGpCost')} />
            <div className="form-hint">Galaw Points deducted per job proposal</div>
          </div>
          <div className="form-group">
            <label className="form-label">Platform Fee (%)</label>
            <input className="form-input" type="number" min="0" step="0.1" value={form.platformFeePercent} onChange={set('platformFeePercent')} />
            <div className="form-hint">Percentage on all transactions</div>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">GP Conversion Rate (PHP/GP)</label>
            <input className="form-input" type="number" min="0" step="0.01" value={form.gpConversionRate} onChange={set('gpConversionRate')} />
            <div className="form-hint">1 Galaw Point = X PHP</div>
          </div>
          <div className="form-group">
            <label className="form-label">Listing Fee (GP)</label>
            <input className="form-input" type="number" min="0" step="0.01" value={form.listingFee} onChange={set('listingFee')} />
          </div>
        </div>
        <div className="form-row">
        </div>
        <div className="form-group">
          <label className="form-label">Rental Commission (%)</label>
          <input className="form-input" type="number" min="0" step="0.1" value={form.rentalCommission} style={{ maxWidth: 300 }} onChange={set('rentalCommission')} />
        </div>
      </>
    );
  };

  return (
    <div>
      <Header title="Galaw Points Management" />
      {message && (
        <div style={{
          padding: '0.625rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem',
          background: message.type === 'success' ? 'var(--color-success-subtle)' : 'var(--color-error-subtle)',
          color: message.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
          fontSize: 'var(--text-sm)',
        }}>
          {message.text}
        </div>
      )}

      <div className="kpi-row">
        <StatCard label="Total Purchased" value={formatNumber(dashStats.totalGalawPointsPurchased)} icon={<Star size={20} />} color="var(--color-success)" />
        <StatCard label="Total Consumed" value={formatNumber(dashStats.totalGalawPointsConsumed)} icon={<ArrowRight size={20} />} color="var(--color-warning)" />
        <StatCard label="Total Refunded" value={formatNumber(dashStats.totalGalawPointsRefunded)} icon={<RotateCcw size={20} />} color="var(--color-blue)" />
        <StatCard label="Outstanding Balance" value={formatNumber(dashStats.outstandingGalawPoints)} icon={<PhilippinePeso size={20} />} color="var(--color-text)" />
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      <div className="tab-content">
        {/* === Packs Tab === */}
        {tab === 'packs' && (
          <div>
            {can('managePacks') && (
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-accent" onClick={() => { setCreateForm({ ...emptyPackForm }); setShowCreate(true); }}>
                  <Plus size={16} /> Create New Pack
                </button>
              </div>
            )}
            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                <DataTable columns={packCols} data={allPacks} pageSize={10} emptyMessage="No points packs configured." />
              </div>
            </div>
          </div>
        )}

        {/* === Transactions Tab === */}
        {tab === 'transactions' && (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <DataTable columns={txnCols} data={transactions} pageSize={10} emptyMessage="No transactions found." />
            </div>
          </div>
        )}

        {/* === Fee Config Tab === */}
        {tab === 'fee-config' && (
          <div>
            {can('managePacks') && (
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-accent" onClick={() => { setFeeCreateForm({ ...emptyFeeForm }); setShowFeeCreate(true); }}>
                  <Plus size={16} /> Create Fee Config
                </button>
              </div>
            )}
            {activeFee && (
              <div className="card mb-4">
                <div className="card-header"><h3><Settings2 size={16} style={{ marginRight: 6 }} />Active Configuration: {activeFee.name}</h3></div>
                <div className="card-body">
                  <div className="fee-config-preview-grid">
                    {[
                      { label: 'GP Cost per Proposal', value: `${activeFee.proposalGpCost} GP` },
                      { label: 'Platform Fee', value: `${activeFee.platformFeePercent}%` },
                      { label: 'GP Conversion Rate', value: `PHP ${activeFee.gpConversionRate} / GP` },
                      { label: 'Listing Fee', value: `${activeFee.listingFee} GP` },
                      { label: 'Rental Commission', value: `${activeFee.rentalCommission}%` },
                    ].map((item, i) => (
                      <div key={i} className="fee-config-preview-item">
                        <div className="fee-config-preview-label">{item.label}</div>
                        <div className="fee-config-preview-value">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="card">
              <div className="card-body" style={{ padding: 0 }}>
                <DataTable columns={feeCols} data={feeConfigs} pageSize={10} emptyMessage="No fee configurations." />
              </div>
            </div>
          </div>
        )}

        {/* === Metrics Tab === */}
        {tab === 'metrics' && (
          <div className="card">
            <div className="card-body">
              <div className="detail-grid">
                <div className="detail-field"><div className="detail-label">Total Purchased</div><div className="detail-value">{formatNumber(dashStats.totalGalawPointsPurchased)} GP</div></div>
                <div className="detail-field"><div className="detail-label">Total Consumed</div><div className="detail-value">{formatNumber(dashStats.totalGalawPointsConsumed)} GP</div></div>
                <div className="detail-field"><div className="detail-label">Total Refunded</div><div className="detail-value">{formatNumber(dashStats.totalGalawPointsRefunded)} GP</div></div>
                <div className="detail-field"><div className="detail-label">Outstanding Balances</div><div className="detail-value">{formatNumber(dashStats.outstandingGalawPoints)} GP</div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {can('issuePoints') && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-success" onClick={() => { setIssueForm({ userId: '', points: '', reason: '' }); setShowIssue(true); }}>
            <Plus size={16} /> Manual Issue Points
          </button>
          <button className="btn btn-danger" onClick={() => { setDeductForm({ userId: '', points: '', reason: '' }); setShowDeduct(true); }}>
            <Minus size={16} /> Manual Deduct Points
          </button>
        </div>
      )}

      {/* ====== Create Pack Modal ====== */}
      {showCreate && (
        <div style={modalStyles.overlay} onClick={() => setShowCreate(false)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.title}>Create Points Pack</div>
            <form onSubmit={handleCreatePack}>
              <div className="form-group">
                <label className="form-label">Pack Name</label>
                <input className="form-input" placeholder="e.g. Starter Pack" value={createForm.name} onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Points</label>
                  <input className="form-input" type="number" min="1" placeholder="100" value={createForm.points} onChange={(e) => setCreateForm((p) => ({ ...p, points: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (PHP)</label>
                  <input className="form-input" type="number" min="0" step="0.01" placeholder="100" value={createForm.price} onChange={(e) => setCreateForm((p) => ({ ...p, price: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" placeholder="Brief description" value={createForm.description} onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={modalStyles.actions}>
                <button type="button" className="btn btn-outline" onClick={() => setShowCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent">Create Pack</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== Edit Pack Modal ====== */}
      {editingPack && (
        <div style={modalStyles.overlay} onClick={() => setEditingPack(null)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.title}>Edit Pack: {editingPack.name}</div>
            <form onSubmit={handleEditPack}>
              <div className="form-group">
                <label className="form-label">Pack Name</label>
                <input className="form-input" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Points</label>
                  <input className="form-input" type="number" min="1" value={editForm.points} onChange={(e) => setEditForm((p) => ({ ...p, points: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (PHP)</label>
                  <input className="form-input" type="number" min="0" step="0.01" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div style={modalStyles.actions}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingPack(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== Delete Pack ====== */}
      <ConfirmModal
        open={!!deletingPack}
        title="Delete Points Pack"
        message={`Are you sure you want to delete "${deletingPack?.name}"?`}
        confirmLabel="Delete Pack"
        variant="danger"
        onConfirm={handleDeletePack}
        onCancel={() => setDeletingPack(null)}
      />

      {/* ====== Issue Points ====== */}
      {showIssue && (
        <div style={modalStyles.overlay} onClick={() => setShowIssue(false)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.title}>Manual Issue Points</div>
            <form onSubmit={handleIssue}>
              <div className="form-group">
                <label className="form-label">User</label>
                <select className="form-select" value={issueForm.userId} onChange={(e) => setIssueForm((p) => ({ ...p, userId: e.target.value }))} required>
                  <option value="">Select a user...</option>
                  {userOptions.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Points to Issue</label>
                <input className="form-input" type="number" min="1" placeholder="e.g. 200" value={issueForm.points} onChange={(e) => setIssueForm((p) => ({ ...p, points: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input className="form-input" placeholder="e.g. Compensation for platform error" value={issueForm.reason} onChange={(e) => setIssueForm((p) => ({ ...p, reason: e.target.value }))} />
              </div>
              <div style={modalStyles.actions}>
                <button type="button" className="btn btn-outline" onClick={() => setShowIssue(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Issue Points</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== Deduct Points ====== */}
      {showDeduct && (
        <div style={modalStyles.overlay} onClick={() => setShowDeduct(false)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.title}>Manual Deduct Points</div>
            <form onSubmit={handleDeduct}>
              <div className="form-group">
                <label className="form-label">User</label>
                <select className="form-select" value={deductForm.userId} onChange={(e) => setDeductForm((p) => ({ ...p, userId: e.target.value }))} required>
                  <option value="">Select a user...</option>
                  {userOptions.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Points to Deduct</label>
                <input className="form-input" type="number" min="1" placeholder="e.g. 100" value={deductForm.points} onChange={(e) => setDeductForm((p) => ({ ...p, points: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <input className="form-input" placeholder="e.g. Violation penalty" value={deductForm.reason} onChange={(e) => setDeductForm((p) => ({ ...p, reason: e.target.value }))} />
              </div>
              <div style={modalStyles.actions}>
                <button type="button" className="btn btn-outline" onClick={() => setShowDeduct(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Deduct Points</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== Create Fee Config Modal ====== */}
      {showFeeCreate && (
        <div style={modalStyles.overlay} onClick={() => setShowFeeCreate(false)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.title}>Create Fee Configuration</div>
            <form onSubmit={handleCreateFee}>
              {renderFeeConfigFields(feeCreateForm, setFeeCreateForm)}
              <div style={modalStyles.actions}>
                <button type="button" className="btn btn-outline" onClick={() => setShowFeeCreate(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent"><Save size={16} /> Create Config</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== Edit Fee Config Modal ====== */}
      {editingFee && (
        <div style={modalStyles.overlay} onClick={() => setEditingFee(null)}>
          <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={modalStyles.title}>Edit: {editingFee.name}</div>
            <form onSubmit={handleEditFee}>
              {renderFeeConfigFields(feeEditForm, setFeeEditForm)}
              <div style={modalStyles.actions}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingFee(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary"><Save size={16} /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====== Delete Fee Config ====== */}
      <ConfirmModal
        open={!!deletingFee}
        title="Delete Fee Configuration"
        message={`Are you sure you want to delete "${deletingFee?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteFee}
        onCancel={() => setDeletingFee(null)}
      />

      {/* ====== Set Active Fee Config ====== */}
      <ConfirmModal
        open={!!activatingFee}
        title="Set Active Configuration"
        message={`Set "${activatingFee?.name}" as the active fee configuration? This will deactivate the current active config.`}
        confirmLabel="Set Active"
        variant="success"
        onConfirm={handleSetActiveFee}
        onCancel={() => setActivatingFee(null)}
      />

      {/* ====== Toggle Pack Active ====== */}
      <ConfirmModal
        open={!!togglingPack}
        title={togglingPack?.isActive ? 'Deactivate Pack' : 'Activate Pack'}
        message={`${togglingPack?.isActive ? 'Deactivate' : 'Activate'} "${togglingPack?.name}"? ${togglingPack?.isActive ? 'Users will no longer be able to purchase this pack.' : 'This pack will become available for purchase.'}`}
        confirmLabel={togglingPack?.isActive ? 'Deactivate' : 'Activate'}
        variant={togglingPack?.isActive ? 'warning' : 'success'}
        onConfirm={handleTogglePack}
        onCancel={() => setTogglingPack(null)}
      />
    </div>
  );
}
