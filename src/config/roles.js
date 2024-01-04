const allRoles = {
  doctor: ['verify', 'productImage', 'getProduct', 'getProducts', 'createProduct', 'getLabs', 'getOrders', 'createOrder'],
  lab: [
    'verify',
    'updateProduct',
    'deleteProduct',
    'getProducts',
    'getProduct',
    'productImage',
    'createProduct',
    'getOrders',
    'changeOrderStatus',
  ],
  // admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
