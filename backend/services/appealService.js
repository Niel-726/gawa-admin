class AppealService {
  constructor() { this.appeals = []; }
  getAll() { return this.appeals; }
  getById(id) { return this.appeals.find((a) => a.id === id) || null; }
  create(data) { const a = { id: `app-${Date.now()}`, ...data, timeline: [{ date: new Date().toISOString(), title: 'Appeal filed', actor: data.userName || 'User' }], filedAt: new Date().toISOString() }; this.appeals.push(a); return a; }
  update(id, updates) { const idx = this.appeals.findIndex((a) => a.id === id); if (idx === -1) return null; this.appeals[idx] = { ...this.appeals[idx], ...updates }; return this.appeals[idx]; }
  forward(id, recommendation, notes) { return this.update(id, { status: 'forwarded', supportRecommendation: recommendation, supportNotes: notes }); }
  decide(id, decision, notes) { return this.update(id, { status: 'decided', decision, decisionNotes: notes, decidedAt: new Date().toISOString() }); }
}
module.exports = new AppealService();
