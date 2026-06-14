const feeConfigs = [
  {
    id: 'fee-default',
    name: 'Default Configuration',
    proposalGpCost: 50,
    platformFeePercent: 2.5,
    gpConversionRate: 1.0,
    listingFee: 0,
    rentalCommission: 10,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    updatedBy: 'Miguel Santos',
  },
  {
    id: 'fee-promo',
    name: 'Promo Rates',
    proposalGpCost: 25,
    platformFeePercent: 1.5,
    gpConversionRate: 1.0,
    listingFee: 0,
    rentalCommission: 5,
    isActive: false,
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
    updatedBy: 'Miguel Santos',
  },
];

export default feeConfigs;
