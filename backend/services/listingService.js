class ListingService {
  constructor() { this.listings = []; }
  getAll() { return this.listings; }
  getById(id) { return this.listings.find((l) => l.id === id) || null; }
  create(data) { const l = { id: `list-${Date.now()}`, ...data, createdAt: new Date().toISOString() }; this.listings.push(l); return l; }
  update(id, updates) { const idx = this.listings.findIndex((l) => l.id === id); if (idx === -1) return null; this.listings[idx] = { ...this.listings[idx], ...updates }; return this.listings[idx]; }
  remove(id) { return this.update(id, { status: 'removed' }); }
}
module.exports = new ListingService();
