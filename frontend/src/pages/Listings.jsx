import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { listings } from '../mock-data';
import { formatCurrency } from '../utils/helpers';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const filters = [
  { key: 'status', label: 'Status', placeholder: 'All Statuses', options: [
    { value: 'published', label: 'Published' },
    { value: 'flagged', label: 'Flagged' },

    { value: 'removed', label: 'Removed' },
  ]},
];

export default function Listings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [fil, setFil] = useState({ status: '' });

  const filtered = useMemo(() => {
    let data = [...listings];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((l) => l.title?.toLowerCase().includes(q) || l.ownerName?.toLowerCase().includes(q));
    }
    if (fil.status) data = data.filter((l) => l.status === fil.status);
    return data;
  }, [search, fil]);

  const columns = [
    { key: 'title', label: 'Listing', render: (row) => <span className="cell-link">{row.title}</span> },
    { key: 'category', label: 'Category' },
    { key: 'ownerName', label: 'Owner' },
    { key: 'dailyRate', label: 'Daily Rate', render: (row) => formatCurrency(row.dailyRate) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'rentalCount', label: 'Rentals' },
    { key: 'flags', label: 'Flags', render: (row) => row.flags > 0 ? <StatusBadge status="flagged" label={row.flags} /> : '-' },
  ];

  return (
    <div>
      <Header title="Listing Management" onSearch={setSearch} />
      <div className="card">
        <div className="card-header">
          <FilterBar filters={filters} values={fil} onChange={(key, value) => setFil((p) => ({ ...p, [key]: value }))} />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <DataTable columns={columns} data={filtered} onRowClick={(row) => navigate(`/listings/${row.id}`)} pageSize={10} emptyMessage="No listings found." />
        </div>
      </div>
    </div>
  );
}
