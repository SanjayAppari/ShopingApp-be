const express = require('express')
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ShhhhSecret";

// mongoose models
const User = require('../models/User')

// user signup route 
router.post('/signup', async (req, res) => {
    try {
        console.log("hi");
        const email = req.body.email;
        const result = await User.find({"email":email}).exec();
        if(result.length!=0){
            res.status(400).json({"Error":email+" already exists",result});
        }
        else{
            const {name,password,cpassword} = req.body;

            // hashing the password 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);

            // Creating a user 
            const user = new User({
                name,email,"password":hashedPassword
            });
            user.save();

            // Creating JWT Token
            const data={
                user:{
                    id:user.id
                }
            }
            const authToken = jwt.sign(data,JWT_SECRET);
            res.status(200).json({authToken,"Status":"Successfully signed up"});

        }
    }
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
})



// user login route
router.post('/login',async (req,res)=>{
    try {
        const {email,password} = req.body; 
        const user = await User.findOne({"email":email});
        if(!user){
            res.status(400).json({"Error":"Invalid Credentials"});
        }
        else{
            const validate = await bcrypt.compare(password,user.password);
            if(!validate){
                res.status(400).json({"Error":"Enter correct password"});
            }
            else{
                const data={
                    user:{
                        id:user.id
                    }
                }
                const authToken = jwt.sign(data,JWT_SECRET);
                res.status(200).json({authToken,"Status":"Successfully Logged In"});
            }
        }
    }
    catch (err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});



// get user cart 
router.get('/cart/:id',async(req,res)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        const cart = user.cart;
        res.status(200).json({"cart":cart});
    } catch (err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});


// add to cart
router.post('/addToCart/:id',async(req,res)=>{
    try {
        const {title,description,price,brand,category,gender}=req.body;
        const id = req.params.id;
        const user = await User.findById(id);
        user.cart.push({title,description,price,brand,category,gender});
        user.save();
        const cart = user.cart;
        res.status(200).json({"Cart":cart});
    }
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});

// delete item from cart 
router.delete('/deleteCartItem/:userId/:cartId',async(req,res)=>{
    try {
        const cartId=req.params.cartId;
        const userId=req.params.userId;
        const user = await User.findById(userId);
        user.cart.pull({_id:cartId});
        user.save();
        const cart = user.cart;
        res.status(200).json({"Cart":cart});
    }
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});




module.exports = router;