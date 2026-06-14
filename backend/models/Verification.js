class VerificationModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || '';
    this.type = data.type || 'government_id';
    this.status = data.status || 'pending';
    this.documents = data.documents || [];
    this.reviewerId = data.reviewerId || null;
    this.remarks = data.remarks || '';
    this.submittedAt = data.submittedAt || new Date().toISOString();
    this.reviewedAt = data.reviewedAt || null;
  }
}

module.exports = VerificationModel;
