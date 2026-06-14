class RentalModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.listingId = data.listingId || '';
    this.renterId = data.renterId || '';
    this.ownerId = data.ownerId || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.totalAmount = data.totalAmount || 0;
    this.status = data.status || 'pending';
    this.depositAmount = data.depositAmount || 0;
    this.depositStatus = data.depositStatus || 'held';
    this.damageReport = data.damageReport || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
module.exports = RentalModel;
