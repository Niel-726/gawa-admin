const RentalModel = require('../models/Rental');
const rentalsStore = [];

function listRentals(req, res) {
  const { status, depositStatus, renterId, ownerId } = req.query;
  let filtered = [...rentalsStore];
  if (status) filtered = filtered.filter((r) => r.status === status);
  if (depositStatus) filtered = filtered.filter((r) => r.depositStatus === depositStatus);
  if (renterId) filtered = filtered.filter((r) => r.renterId === renterId);
  if (ownerId) filtered = filtered.filter((r) => r.ownerId === ownerId);
  res.json({ data: filtered });
}

function getRentalById(req, res) {
  const rental = rentalsStore.find((r) => r.id === req.params.id);
  if (!rental) return res.status(404).json({ error: 'Rental not found' });
  res.json({ data: rental });
}

function releaseDeposit(req, res) {
  const rental = rentalsStore.find((r) => r.id === req.params.id);
  if (!rental) return res.status(404).json({ error: 'Rental not found' });
  if (rental.depositStatus !== 'held') return res.status(400).json({ error: 'Deposit is not currently held' });
  rental.depositStatus = 'returned';
  res.json({ data: rental, message: 'Deposit released' });
}

function deductDeposit(req, res) {
  const rental = rentalsStore.find((r) => r.id === req.params.id);
  if (!rental) return res.status(404).json({ error: 'Rental not found' });
  if (rental.depositStatus !== 'held') return res.status(400).json({ error: 'Deposit is not currently held' });
  const { damageReport } = req.body;
  rental.depositStatus = 'deducted';
  if (damageReport) rental.damageReport = damageReport;
  res.json({ data: rental, message: 'Deposit deducted' });
}

module.exports = { listRentals, getRentalById, releaseDeposit, deductDeposit };
