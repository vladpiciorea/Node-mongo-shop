// Seteaza routele pentru autentificare
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth'); //middleware de verificare pass

const userController = require('../controllers/userController')

router.post('/login',  userController.user_login );

router.post('/signup', userController.user_signup );

router.delete('/:userId', checkAuth, userController.user_delete );

module.exports = router;