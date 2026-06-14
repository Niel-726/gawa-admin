const { generateId } = require('../utilities/helpers');
const UserModel = require('../models/User');

const usersStore = [];

function listUsers(req, res) {
  const { role, status, verified, search, page = 1, limit = 20 } = req.query;
  let filtered = [...usersStore];
  if (role) filtered = filtered.filter((u) => u.role === role);
  if (status) filtered = filtered.filter((u) => u.status === status);
  if (verified !== undefined) filtered = filtered.filter((u) => u.verified === (verified === 'true'));
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }
  const start = (page - 1) * limit;
  const paged = filtered.slice(start, start + limit);
  res.json({
    data: paged.map((u) => u.toPublic()),
    pagination: { total: filtered.length, page: +page, limit: +limit, totalPages: Math.ceil(filtered.length / +limit) },
  });
}

function getUserById(req, res) {
  const user = usersStore.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user.toPublic() });
}

function suspendUser(req, res) {
  const user = usersStore.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = 'suspended';
  user.updatedAt = new Date().toISOString();
  res.json({ data: user.toPublic(), message: 'User suspended' });
}

function reinstateUser(req, res) {
  const user = usersStore.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = 'active';
  user.updatedAt = new Date().toISOString();
  res.json({ data: user.toPublic(), message: 'User reinstated' });
}

function deleteUser(req, res) {
  const idx = usersStore.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  usersStore.splice(idx, 1);
  res.json({ message: 'User deleted' });
}

function inviteUser(req, res) {
  const { name, email, role } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' });
  }
  if (!['admin', 'customer_support'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin or customer_support' });
  }
  const existing = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'User with this email already exists' });
  const newUser = new UserModel({
    id: generateId('user'),
    name,
    email,
    role,
    status: 'active',
    verified: true,
  });
  usersStore.push(newUser);
  res.status(201).json({ data: newUser.toPublic(), message: 'User invited successfully' });
}

module.exports = { listUsers, getUserById, suspendUser, reinstateUser, deleteUser, inviteUser };
