const { generateId } = require('../utilities/helpers');

let feeConfigs = [
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
    updatedBy: 'System',
  },
];

function listConfigs(req, res) {
  res.json({ data: feeConfigs });
}

function getActiveConfig(req, res) {
  const active = feeConfigs.find((c) => c.isActive) || feeConfigs[0] || null;
  if (!active) return res.status(404).json({ error: 'No fee configuration found' });
  res.json({ data: active });
}

function createConfig(req, res) {
  const { name, proposalGpCost, platformFeePercent, gpConversionRate, listingFee, rentalCommission } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const cfg = {
    id: generateId('fee'),
    name,
    proposalGpCost: proposalGpCost ?? 50,
    platformFeePercent: platformFeePercent ?? 2.5,
    gpConversionRate: gpConversionRate ?? 1.0,
    listingFee: listingFee ?? 0,
    rentalCommission: rentalCommission ?? 10,
    isActive: feeConfigs.length === 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: req.user?.name || 'Admin',
  };
  feeConfigs.push(cfg);
  res.status(201).json({ data: cfg, message: 'Fee configuration created' });
}

function updateConfig(req, res) {
  const idx = feeConfigs.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Fee configuration not found' });
  const allowed = ['name', 'proposalGpCost', 'platformFeePercent', 'gpConversionRate', 'listingFee', 'rentalCommission'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) feeConfigs[idx][key] = req.body[key];
  }
  feeConfigs[idx].updatedAt = new Date().toISOString();
  feeConfigs[idx].updatedBy = req.user?.name || 'Admin';
  res.json({ data: feeConfigs[idx], message: 'Fee configuration updated' });
}

function deleteConfig(req, res) {
  const idx = feeConfigs.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Fee configuration not found' });
  if (feeConfigs[idx].isActive) return res.status(400).json({ error: 'Cannot delete active configuration. Set another as active first.' });
  feeConfigs.splice(idx, 1);
  res.json({ message: 'Fee configuration deleted' });
}

function setActiveConfig(req, res) {
  const idx = feeConfigs.findIndex((c) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Fee configuration not found' });
  for (const cfg of feeConfigs) cfg.isActive = false;
  feeConfigs[idx].isActive = true;
  feeConfigs[idx].updatedAt = new Date().toISOString();
  feeConfigs[idx].updatedBy = req.user?.name || 'Admin';
  res.json({ data: feeConfigs[idx], message: 'Active fee configuration updated' });
}

module.exports = { listConfigs, getActiveConfig, createConfig, updateConfig, deleteConfig, setActiveConfig };
