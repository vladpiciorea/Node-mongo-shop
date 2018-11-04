// Seteaza routele pentru autentificare
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Pentru a cripta parola
const bcrypt = require('bcrypt');
const saltRounds = 10;
// Pentru creare token
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length < 1){
               return res.status(401).json({
                    meassage: 'Auth failed'
               });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                // res == true
                if(err) {
                    return res.status(401).json({
                        meassage: 'Auth failed'
                   });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        }, process.env.JWT_KEY,{
                            expiresIn: "1h"
                        });

                    return res.status(200).json({
                        meassage: 'Auth sucesful',
                        token: token
                   });
                }
                return res.status(401).json({
                    meassage: 'Auth failed'
               });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

});

router.post('/signup', (req, res, next) => {
    // Verifica daca uitilizatorul este in Db
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(422).json({
                    meassage: 'Mail exist'
                })
            } else {
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        if(err) {
                            return res.status(500).json({
                                error: err
                            });
            
                        } else {
                        // Stocare password email DB.
                            const user = new User ({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            });
                            user.save()
                                .then(result => {
                                    console.log(result)
                                    res.status(201).json({
                                        meassage: 'User created'
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                })
                            }
                    });
                });
            }
        });
});

router.delete('/:userId', (req, res, next) => {
    User.remove({ _id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;