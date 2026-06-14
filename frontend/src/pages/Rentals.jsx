import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { rentals } from '../mock-data';
import { formatDate, formatCurrency } from '../utils/helpers';
import Header from '../components/layout/Header';
import FilterBar from '../components/common/FilterBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const filters = [
  { key: 'status', label: 'Status', placeholder: 'All Statuses', options: [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ]},
  { key: 'depositStatus', label: 'Deposit', placeholder: 'All Deposits', options: [
    { value: 'held', label: 'Held' },
    { value: 'returned', label: 'Returned' },
    { value: 'deducted', label: 'Deducted' },
  ]},
];

export default function Rentals() {
  const navigate = useNavigate();
  const [fil, setFil] = useState({ status: '', depositStatus: '' });

  const filtered = useMemo(() => {
    let data = [...rentals];
    if (fil.status) data = data.filter((r) => r.status === fil.status);
    if (fil.depositStatus) data = data.filter((r) => r.depositStatus === fil.depositStatus);
    return data;
  }, [fil]);

  const columns = [
    { key: 'id', label: 'ID', render: (row) => <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.id}</span> },
    { key: 'listingTitle', label: 'Equipment' },
    { key: 'renterName', label: 'Renter' },
    { key: 'ownerName', label: 'Owner' },
    { key: 'totalAmount', label: 'Amount', render: (row) => formatCurrency(row.totalAmount) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'depositStatus', label: 'Deposit', render: (row) => <StatusBadge status={row.depositStatus} /> },
    { key: 'startDate', label: 'Start', render: (row) => formatDate(row.startDate) },
    { key: 'endDate', label: 'End', render: (row) => formatDate(row.endDate) },
  ];

  return (
    <div>
      <Header title="Rental Management" />
      <div className="card">
        <div className="card-header">
          <FilterBar filters={filters} values={fil} onChange={(key, value) => setFil((p) => ({ ...p, [key]: value }))} />
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{filtered.length} rentals</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable columns={columns} data={filtered} onRowClick={(row) => navigate(`/rentals/${row.id}`)} pageSize={10} emptyMessage="No rentals found." />
        </div>
      </div>
    </div>
  );
}
