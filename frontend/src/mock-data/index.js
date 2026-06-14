import users from './users';
import verifications from './verifications';
import jobs from './jobs';
import proposals from './proposals';
import listings from './listings';
import rentals from './rentals';
import transactions from './transactions';
import disputes from './disputes';
import reports from './reports';
import reviews from './reviews';
import conversations from './messages';
import appeals from './appeals';
import incidents from './incidents';
import userIncidents from './userIncidents';
import { galawPointsPacks, galawPointsTransactions } from './galawPoints';
import dashboardStats from './dashboard';
import feeConfigs from './feeConfig';
import categories from './categories';
import questions from './questions';
import assessments, { assessmentResponses } from './assessments';

// User helpers
export function getUserById(id) {
  return users.find((u) => u.id === id) || null;
}

export function getUsersByRole(role) {
  return users.filter((u) => u.role === role);
}

export function getUsersByStatus(status) {
  return users.filter((u) => u.status === status);
}

export function getVerifiedUsers() {
  return users.filter((u) => u.verified);
}

export function getActiveUsers() {
  return users.filter((u) => u.status === 'verified');
}

// Verification helpers
export function getVerificationById(id) {
  return verifications.find((v) => v.id === id) || null;
}

export function getVerificationsByUser(userId) {
  return verifications.filter((v) => v.userId === userId);
}

export function getVerificationsByStatus(status) {
  return verifications.filter((v) => v.status === status);
}

export function getPendingVerifications() {
  return verifications.filter((v) => v.status === 'pending');
}

// Job helpers
export function getJobById(id) {
  return jobs.find((j) => j.id === id) || null;
}

export function getJobsByUser(userId, role) {
  if (role === 'talent' || role === 'contractor') {
    const jobIds = proposals.filter((p) => p.talentId === userId && p.status === 'accepted').map((p) => p.jobId);
    return jobs.filter((j) => jobIds.includes(j.id));
  }
  return jobs.filter((j) => j.clientId === userId);
}

export function getJobsByStatus(status) {
  return jobs.filter((j) => j.status === status);
}

export function getActiveJobs() {
  return jobs.filter((j) => j.status === 'active');
}

export function getFlaggedJobs() {
  return jobs.filter((j) => j.flags > 0);
}

// Proposal helpers
export function getProposalById(id) {
  return proposals.find((p) => p.id === id) || null;
}

export function getProposalsByJob(jobId) {
  return proposals.filter((p) => p.jobId === jobId);
}

export function getProposalsByTalent(talentId) {
  return proposals.filter((p) => p.talentId === talentId);
}

export function getAcceptedProposals() {
  return proposals.filter((p) => p.status === 'accepted');
}

// Listing helpers
export function getListingById(id) {
  return listings.find((l) => l.id === id) || null;
}

export function getListingsByOwner(ownerId) {
  return listings.filter((l) => l.ownerId === ownerId);
}

export function getListingsByStatus(status) {
  return listings.filter((l) => l.status === status);
}

export function getPublishedListings() {
  return listings.filter((l) => l.status === 'published');
}

// Rental helpers
export function getRentalById(id) {
  return rentals.find((r) => r.id === id) || null;
}

export function getRentalsByListing(listingId) {
  return rentals.filter((r) => r.listingId === listingId);
}

export function getRentalsByUser(userId) {
  return rentals.filter((r) => r.renterId === userId || r.ownerId === userId);
}

export function getActiveRentals() {
  return rentals.filter((r) => r.status === 'active');
}

// Transaction helpers
export function getTransactionById(id) {
  return transactions.find((t) => t.id === id) || null;
}

export function getTransactionsByUser(userId) {
  return transactions.filter((t) => t.userId === userId);
}

export function getTransactionsByType(type) {
  return transactions.filter((t) => t.type === type);
}

export function getTransactionsByStatus(status) {
  return transactions.filter((t) => t.status === status);
}

