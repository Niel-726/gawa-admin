class VerificationService {
  constructor() { this.verifications = []; }
  getAll() { return this.verifications; }
  getById(id) { return this.verifications.find((v) => v.id === id) || null; }
  create(data) { const v = { id: `ver-${Date.now()}`, ...data, submittedAt: new Date().toISOString() }; this.verifications.push(v); return v; }
  update(id, updates) { const idx = this.verifications.findIndex((v) => v.id === id); if (idx === -1) return null; this.verifications[idx] = { ...this.verifications[idx], ...updates }; return this.verifications[idx]; }
}
module.exports = new VerificationService();
