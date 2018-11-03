// Seteaza routele pentru produse
// Get /products,Get /products/:id Post /products, Pach /products/:id, Delete /products/id
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

// In app.js deoarece se foloseste /products la get se pune doar /
// Routa finala este /products
router.get('/', (req, res, next) => {
    Product.find()
        .exec()
        .then(docs => {
            console.log(docs);
            // if(docs.length >= 0) {
                res.status(200).json(docs);
            // } else {
            //     res.status(404).json({
            //         message: 'No entry found'
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Heandling Post requests to /products',
                coreatedProduct: product
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            // Verific daca exita id adica are formatul potrivit
            // Daca are formatul trimie 200 daca nu are format 404 not found
            if(doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID'});
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
       updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Pentru ca router sa poata fi folosit in alte fisiere este exportat
module.exports = router