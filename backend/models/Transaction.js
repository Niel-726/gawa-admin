class TransactionModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || '';
    this.amount = data.amount || 0;
    this.status = data.status || 'pending';
    this.paymentMethod = data.paymentMethod || '';
    this.reference = data.reference || '';
    this.userId = data.userId || '';
    this.relatedId = data.relatedId || null;
    this.relatedType = data.relatedType || null;
    this.description = data.description || '';
    this.fee = data.fee || 0;
    this.netAmount = data.netAmount || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
module.exports = TransactionModel;
