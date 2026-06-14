const { v4: uuidv4 } = require('uuid');

function generateId(prefix = '') {
  return prefix ? `${prefix}-${uuidv4().slice(0, 8)}` : uuidv4().slice(0, 12);
}

function sanitizeString(str) {
  if (!str) return '';
  return str.trim().replace(/<[^>]*>/g, '');
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

function calculatePagination(page = 1, limit = 20) {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  return { page: p, limit: l, offset: (p - 1) * l };
}

function paginatedResponse(data, total, page, limit) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = { generateId, sanitizeString, formatCurrency, calculatePagination, paginatedResponse };
