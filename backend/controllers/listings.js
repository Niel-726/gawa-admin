const listingsStore = [];

function listListings(req, res) {
  const { status, ownerId } = req.query;
  let filtered = [...listingsStore];
  if (status) filtered = filtered.filter((l) => l.status === status);
  if (ownerId) filtered = filtered.filter((l) => l.ownerId === ownerId);
  res.json({ data: filtered });
}

function getListingById(req, res) {
  const l = listingsStore.find((l) => l.id === req.params.id);
  if (!l) return res.status(404).json({ error: 'Listing not found' });
  res.json({ data: l });
}

function flagListing(req, res) {
  const l = listingsStore.find((l) => l.id === req.params.id);
  if (!l) return res.status(404).json({ error: 'Listing not found' });
  l.flags = (l.flags || 0) + 1;
  res.json({ data: l, message: 'Listing flagged' });
}

function removeListing(req, res) {
  const idx = listingsStore.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Listing not found' });
  listingsStore[idx].status = 'removed';
  res.json({ data: listingsStore[idx], message: 'Listing removed' });
}

module.exports = { listListings, getListingById, flagListing, removeListing };
