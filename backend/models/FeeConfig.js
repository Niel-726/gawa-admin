class FeeConfigModel {
  constructor(data = {}) {
    this.proposalGpCost = data.proposalGpCost || 50;
    this.platformFeePercent = data.platformFeePercent || 2.5;
    this.gpConversionRate = data.gpConversionRate || 1.0;
    this.listingFee = data.listingFee || 0;
    this.rentalCommission = data.rentalCommission || 10;
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.updatedBy = data.updatedBy || 'System';
  }
}

module.exports = FeeConfigModel;
