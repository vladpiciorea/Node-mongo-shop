// Verifica token 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        // Tokenul se extrage din header 
        const token  = req.headers.authorization.split(" ")[1];
        const decoder = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoder;
        next();
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    

}