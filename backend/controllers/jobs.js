const jobsStore = [];

function listJobs(req, res) {
  const { status, type, clientId } = req.query;
  let filtered = [...jobsStore];
  if (status) filtered = filtered.filter((j) => j.status === status);
  if (type) filtered = filtered.filter((j) => j.type === type);
  if (clientId) filtered = filtered.filter((j) => j.clientId === clientId);
  res.json({ data: filtered });
}

function getJobById(req, res) {
  const job = jobsStore.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json({ data: job });
}

function flagJob(req, res) {
  const job = jobsStore.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  job.flags = (job.flags || 0) + 1;
  res.json({ data: job, message: 'Job flagged' });
}

function removeJob(req, res) {
  const idx = jobsStore.findIndex((j) => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Job not found' });
  jobsStore[idx].status = 'removed';
  res.json({ data: jobsStore[idx], message: 'Job removed' });
}

module.exports = { listJobs, getJobById, flagJob, removeJob };
