class AppealModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || '';
    this.status = data.status || 'pending';
    this.suspensionReason = data.suspensionReason || '';
    this.supportRecommendation = data.supportRecommendation || null;
    this.supportNotes = data.supportNotes || '';
    this.filedAt = data.filedAt || new Date().toISOString();
    this.decidedAt = data.decidedAt || null;
    this.decision = data.decision || null;
    this.decisionNotes = data.decisionNotes || '';
    this.timeline = data.timeline || [];
    this.notes = data.notes || [];
  }
}
module.exports = AppealModel;
