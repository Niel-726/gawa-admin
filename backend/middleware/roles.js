const ROLES = {
  ADMIN: 'admin',
  CUSTOMER_SUPPORT: 'customer_support',
};

const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 100,
  [ROLES.CUSTOMER_SUPPORT]: 50,
};

const SUPPORT_RESTRICTED_ACTIONS = [
  'suspendUser',
  'reinstateUser',
  'deleteAccount',
  'revokeVerification',
  'removeJob',
  'removeListing',
  'issuePoints',
  'deductPoints',
  'managePacks',
  'finalizeAppeal',
  'exportIncidents',
  'viewFinance',
  'viewAuditLogs',
];

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

function restrictSupportActions(action) {
  return (req, res, next) => {
    if (req.user?.role === ROLES.CUSTOMER_SUPPORT && SUPPORT_RESTRICTED_ACTIONS.includes(action)) {
      return res.status(403).json({ error: 'Customer support cannot perform this action' });
    }
    next();
  };
}

function getRoleLevel(role) {
  return ROLE_HIERARCHY[role] || 0;
}

function hasMinRole(userRole, minRole) {
  return getRoleLevel(userRole) >= getRoleLevel(minRole);
}

module.exports = { ROLES, authorize, restrictSupportActions, getRoleLevel, hasMinRole };
