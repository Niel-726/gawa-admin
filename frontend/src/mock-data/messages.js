const conversations = [
  {
    id: 'conv-001',
    participants: [{ userId: 'admin-001', name: 'Miguel Santos', role: 'admin' }, { userId: 'user-002', name: 'Maria Santos', role: 'talent' }],
    lastMessage: 'Thank you for the update. I will proceed with the verification.',
    lastMessageAt: '2025-05-20T14:30:00Z',
    unread: true,
    messages: [
      { id: 'msg-001', conversationId: 'conv-001', senderId: 'user-002', text: 'Hello, I wanted to follow up on my verification status.', createdAt: '2025-05-19T09:00:00Z' },
      { id: 'msg-002', conversationId: 'conv-001', senderId: 'admin-001', text: 'Hi Maria, your documents are still under review. We will get back to you within 2-3 business days.', createdAt: '2025-05-19T14:00:00Z' },
      { id: 'msg-003', conversationId: 'conv-001', senderId: 'user-002', text: 'Thank you for the update. I will proceed with the verification.', createdAt: '2025-05-20T14:30:00Z' },
    ],
  },
  {
    id: 'conv-002',
    participants: [{ userId: 'admin-001', name: 'Miguel Santos', role: 'admin' }, { userId: 'user-003', name: 'Pedro Reyes', role: 'contractor' }],
    lastMessage: 'Understood. I will provide the additional documents.',
    lastMessageAt: '2025-05-18T11:00:00Z',
    unread: false,
    messages: [
      { id: 'msg-004', conversationId: 'conv-002', senderId: 'admin-001', text: 'Pedro, we need your updated electrical license for the job posting.', createdAt: '2025-05-17T10:00:00Z' },
      { id: 'msg-005', conversationId: 'conv-002', senderId: 'user-003', text: 'Understood. I will provide the additional documents.', createdAt: '2025-05-18T11:00:00Z' },
    ],
  },
  {
    id: 'conv-003',
    participants: [{ userId: 'support-001', name: 'Angela Cruz', role: 'customer_support' }, { userId: 'user-005', name: 'Carlos Mendoza', role: 'talent' }],
    lastMessage: 'I am just waiting for the admin decision on the appeal.',
    lastMessageAt: '2025-05-20T09:00:00Z',
    unread: true,
    messages: [
      { id: 'msg-006', conversationId: 'conv-003', senderId: 'user-005', text: 'My account was suspended. I want to appeal this decision.', createdAt: '2025-05-18T08:00:00Z' },
      { id: 'msg-007', conversationId: 'conv-003', senderId: 'support-001', text: 'I have noted your appeal. It has been forwarded to our admin team.', createdAt: '2025-05-18T15:00:00Z' },
      { id: 'msg-008', conversationId: 'conv-003', senderId: 'user-005', text: 'I am just waiting for the admin decision on the appeal.', createdAt: '2025-05-20T09:00:00Z' },
    ],
  },
  {
    id: 'conv-004',
    participants: [{ userId: 'support-001', name: 'Angela Cruz', role: 'customer_support' }, { userId: 'user-004', name: 'Ana Gonzales', role: 'equipment_owner' }],
    lastMessage: 'Thank you for the help!',
    lastMessageAt: '2025-05-15T16:00:00Z',
    unread: false,
    messages: [
      { id: 'msg-009', conversationId: 'conv-004', senderId: 'user-004', text: 'I need help with a dispute about my concrete mixer.', createdAt: '2025-05-14T10:00:00Z' },
      { id: 'msg-010', conversationId: 'conv-004', senderId: 'support-001', text: 'I can see the damage report. Let me check the status for you.', createdAt: '2025-05-14T14:00:00Z' },
      { id: 'msg-011', conversationId: 'conv-004', senderId: 'support-001', text: 'The dispute has been resolved. PHP 1,500 was deducted from the deposit for repairs.', createdAt: '2025-05-15T09:00:00Z' },
      { id: 'msg-012', conversationId: 'conv-004', senderId: 'user-004', text: 'Thank you for the help!', createdAt: '2025-05-15T16:00:00Z' },
    ],
  },
  {
    id: 'conv-005',
    participants: [{ userId: 'admin-001', name: 'Miguel Santos', role: 'admin' }, { userId: 'user-001', name: 'Juan Dela Cruz', role: 'client' }],
    lastMessage: 'I will wait for the admin decision. Thank you.',
    lastMessageAt: '2025-04-25T10:00:00Z',
    unread: false,
    messages: [
      { id: 'msg-013', conversationId: 'conv-005', senderId: 'user-001', text: 'I filed a dispute about incomplete masonry work.', createdAt: '2025-04-20T09:00:00Z' },
      { id: 'msg-014', conversationId: 'conv-005', senderId: 'admin-001', text: 'Your dispute has been received and assigned for review.', createdAt: '2025-04-20T14:00:00Z' },
      { id: 'msg-015', conversationId: 'conv-005', senderId: 'admin-001', text: 'We are reviewing the evidence from both parties.', createdAt: '2025-04-23T09:00:00Z' },
      { id: 'msg-016', conversationId: 'conv-005', senderId: 'user-001', text: 'I will wait for the admin decision. Thank you.', createdAt: '2025-04-25T10:00:00Z' },
    ],
  },
];

export default conversations;
