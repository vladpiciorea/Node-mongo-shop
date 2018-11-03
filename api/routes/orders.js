// Seteaza routele pentru produse
// Get /products,Get /products/:id Post /products, Pach /products/:id, Delete /products/id
const express = require('express');
const router = express.Router();

// In app.js deoarece se foloseste /orders la get se pune doar /
// Routa finala este /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Orders were created',
        order: order
    });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Orders deteils',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Orders deleted',
        orderId: req.params.orderId
    });
});

// Pentru ca router sa poata fi folosit in alte fisiere este exportat
module.exports = router