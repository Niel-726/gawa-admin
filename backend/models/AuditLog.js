class AuditLogModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.agentId = data.agentId || '';
    this.agentName = data.agentName || '';
    this.action = data.action || '';
    this.module = data.module || '';
    this.targetId = data.targetId || null;
    this.targetType = data.targetType || '';
    this.description = data.description || '';
    this.ipAddress = data.ipAddress || '';
    this.userAgent = data.userAgent || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
module.exports = AuditLogModel;
