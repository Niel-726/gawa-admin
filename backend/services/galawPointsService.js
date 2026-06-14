class GalawPointsService {
  constructor() { this.packs = []; this.transactions = []; }
  getPacks() { return this.packs; }
  getPackById(id) { return this.packs.find((p) => p.id === id) || null; }
  createPack(data) { const p = { id: `pack-${Date.now()}`, ...data, isActive: true, createdAt: new Date().toISOString() }; this.packs.push(p); return p; }
  updatePack(id, updates) { const idx = this.packs.findIndex((p) => p.id === id); if (idx === -1) return null; this.packs[idx] = { ...this.packs[idx], ...updates }; return this.packs[idx]; }
  deletePack(id) { const idx = this.packs.findIndex((p) => p.id === id); if (idx === -1) return false; this.packs.splice(idx, 1); return true; }
  getTransactions() { return this.transactions; }
  issuePoints(userId, points, adminId, reason) { const t = { id: `gp-${Date.now()}`, userId, type: 'issued', points, adminId, description: reason || 'Manual issue', createdAt: new Date().toISOString() }; this.transactions.push(t); return t; }
  deductPoints(userId, points, adminId, reason) { const t = { id: `gp-${Date.now()}`, userId, type: 'deducted', points: -Math.abs(points), adminId, description: reason || 'Manual deduction', createdAt: new Date().toISOString() }; this.transactions.push(t); return t; }
}
module.exports = new GalawPointsService();
