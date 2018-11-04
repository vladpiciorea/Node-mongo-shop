// Seteaza express
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// Conectare la mango atlas
mongoose.connect(
    'mongodb://vlad:' +
     process.env.MONGO_ATLAS_PW + 
     '@node-rest-shop-shard-00-00-amcix.mongodb.net:27017,node-rest-shop-shard-00-01-amcix.mongodb.net:27017,node-rest-shop-shard-00-02-amcix.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin&retryWrites=true',
     {
        useNewUrlParser: true
     });

mongoose.Promise = global.Promise;

//Arata in terminal ce requesturi se fac
app.use(morgan('dev'));
// Face public folderul uploads
app.use('/uploads',express.static('uploads'));
// Extrage json data si o face sa fie usor de folosit
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setare Cros origin Resource Sharing
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // Clientul trimite request sa vada la cu ce optiuni poate acces API
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Tote requesturile /products se duc in productRoutes
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);
app.use('/user', userRoutes);

// Daca nu se gaseste o ruta paseaza eroare
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status= 404;
    next(error);
});

// Trimite toate erorile din toata aplicatia sau 500 daca nu e definita eroarea
app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;