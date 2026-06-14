const galawPointsPacks = [
  { id: 'galaw-pack-001', name: 'Starter Pack', points: 100, price: 100, description: 'Get started with 100 Galaw Points', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'galaw-pack-002', name: 'Work Pack', points: 500, price: 450, description: '500 points at a 10% discount', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'galaw-pack-003', name: 'Pro Pack', points: 1000, price: 850, description: '1000 points at a 15% discount', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'galaw-pack-004', name: 'Enterprise Pack', points: 5000, price: 4000, description: '5000 points at a 20% discount', isActive: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'galaw-pack-005', name: 'Mega Pack', points: 10000, price: 7500, description: '10000 points at a 25% discount', isActive: false, createdAt: '2024-06-01T00:00:00Z' },
];

const galawPointsTransactions = [
  { id: 'gp-txn-001', userId: 'user-001', userName: 'Juan Dela Cruz', type: 'purchase', points: 500, amount: 500, packId: 'galaw-pack-002', description: 'Purchased Work Pack', createdAt: '2025-05-01T09:00:00Z' },
  { id: 'gp-txn-002', userId: 'user-002', userName: 'Maria Santos', type: 'consumed', points: -50, amount: 0, jobId: 'job-001', description: 'Proposal submission - Masonry Wall', createdAt: '2025-04-12T09:00:00Z' },
  { id: 'gp-txn-003', userId: 'user-003', userName: 'Pedro Reyes', type: 'purchase', points: 1000, amount: 850, packId: 'galaw-pack-003', description: 'Purchased Pro Pack', createdAt: '2025-04-10T10:00:00Z' },
  { id: 'gp-txn-004', userId: 'user-003', userName: 'Pedro Reyes', type: 'consumed', points: -50, amount: 0, jobId: 'job-002', description: 'Proposal submission - Electrical Rewiring', createdAt: '2025-04-22T11:00:00Z' },
  { id: 'gp-txn-005', userId: 'user-011', userName: 'Jose Rizal III', type: 'purchase', points: 2000, amount: 1700, packId: 'galaw-pack-003', description: 'Purchased 2x Pro Packs', createdAt: '2025-05-01T08:00:00Z' },
  { id: 'gp-txn-006', userId: 'user-011', userName: 'Jose Rizal III', type: 'consumed', points: -50, amount: 0, jobId: 'job-006', description: 'Proposal submission - Carpentry Works', createdAt: '2025-05-03T07:30:00Z' },
  { id: 'gp-txn-007', userId: 'user-003', userName: 'Pedro Reyes', type: 'issued', points: 200, amount: 0, adminId: 'admin-001', description: 'Manual issue - compensation for platform error', createdAt: '2025-05-10T09:00:00Z' },
  { id: 'gp-txn-008', userId: 'user-020', userName: 'Danilo Fernandez', type: 'consumed', points: -50, amount: 0, jobId: 'job-003', description: 'Proposal submission - Stage Setup', createdAt: '2025-03-03T08:00:00Z' },
  { id: 'gp-txn-009', userId: 'user-005', userName: 'Carlos Mendoza', type: 'purchase', points: 500, amount: 500, packId: 'galaw-pack-002', description: 'Purchased Work Pack', createdAt: '2025-02-01T10:00:00Z' },
  { id: 'gp-txn-010', userId: 'user-009', userName: 'Antonio Flores', type: 'consumed', points: -50, amount: 0, jobId: 'job-005', description: 'Proposal submission - Warehouse Racks', createdAt: '2025-04-17T10:00:00Z' },
  { id: 'gp-txn-011', userId: 'user-008', userName: 'Isabel Cruz', type: 'purchase', points: 1000, amount: 850, packId: 'galaw-pack-003', description: 'Purchased Pro Pack', createdAt: '2025-04-05T09:00:00Z' },
  { id: 'gp-txn-012', userId: 'user-002', userName: 'Maria Santos', type: 'consumed', points: -50, amount: 0, jobId: 'job-007', description: 'Proposal submission - Event Staff & Setup', createdAt: '2025-02-12T09:00:00Z' },
  { id: 'gp-txn-013', userId: 'user-020', userName: 'Danilo Fernandez', type: 'consumed', points: -50, amount: 0, jobId: 'job-001', description: 'Proposal submission - Masonry Wall', createdAt: '2025-04-13T14:00:00Z' },
  { id: 'gp-txn-014', userId: 'user-020', userName: 'Danilo Fernandez', type: 'refunded', points: 50, amount: 0, jobId: 'job-001', description: 'Proposal rejected - refunded 50 GP', createdAt: '2025-04-20T10:00:00Z' },
  { id: 'gp-txn-015', userId: 'user-009', userName: 'Antonio Flores', type: 'consumed', points: -50, amount: 0, jobId: 'job-002', description: 'Proposal submission - Electrical Rewiring', createdAt: '2025-04-23T09:00:00Z' },
  { id: 'gp-txn-016', userId: 'user-009', userName: 'Antonio Flores', type: 'refunded', points: 50, amount: 0, jobId: 'job-002', description: 'Proposal rejected - refunded 50 GP', createdAt: '2025-04-25T11:00:00Z' },
];

export { galawPointsPacks, galawPointsTransactions };
