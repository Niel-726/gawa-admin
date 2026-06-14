const auditLogs = [];

function createAuditLog({ agentId, agentName, action, module, targetId, targetType, description, ipAddress, userAgent }) {
  const entry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    agentId: agentId || 'system',
    agentName: agentName || 'System',
    action,
    module,
    targetId,
    targetType,
    description,
    ipAddress: ipAddress || req?.ip || '0.0.0.0',
    userAgent: userAgent || req?.headers?.['user-agent'] || 'unknown',
    createdAt: new Date().toISOString(),
  };

  auditLogs.push(entry);
  console.log(`[AUDIT] ${entry.agentName} - ${entry.action} on ${entry.targetType} ${entry.targetId}`);

  return entry;
}

function auditMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    if (req.method !== 'GET' && res.statusCode < 400) {
      const action = `${req.method} ${req.originalUrl}`;
      createAuditLog({
        agentId: req.user?.id,
        agentName: req.user?.name,
        action,
        module: req.originalUrl.split('/')[1] || 'unknown',
        targetId: req.params?.id,
        targetType: req.originalUrl.split('/')[1] || 'unknown',
        description: `${req.method} on ${req.originalUrl}`,
        ipAddress: req.ip,
        userAgent: req.headers?.['user-agent'],
      });
    }
    return originalJson(body);
  };
  next();
}

function getAuditLogs(filters = {}) {
  let logs = [...auditLogs];
  if (filters.agentId) logs = logs.filter((l) => l.agentId === filters.agentId);
  if (filters.module) logs = logs.filter((l) => l.module === filters.module);
  if (filters.action) logs = logs.filter((l) => l.action === filters.action);
  if (filters.startDate) logs = logs.filter((l) => new Date(l.createdAt) >= new Date(filters.startDate));
  if (filters.endDate) logs = logs.filter((l) => new Date(l.createdAt) <= new Date(filters.endDate));
  return logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = { createAuditLog, auditMiddleware, getAuditLogs };
