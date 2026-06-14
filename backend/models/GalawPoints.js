class GalawPointsPackModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.points = data.points || 0;
    this.price = data.price || 0;
    this.description = data.description || '';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

class GalawPointsTransactionModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.userId = data.userId || '';
    this.type = data.type || 'purchase';
    this.points = data.points || 0;
    this.amount = data.amount || 0;
    this.packId = data.packId || null;
    this.jobId = data.jobId || null;
    this.adminId = data.adminId || null;
    this.description = data.description || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

module.exports = { GalawPointsPackModel, GalawPointsTransactionModel };
