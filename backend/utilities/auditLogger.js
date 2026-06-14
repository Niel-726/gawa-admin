const auditLogs = [];

function createAuditLogEntry({ agentId, agentName, action, module, targetId, targetType, description, ipAddress, userAgent }) {
  const entry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    agentId: agentId || 'system',
    agentName: agentName || 'System',
    action,
    module,
    targetId,
    targetType,
    description,
    ipAddress: ipAddress || '0.0.0.0',
    userAgent: userAgent || 'unknown',
    createdAt: new Date().toISOString(),
  };
  auditLogs.push(entry);
  console.log(`[AUDIT] ${entry.agentName} - ${entry.action} on ${entry.targetType} ${entry.targetId}`);
  return entry;
}

function queryAuditLogs(filters = {}) {
  let logs = [...auditLogs];
  if (filters.agentId) logs = logs.filter((l) => l.agentId === filters.agentId);
  if (filters.module) logs = logs.filter((l) => l.module === filters.module);
  if (filters.action) logs = logs.filter((l) => l.action === filters.action);
  if (filters.startDate) logs = logs.filter((l) => new Date(l.createdAt) >= new Date(filters.startDate));
  if (filters.endDate) logs = logs.filter((l) => new Date(l.createdAt) <= new Date(filters.endDate));
  return logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = { createAuditLogEntry, queryAuditLogs };
