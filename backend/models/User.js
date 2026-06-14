class UserModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.passwordHash = data.passwordHash || '';
    this.role = data.role || 'client';
    this.status = data.status || 'active';
    this.verified = data.verified || false;
    this.location = data.location || '';
    this.skills = data.skills || [];
    this.rating = data.rating || 0;
    this.totalJobs = data.totalJobs || 0;
    this.galawPoints = data.galawPoints || 0;
    this.flags = data.flags || 0;
    this.notes = data.notes || [];
    this.joinedAt = data.joinedAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toPublic() {
    const { passwordHash, ...publicData } = this;
    return publicData;
  }

  isActive() {
    return this.status === 'active';
  }

  isSuspended() {
    return this.status === 'suspended';
  }

  canPerformAction(action) {
    const rolePermissions = {
      admin: ['*'],
      customer_support: ['read', 'update_verification', 'update_dispute', 'moderate', 'forward_appeal', 'message'],
      client: ['create_job', 'message', 'review'],
      talent: ['apply_job', 'message'],
      contractor: ['apply_project', 'message'],
      equipment_owner: ['create_listing', 'message'],
    };
    const perms = rolePermissions[this.role] || [];
    return perms.includes('*') || perms.includes(action);
  }
}

module.exports = UserModel;
