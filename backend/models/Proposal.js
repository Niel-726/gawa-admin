class ProposalModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.jobId = data.jobId || '';
    this.talentId = data.talentId || '';
    this.amount = data.amount || 0;
    this.status = data.status || 'pending';
    this.coverLetter = data.coverLetter || '';
    this.galawPointsUsed = data.galawPointsUsed || 0;
    this.completionStatus = data.completionStatus || null;
    this.proofOfCompletion = data.proofOfCompletion || null;
    this.submittedAt = data.submittedAt || new Date().toISOString();
  }
}

module.exports = ProposalModel;
