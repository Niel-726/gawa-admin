import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../utils/permissions';
import { users } from '../mock-data';
import { formatDate, getInitials } from '../utils/helpers';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import DataTable from '../components/common/DataTable';
import StatusBadge from '../components/common/StatusBadge';

const roleFilters = [
  { key: 'role', label: 'Role', placeholder: 'All Roles', options: [
    { value: 'client', label: 'Client' },
    { value: 'talent', label: 'Talent' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'equipment_owner', label: 'Equipment Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'customer_support', label: 'Support' },
  ]},
  { key: 'status', label: 'Status', placeholder: 'All Statuses', options: [
    { value: 'verified', label: 'Verified' },
    { value: 'unverified', label: 'Unverified' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'archived', label: 'Archived' },
  ]},
];

export default function Users() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { can } = usePermissions(user?.role);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ role: '', status: '' });

  const filtered = useMemo(() => {
    let data = [...users];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.location?.toLowerCase().includes(q));
    }
    if (filters.role) data = data.filter((u) => u.role === filters.role);
    if (filters.status) data = data.filter((u) => u.status === filters.status);
    return data;
  }, [search, filters]);

  const columns = [
    { key: 'name', label: 'User', render: (row) => (
      <div className="flex items-center gap-2">
        <div className="user-avatar-sm">{getInitials(row.name)}</div>
        <div>
          <div className="cell-link">{row.name}</div>
          <div className="text-xs text-muted">{row.email}</div>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: (row) => <StatusBadge status={row.role} /> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'location', label: 'Location' },
    { key: 'joinedAt', label: 'Joined', render: (row) => formatDate(row.joinedAt) },
    { key: 'rating', label: 'Rating', render: (row) => row.rating > 0 ? row.rating.toFixed(1) : '-' },
  ];

  return (
    <div>
      <Header title="User Management" />
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3 flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
            <FilterBar filters={roleFilters} values={filters} onChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))} />
          </div>
          <div className="text-sm text-muted">{users.length} users</div>
        </div>
        <div className="card-body p-0">
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={(row) => navigate(`/users/${row.id}`)}
            pageSize={10}
            emptyMessage="No users found matching your criteria."
          />
        </div>
      </div>
    </div>
  );
}