export function getEscrowTransactions() {
  return transactions.filter((t) => t.status === 'escrow' || t.status === 'held');
}

// Dispute helpers
export function getDisputeById(id) {
  return disputes.find((d) => d.id === id) || null;
}

export function getDisputesByUser(userId) {
  return disputes.filter((d) => d.reporterId === userId || d.respondentId === userId);
}

export function getDisputesByStatus(status) {
  return disputes.filter((d) => d.status === status);
}

export function getOpenDisputes() {
  return disputes.filter((d) => d.status !== 'resolved' && d.status !== 'dismissed');
}

export function getPendingDisputes() {
  return disputes.filter((d) => d.status === 'pending');
}

// Report helpers
export function getReportById(id) {
  return reports.find((r) => r.id === id) || null;
}

export function getReportsByStatus(status) {
  return reports.filter((r) => r.status === status);
}

export function getPendingReports() {
  return reports.filter((r) => r.status === 'pending' || r.status === 'under-review');
}

// Review helpers
export function getReviewById(id) {
  return reviews.find((r) => r.id === id) || null;
}

export function getFlaggedReviews() {
  return reviews.filter((r) => r.status === 'flagged');
}

export function getReviewsByTarget(targetId) {
  return reviews.filter((r) => r.targetId === targetId);
}

export function getPublishedReviews() {
  return reviews.filter((r) => r.status === 'published');
}

// Message helpers
export function getConversationById(id) {
  return conversations.find((c) => c.id === id) || null;
}

export function getConversationsByUser(userId) {
  return conversations.filter((c) => c.participants.some((p) => p.userId === userId));
}

export function getUnreadConversations() {
  return conversations.filter((c) => c.unread);
}

// Appeal helpers
export function getAppealById(id) {
  return appeals.find((a) => a.id === id) || null;
}

export function getAppealsByUser(userId) {
  return appeals.filter((a) => a.userId === userId);
}

export function getAppealsByStatus(status) {
  return appeals.filter((a) => a.status === status);
}

export function getPendingAppeals() {
  return appeals.filter((a) => a.status === 'pending');
}

// Incident helpers
export function getIncidentById(id) {
  return incidents.find((i) => i.id === id) || null;
}

export function getIncidentLogsByAgent(agentId) {
  return incidents.filter((i) => i.agentId === agentId);
}

export function getIncidentsByModule(module) {
  return incidents.filter((i) => i.module === module);
}

export function getIncidentsByAction(action) {
  return incidents.filter((i) => i.action === action);
}

// User Incident helpers
export function getUserIncidentById(id) {
  return userIncidents.find((i) => i.id === id) || null;
}

export function getUserIncidentsByStatus(status) {
  return userIncidents.filter((i) => i.status === status);
}

export function getUserIncidentsBySeverity(severity) {
  return userIncidents.filter((i) => i.severity === severity);
}

export function getUserIncidentsByType(type) {
  return userIncidents.filter((i) => i.type === type);
}

export function getOpenUserIncidents() {
  return userIncidents.filter((i) => i.status !== 'resolved' && i.status !== 'dismissed');
}

// Galaw Points helpers
export function getGalawPointsPacks() {
  return galawPointsPacks;
}

export function getActiveGalawPointsPacks() {
  return galawPointsPacks.filter((p) => p.isActive);
}

export function getGalawPointsTransactionsByUser(userId) {
  return galawPointsTransactions.filter((t) => t.userId === userId);
}

export function getGalawPointsTransactionsByType(type) {
  return galawPointsTransactions.filter((t) => t.type === type);
}

export function getAllGalawPointsTransactions() {
  return galawPointsTransactions;
}

// Dashboard helpers
export function getDashboardStats() {
  return dashboardStats;
}

// Fee config CRUD helpers
export function getFeeConfigs() {
  return [...feeConfigs];
}

