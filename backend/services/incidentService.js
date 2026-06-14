class IncidentService {
  constructor() { this.incidents = []; }
  getAll() { return this.incidents; }
  getById(id) { return this.incidents.find((i) => i.id === id) || null; }
  log(data) { const i = { id: `inc-${Date.now()}`, ...data, createdAt: new Date().toISOString() }; this.incidents.push(i); return i; }
}
module.exports = new IncidentService();
