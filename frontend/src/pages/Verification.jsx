import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { usePermissions } from '../utils/permissions';
import { verifications, users, updateUser } from '../mock-data';
import { formatDateTime, capitalizeWords } from '../utils/helpers';
import Header from '../components/layout/Header';
import Tabs from '../components/common/Tabs';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';
import DetailPanel from '../components/common/DetailPanel';
import EvidenceGallery from '../components/common/EvidenceGallery';
import NotesPanel from '../components/common/NotesPanel';

const statusTabs = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export default function Verification() {
  const { user: currentUser } = useAuth();
  const { can } = usePermissions(currentUser?.role);
  const { addNotification } = useNotifications();
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let data = verifications.filter((v) => v.status === tab);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((v) => v.userName?.toLowerCase().includes(q));
    }
    return data;
  }, [tab, search]);

  const columns = [
    { key: 'userName', label: 'User', render: (row) => <span className="font-medium">{row.userName}</span> },
    { key: 'userRole', label: 'Role', render: (row) => <StatusBadge status={row.userRole} /> },
    { key: 'type', label: 'ID Type', render: (row) => capitalizeWords(row.type) },
    { key: 'submittedAt', label: 'Submitted', render: (row) => formatDateTime(row.submittedAt) },
    { key: 'reviewedAt', label: 'Reviewed', render: (row) => row.reviewedAt ? formatDateTime(row.reviewedAt) : '-' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ];

  const handleApprove = (v) => {
    updateUser(v.userId, { status: 'verified', verified: true });
    v.status = 'approved';
    v.reviewedAt = new Date().toISOString();
    v.reviewerId = 'admin-001';
    addNotification('verification_approved', 'Verification Approved', `Verification approved for ${v.userName}`, `/users/${v.userId}`);
  };

  const handleReject = (v) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      updateUser(v.userId, { status: 'unverified', verified: false });
      v.status = 'rejected';
      v.reviewedAt = new Date().toISOString();
      v.reviewerId = 'admin-001';
      v.remarks = reason;
      addNotification('verification_rejected', 'Verification Rejected', `Verification rejected for ${v.userName}: ${reason}`, `/users/${v.userId}`);
    }
  };

  return (
    <div>
      <Header title="Verification Management" onSearch={setSearch} />
      <Tabs tabs={statusTabs} activeTab={tab} onChange={setTab} />
      <div className="tab-content">
        <div className="card">
          <div className="card-body p-0">
            <DataTable
              columns={[
                ...columns,
                ...(tab === 'pending' ? [{
                  key: 'actions', label: 'Actions', render: (row) => (
                    <div className="table-actions">
                      {can('approveVerification') && <button className="btn btn-sm btn-success" onClick={(e) => { e.stopPropagation(); handleApprove(row); }}>Approve</button>}
                      {can('rejectVerification') && <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleReject(row); }}>Reject</button>}
                    </div>
                  ),
                }] : []),
              ]}
              data={filtered}
              onRowClick={(row) => setSelected(row)}
              pageSize={10}
              emptyMessage="No verification requests found."
            />
          </div>
        </div>
      </div>

      <DetailPanel open={!!selected} onClose={() => setSelected(null)} title="Verification Details">
        {selected && (
          <div>
            <div className="detail-panel-section">
              <h4>User Information</h4>
              <div className="detail-field"><div className="detail-label">Name</div><div className="detail-value">{selected.userName}</div></div>
              <div className="detail-field"><div className="detail-label">Role</div><div className="detail-value">{capitalizeWords(selected.userRole)}</div></div>
              <div className="detail-field"><div className="detail-label">Submitted</div><div className="detail-value">{formatDateTime(selected.submittedAt)}</div></div>
              <div className="detail-field"><div className="detail-label">Status</div><div className="detail-value"><StatusBadge status={selected.status} /></div></div>
            </div>
            <div className="detail-panel-section">
              <h4>Documents</h4>
              <EvidenceGallery items={selected.documents?.map((d) => ({ label: d.name, type: d.type })) || []} />
            </div>
            {selected.remarks && (
              <div className="detail-panel-section">
                <h4>Reviewer Remarks</h4>
                <p className="text-sm">{selected.remarks}</p>
              </div>
            )}
            <div className="detail-panel-section">
              <h4>Actions</h4>
              <div className="flex gap-2">
                {selected.status === 'pending' && (
                  <>
                    {can('approveVerification') && <button className="btn btn-success" onClick={() => handleApprove(selected)}>Approve</button>}
                    {can('rejectVerification') && <button className="btn btn-danger" onClick={() => handleReject(selected)}>Reject</button>}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </DetailPanel>
    </div>
  );
}
