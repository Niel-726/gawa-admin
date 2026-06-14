const reviews = [
  { id: 'rev-001', reviewerId: 'user-001', reviewerName: 'Juan Dela Cruz', targetId: 'user-002', targetName: 'Maria Santos', targetType: 'talent', rating: 5, text: 'Excellent masonry work. Very professional and on time.', status: 'published', createdAt: '2025-04-18T10:00:00Z', flags: 0 },
  { id: 'rev-002', reviewerId: 'user-019', reviewerName: 'Gloria Macapagal', targetId: 'user-020', targetName: 'Danilo Fernandez', targetType: 'talent', rating: 4, text: 'Good event setup team. Stage looked great.', status: 'published', createdAt: '2025-03-17T09:00:00Z', flags: 0 },
  { id: 'rev-003', reviewerId: 'user-005', reviewerName: 'Carlos Mendoza', targetId: 'user-003', targetName: 'Pedro Reyes', targetType: 'contractor', rating: 1, text: 'Terrible experience. Would not recommend.', status: 'flagged', createdAt: '2025-05-16T14:00:00Z', flags: 2 },
  { id: 'rev-004', reviewerId: 'user-004', reviewerName: 'Ana Gonzales', targetId: 'user-011', targetName: 'Jose Rizal III', targetType: 'contractor', rating: 5, text: 'Best contractor we have worked with. Highly recommended!', status: 'published', createdAt: '2025-05-09T11:00:00Z', flags: 0 },
  { id: 'rev-005', reviewerId: 'user-014', reviewerName: 'Carmen Torres', targetId: 'user-003', targetName: 'Pedro Reyes', targetType: 'contractor', rating: 3, text: 'Work is ok but communication needs improvement.', status: 'flagged', createdAt: '2025-05-20T08:00:00Z', flags: 1 },
  { id: 'rev-006', reviewerId: 'user-006', reviewerName: 'Elena Villanueva', targetId: 'user-002', targetName: 'Maria Santos', targetType: 'talent', rating: 4, text: 'Good work quality. Would hire again.', status: 'published', createdAt: '2025-05-10T15:00:00Z', flags: 0 },
  { id: 'rev-007', reviewerId: 'user-009', reviewerName: 'Antonio Flores', targetId: 'user-004', targetName: 'Ana Gonzales', targetType: 'equipment_owner', rating: 5, text: 'Equipment in excellent condition. Smooth rental process.', status: 'published', createdAt: '2025-05-08T10:00:00Z', flags: 0 },
  { id: 'rev-008', reviewerId: 'user-003', reviewerName: 'Pedro Reyes', targetId: 'user-004', targetName: 'Ana Gonzales', targetType: 'equipment_owner', rating: 2, text: 'Concrete mixer was not as described. Had issues starting.', status: 'flagged', createdAt: '2025-04-09T08:00:00Z', flags: 1 },
];

export default reviews;
