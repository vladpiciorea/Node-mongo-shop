// Model orders
const Order = require('../models/order');
//Model product
const Product = require('../models/product');
const mongoose = require('mongoose');

// Aduce toate comenzile pt produse 
exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

// Aduce o singura comanda dupa id
exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then(order => {
            if(!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

// Creaza comenzile pt produse
exports.orders_create = (req, res, next) => {

    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
        });
    });
}

// Sterge o comanda
exports.orders_delete = (req, res, next) => {
    Order.remove({ _id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}