export function getActiveFeeConfig() {
  return feeConfigs.find((c) => c.isActive) || feeConfigs[0] || null;
}

export function createFeeConfig(data) {
  const cfg = {
    id: generateMockId('fee'),
    ...data,
    isActive: feeConfigs.length === 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  feeConfigs.push(cfg);
  return cfg;
}

export function updateFeeConfig(id, updates) {
  const idx = feeConfigs.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  feeConfigs[idx] = { ...feeConfigs[idx], ...updates, updatedAt: new Date().toISOString() };
  return feeConfigs[idx];
}

export function deleteFeeConfig(id) {
  const idx = feeConfigs.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  if (feeConfigs[idx].isActive) return false;
  feeConfigs.splice(idx, 1);
  return true;
}

export function setActiveFeeConfig(id) {
  let found = null;
  for (const cfg of feeConfigs) {
    if (cfg.id === id) {
      cfg.isActive = true;
      cfg.updatedAt = new Date().toISOString();
      found = cfg;
    } else {
      cfg.isActive = false;
    }
  }
  return found;
}

// Category helpers
export function getCategories() {
  return [...categories];
}

export function getCategoryById(id) {
  return categories.find((c) => c.id === id) || null;
}

export function getActiveCategories() {
  return categories.filter((c) => c.isActive);
}

export function createCategory(data) {
  const cat = {
    id: generateMockId('cat'),
    ...data,
    jobCount: 0,
    listingCount: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  categories.push(cat);
  return cat;
}

export function updateCategory(id, updates) {
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  categories[idx] = { ...categories[idx], ...updates };
  return categories[idx];
}

export function deleteCategory(id) {
  const idx = categories.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  if (categories[idx].jobCount > 0 || categories[idx].listingCount > 0) return false;
  categories.splice(idx, 1);
  return true;
}

// Galaw Points mutation helpers
export function createGalawPack(data) {
  const pack = {
    id: generateMockId('galaw-pack'),
    ...data,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  galawPointsPacks.push(pack);
  return pack;
}

export function updateGalawPack(id, updates) {
  const idx = galawPointsPacks.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  galawPointsPacks[idx] = { ...galawPointsPacks[idx], ...updates };
  return galawPointsPacks[idx];
}

export function deleteGalawPack(id) {
  const idx = galawPointsPacks.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  galawPointsPacks.splice(idx, 1);
  return true;
}

export function setActiveGalawPack(id, active) {
  const idx = galawPointsPacks.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  galawPointsPacks[idx].isActive = active;
  return galawPointsPacks[idx];
}

export function updateUserGalawPoints(userId, delta) {
  const user = getUserById(userId);
  if (user) user.galawPoints = Math.max(0, (user.galawPoints || 0) + delta);
}

export function issueGalawPoints(userId, points, reason, adminName) {
  const txn = {
    id: generateMockId('gp-txn'),
    userId,
    userName: getUserById(userId)?.name || 'Unknown',
    type: 'issued',
    points,
    amount: 0,
    adminId: 'admin-001',
    description: reason || 'Manual issue',
    createdAt: new Date().toISOString(),
  };
  galawPointsTransactions.push(txn);
  updateUserGalawPoints(userId, points);
  return txn;
}

export function deductGalawPoints(userId, points, reason, adminName) {
  const txn = {
    id: generateMockId('gp-txn'),
    userId,
    userName: getUserById(userId)?.name || 'Unknown',
    type: 'deducted',
    points: -Math.abs(points),
    amount: 0,
    adminId: 'admin-001',
    description: reason || 'Manual deduction',
    createdAt: new Date().toISOString(),
  };
  galawPointsTransactions.push(txn);
  updateUserGalawPoints(userId, -Math.abs(points));
  return txn;
}

// Question helpers
export function getQuestions() {
  return [...questions];
}

export function getQuestionsByCategory(categoryId) {
  return questions.filter((q) => q.categoryId === categoryId && q.isActive);
}

export function getQuestionById(id) {
  return questions.find((q) => q.id === id) || null;
}

export function createQuestion(data) {
  const q = {
    id: generateMockId('q'),
    ...data,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  questions.push(q);
  return q;
}

export function updateQuestion(id, updates) {
  const idx = questions.findIndex((q) => q.id === id);
  if (idx === -1) return null;
  questions[idx] = { ...questions[idx], ...updates };
  return questions[idx];
}

export function deleteQuestion(id) {
  const idx = questions.findIndex((q) => q.id === id);
  if (idx === -1) return false;
  questions.splice(idx, 1);
  return true;
}

// Assessment helpers
export function getAssessments() {
  return [...assessments];
}

export function getAssessmentById(id) {
  return assessments.find((a) => a.id === id) || null;
}

export function getAssessmentsByUser(userId) {
  return assessments.filter((a) => a.userId === userId);
}

export function getAssessmentsByCategory(categoryId) {
  return assessments.filter((a) => a.categoryId === categoryId);
}

export function createAssessment(data) {
  const a = {
    id: generateMockId('as'),
    status: 'in_progress',
    score: 0,
    totalPoints: 0,
    startedAt: new Date().toISOString(),
    completedAt: null,
    gradedBy: null,
    gradedAt: null,
    ...data,
  };
  assessments.push(a);
  return a;
}

export function updateAssessment(id, updates) {
  const idx = assessments.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  assessments[idx] = { ...assessments[idx], ...updates };
  return assessments[idx];
}

export function getResponsesByAssessment(assessmentId) {
  return assessmentResponses.filter((r) => r.assessmentId === assessmentId);
}

export function addResponse(data) {
  const r = {
    id: generateMockId('ar'),
    ...data,
  };
  assessmentResponses.push(r);
  return r;
}

export function updateResponse(id, updates) {
  const idx = assessmentResponses.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  assessmentResponses[idx] = { ...assessmentResponses[idx], ...updates };
  return assessmentResponses[idx];
}

// Mutation helpers (for interactive actions on mock data)
function generateMockId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function updateTransaction(id, updates) {
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  transactions[idx] = { ...transactions[idx], ...updates };
  return transactions[idx];
}

export function createTransaction(data) {
  const txn = {
    id: generateMockId('txn'),
    ...data,
    createdAt: new Date().toISOString(),
  };
  transactions.push(txn);
  return txn;
}

export function createUser(userData) {
  const newUser = {
    id: generateMockId('user'),
    ...userData,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
}

export function updateUser(id, updates) {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
  return users[idx];
}

// Verification enforcement helper
export function verifyUserCanPost(userId) {
  const user = getUserById(userId);
  return user && user.verified && user.status === 'verified';
}

// Job/Proposal mutation helpers
export function acceptProposal(jobId, proposalId) {
  const job = getJobById(jobId);
  for (const p of proposals) {
    if (p.jobId === jobId) {
      const wasPending = p.status === 'pending';
      p.status = p.id === proposalId ? 'accepted' : 'rejected';
      if (wasPending && p.id !== proposalId && (p.galawPointsUsed || 0) > 0) {
        const refundPoints = p.galawPointsUsed;
        const refundTxn = {
          id: generateMockId('gp-txn'),
          userId: p.talentId,
          userName: p.talentName || getUserById(p.talentId)?.name || 'Unknown',
          type: 'refunded',
          points: refundPoints,
          amount: 0,
          jobId,
          description: `Proposal rejected - refunded ${refundPoints} GP`,
          createdAt: new Date().toISOString(),
        };
        galawPointsTransactions.push(refundTxn);
        updateUserGalawPoints(p.talentId, refundPoints);
      }
    }
  }
  if (job) {
    job.acceptedProposalId = proposalId;
    job.proposalCount = proposals.filter((p) => p.jobId === jobId).length;
  }
  return true;
}

export function updateJobStatus(jobId, status) {
  const job = getJobById(jobId);
  if (!job) return null;
  job.status = status;
  if (status === 'finished') {
    for (const p of proposals) {
      if (p.jobId === jobId && p.status === 'pending') {
        p.status = 'rejected';
        if ((p.galawPointsUsed || 0) > 0) {
          const refundPoints = p.galawPointsUsed;
          const refundTxn = {
            id: generateMockId('gp-txn'),
            userId: p.talentId,
            userName: p.talentName || getUserById(p.talentId)?.name || 'Unknown',
            type: 'refunded',
            points: refundPoints,
            amount: 0,
            jobId,
            description: `Proposal rejected - refunded ${refundPoints} GP`,
            createdAt: new Date().toISOString(),
          };
          galawPointsTransactions.push(refundTxn);
          updateUserGalawPoints(p.talentId, refundPoints);
        }
      }
    }
  }
  return job;
}

export function updateTaskStatus(jobId, taskId, status) {
  const job = getJobById(jobId);
  if (!job) return null;
  const task = job.tasks?.find((t) => t.id === taskId);
  if (!task) return null;
  task.status = status;
  return task;
}

export function createJob(clientId, data) {
  if (!verifyUserCanPost(clientId)) {
    alert('Unverified users cannot post jobs. Please complete verification first.');
    return null;
  }
  const job = {
    id: generateMockId('job'),
    ...data,
    clientId,
    status: 'active',
    proposalCount: 0,
    acceptedProposalId: null,
    flags: 0,
    tasks: [],
    notes: [],
    createdAt: new Date().toISOString(),
  };
  jobs.push(job);
  const user = getUserById(clientId);
  if (user) user.totalJobs = (user.totalJobs || 0) + 1;
  return job;
}

export function submitProposal(talentId, jobId, data) {
  if (!verifyUserCanPost(talentId)) {
    alert('Unverified users cannot submit proposals. Please complete verification first.');
    return null;
  }
  const config = getActiveFeeConfig();
  const gpCost = config?.proposalGpCost || 0;
  const user = getUserById(talentId);
  if (gpCost > 0 && (!user || (user.galawPoints || 0) < gpCost)) {
    alert('Insufficient Galaw Points. Please purchase more GP before submitting a proposal.');
    return null;
  }
  const prop = {
    id: generateMockId('prop'),
    jobId,
    talentId,
    ...data,
    status: 'pending',
    completionStatus: null,
    proofOfCompletion: null,
    submittedAt: new Date().toISOString(),
  };
  if (gpCost > 0) {
    prop.galawPointsUsed = gpCost;
    deductGalawPoints(talentId, gpCost, `Proposal submission - ${getJobById(jobId)?.title || ''}`, undefined);
  }
  proposals.push(prop);
  const job = getJobById(jobId);
  if (job) job.proposalCount = proposals.filter((p) => p.jobId === jobId).length;
  return prop;
}

// Combined overview
export function getQuickStats() {
  return {
    totalUsers: users.length,
    verifiedUsers: getVerifiedUsers().length,
    activeJobs: getActiveJobs().length,
    activeRentals: getActiveRentals().length,
    pendingDisputes: getPendingDisputes().length,
    flaggedContent: getFlaggedJobs().length + getFlaggedReviews().length + listings.filter(l => l.status === 'flagged').length,
    totalTransactions: transactions.length,
    pendingVerifications: getPendingVerifications().length,
    pendingAppeals: getPendingAppeals().length,
  };
}

// Bulk export for direct access
export {
  users,
  verifications,
  jobs,
  proposals,
  listings,
  rentals,
  transactions,
  disputes,
  reports,
  reviews,
  conversations,
  appeals,
  incidents,
  userIncidents,
  galawPointsPacks,
  galawPointsTransactions,
  dashboardStats,
  feeConfigs,
  categories,
  questions,
  assessments,
  assessmentResponses,
};
