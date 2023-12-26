const allRoles = {
  doctor: ['verify', 'productImage', 'getProduct', 'getProducts'],
  lab: ['verify', 'updateProduct', 'deleteProduct', 'getProducts', 'getProduct', 'productImage', 'createProducts'],
  // admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
