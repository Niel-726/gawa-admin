class DisputeService {
  constructor() { this.disputes = []; }
  getAll() { return this.disputes; }
  getById(id) { return this.disputes.find((d) => d.id === id) || null; }
  create(data) { const d = { id: `disp-${Date.now()}`, ...data, timeline: [{ date: new Date().toISOString(), title: 'Dispute created', actor: data.reporterName || 'System' }], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; this.disputes.push(d); return d; }
  update(id, updates) { const idx = this.disputes.findIndex((d) => d.id === id); if (idx === -1) return null; this.disputes[idx] = { ...this.disputes[idx], ...updates, updatedAt: new Date().toISOString() }; if (updates.status === 'resolved' || updates.status === 'dismissed') this.disputes[idx].resolvedAt = new Date().toISOString(); return this.disputes[idx]; }
}
module.exports = new DisputeService();
