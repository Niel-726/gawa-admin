class TransactionService {
  constructor() { this.transactions = []; }
  getAll() { return this.transactions; }
  getById(id) { return this.transactions.find((t) => t.id === id) || null; }
  create(data) { const t = { id: `txn-${Date.now()}`, ...data, createdAt: new Date().toISOString() }; this.transactions.push(t); return t; }
  update(id, updates) { const idx = this.transactions.findIndex((t) => t.id === id); if (idx === -1) return null; this.transactions[idx] = { ...this.transactions[idx], ...updates }; return this.transactions[idx]; }
}
module.exports = new TransactionService();
