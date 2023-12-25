const allRoles = {
  doctor: ['verify', 'productImage', 'getProduct'],
  lab: ['verify', 'updateProduct', 'deleteProduct', 'getProduct', 'productImage'],
  // admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
