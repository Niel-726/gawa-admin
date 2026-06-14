class ReportModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || 'content_report';
    this.reporterId = data.reporterId || '';
    this.targetType = data.targetType || '';
    this.targetId = data.targetId || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.severity = data.severity || 'medium';
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.resolvedAt = data.resolvedAt || null;
    this.decision = data.decision || null;
    this.decisionNotes = data.decisionNotes || null;
  }
}
module.exports = ReportModel;
