class UserService {
  constructor() {
    this.users = [];
  }

  getAll() { return this.users; }

  getById(id) { return this.users.find((u) => u.id === id) || null; }

  getByEmail(email) { return this.users.find((u) => u.email === email) || null; }

  create(userData) {
    const user = { id: `user-${Date.now()}`, ...userData, joinedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.users.push(user);
    return user;
  }

  update(id, updates) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.users[idx];
  }

  delete(id) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    this.users.splice(idx, 1);
    return true;
  }

  suspend(id) { return this.update(id, { status: 'suspended' }); }

  reinstate(id) { return this.update(id, { status: 'active' }); }

  addNote(id, note) {
    const user = this.getById(id);
    if (!user) return null;
    if (!user.notes) user.notes = [];
    user.notes.push({ ...note, createdAt: new Date().toISOString() });
    return user;
  }
}

module.exports = new UserService();
