const allRoles = {
  doctor: ['verify', 'productImage'],
  lab: ['verify'],
  // admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
