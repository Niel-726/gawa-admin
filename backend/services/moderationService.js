class ModerationService {
  constructor() { this.items = []; }
  getAll() { return this.items; }
  getById(id) { return this.items.find((m) => m.id === id) || null; }
  add(item) { this.items.push(item); return item; }
  moderate(id, decision, notes) {
    const idx = this.items.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.items[idx].decision = decision;
    this.items[idx].decisionNotes = notes || '';
    this.items[idx].resolvedAt = new Date().toISOString();
    return this.items[idx];
  }
}
module.exports = new ModerationService();
