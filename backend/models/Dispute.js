class DisputeModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.severity = data.severity || 'medium';
    this.status = data.status || 'pending';
    this.reporterId = data.reporterId || '';
    this.respondentId = data.respondentId || '';
    this.relatedId = data.relatedId || null;
    this.relatedType = data.relatedType || null;
    this.assignedTo = data.assignedTo || null;
    this.evidence = data.evidence || [];
    this.timeline = data.timeline || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.resolvedAt = data.resolvedAt || null;
    this.resolution = data.resolution || null;
    this.notes = data.notes || [];
  }
}
module.exports = DisputeModel;
