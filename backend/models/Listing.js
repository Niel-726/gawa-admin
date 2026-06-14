class ListingModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.category = data.category || '';
    this.ownerId = data.ownerId || '';
    this.dailyRate = data.dailyRate || 0;
    this.weeklyRate = data.weeklyRate || 0;
    this.status = data.status || 'draft';
    this.location = data.location || '';
    this.description = data.description || '';
    this.images = data.images || [];
    this.rentalCount = data.rentalCount || 0;
    this.flags = data.flags || 0;
    this.notes = data.notes || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

module.exports = ListingModel;
