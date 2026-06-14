class JobService {
  constructor() { this.jobs = []; }
  getAll() { return this.jobs; }
  getById(id) { return this.jobs.find((j) => j.id === id) || null; }
  create(data) { const j = { id: `job-${Date.now()}`, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; this.jobs.push(j); return j; }
  update(id, updates) { const idx = this.jobs.findIndex((j) => j.id === id); if (idx === -1) return null; this.jobs[idx] = { ...this.jobs[idx], ...updates, updatedAt: new Date().toISOString() }; return this.jobs[idx]; }
  remove(id) { return this.update(id, { status: 'removed' }); }
}
module.exports = new JobService();
