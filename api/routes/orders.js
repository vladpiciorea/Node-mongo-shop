// Seteaza routele pentru produse
// Get /products,Get /products/:id Post /products, Pach /products/:id, Delete /products/id
const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const ordersController = require('../controllers/ordersController');

// In app.js deoarece se foloseste /orders la get se pune doar /
// Routa finala este /orders
router.get('/', checkAuth, ordersController.orders_get_all);

router.post('/', checkAuth, ordersController.orders_create);

router.get('/:orderId', checkAuth, ordersController.orders_get_order);

router.delete('/:orderId', checkAuth, ordersController.orders_delete);

// Pentru ca router sa poata fi folosit in alte fisiere este exportat
module.exports = router;