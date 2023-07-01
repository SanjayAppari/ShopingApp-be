var jwt = require('jsonwebtoken');
const JWT_SECRET = "ShhhhSecret";

const fetchUser = (req,res,next)=>{
    try {
        const token = req.header('auth-token');
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
    } catch(err){
        res.status(400).json({"error":"bad request"});
    }
    next();
}

module.exports = fetchUser;