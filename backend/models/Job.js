class JobModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.type = data.type || 'task-based';
    this.description = data.description || '';
    this.status = data.status || 'active';
    this.clientId = data.clientId || '';
    this.budget = data.budget || 0;
    this.location = data.location || '';
    this.category = data.category || '';
    this.skills = data.skills || [];
    this.deadline = data.deadline || null;
    this.proposalCount = data.proposalCount || 0;
    this.acceptedProposalId = data.acceptedProposalId || null;
    this.flags = data.flags || 0;
    this.notes = data.notes || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

module.exports = JobModel;
