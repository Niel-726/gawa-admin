const incidentsStore = [];

function listIncidents(req, res) {
  const { agentId, module, action, startDate, endDate } = req.query;
  let filtered = [...incidentsStore];
  if (agentId) filtered = filtered.filter((i) => i.agentId === agentId);
  if (module) filtered = filtered.filter((i) => i.module === module);
  if (action) filtered = filtered.filter((i) => i.action === action);
  if (startDate) filtered = filtered.filter((i) => new Date(i.createdAt) >= new Date(startDate));
  if (endDate) filtered = filtered.filter((i) => new Date(i.createdAt) <= new Date(endDate));
  res.json({ data: filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
}

function exportIncidents(req, res) {
  const csvHeader = 'ID,Agent,Action,Module,Description,Created\n';
  const csvRows = incidentsStore.map((i) => `${i.id},${i.agentName},${i.action},${i.module},"${i.description}",${i.createdAt}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="incident-logs.csv"');
  res.send(csvHeader + csvRows);
}

module.exports = { listIncidents, exportIncidents };
