// Seteaza routele pentru produse
const express = require('express');
const router = express.Router();
const multer = require('multer'); // To porcess file
const checkAuth = require('../middleware/check-auth'); //middleware de verificare pass

const productsController = require('../controllers/productsController');

// Validare poze produse
const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, './uploads');
    }, 
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (re, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
        // Stocheaza 
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fieldSize: 1024 * 1024 *5
    },
    fileFilter: fileFilter
});


// GET - /products
router.get('/', productsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), productsController.create_products);

router.get('/:productId', productsController.products_get_product);

router.patch('/:productId', checkAuth, productsController.product_update);

router.delete('/:productId', checkAuth, productsController.product_delete);

// Pentru ca router sa poata fi folosit in alte fisiere este exportat
module.exports = router