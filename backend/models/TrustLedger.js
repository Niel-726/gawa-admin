class TrustLedgerModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.transactionId = data.transactionId || '';
    this.userId = data.userId || '';
    this.type = data.type || 'deposit';
    this.amount = data.amount || 0;
    this.balance = data.balance || 0;
    this.status = data.status || 'active';
    this.releaseDate = data.releaseDate || null;
    this.releaseCondition = data.releaseCondition || '';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}
module.exports = TrustLedgerModel;
