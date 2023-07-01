const express = require('express')
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "ShhhhSecret";

// mongoose models
const User = require('../models/User');
const fetchUser = require('../middleware/fetchUser');

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
router.get('/cart', fetchUser, async(req,res)=>{
    try {
        const id = req.user.id;
        const user = await User.findById(id);
        const cart = user.cart;
        res.status(200).json(cart);
    } catch (err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});


// add to cart
router.post('/addToCart',fetchUser,async(req,res)=>{
    try {
        const {title,description,price,brand,category,gender,image}=req.body;
        const id = req.user.id;
        const user = await User.findById(id);
        let cart = user.cart;
        let c=0;
        let dId,q;
        cart.map((ele)=>{
            if(ele.title===title && ele.description===description){
                c+=1; dId=ele._id.toString();q=ele.quantity;
            }
            if(c>0) return;
        })
        console.log("ji")
        console.log(c,dId,q);
        if(c>0)
        {
            user.cart = cart.map((ele)=>{
                if(ele.title===title && ele.description===description){
                    ele.quantity+=1;
                    console.log(ele.quantity);
                }
                return ele;
            });
            console.log('lopala')
        }
        else{
            user.cart.push({title,description,price,brand,category,gender,totalPrice:price,image});
        }
        user.save(); 
        cart = user.cart;
        res.status(200).json(cart);
    } 
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});

// delete item from cart 
router.delete('/deleteCartItem/:cartId',fetchUser,async(req,res)=>{
    try {
        const cartId=req.params.cartId;
        const userId=req.user.id;
        const user = await User.findById(userId);
        const resp = user.cart;
        
        let c=0;
        resp.map((ele)=>{
            if(ele._id.toString()===cartId){
                c=ele.quantity;
            }
        });
        console.log(c)
        if(c==1) user.cart.pull({_id:cartId});
        else{
            user.cart = resp.map((ele)=>{
                if(ele._id.toString()===cartId){
                    console.log(ele.quantity)
                    ele.quantity-=1;
                    console.log(ele.quantity)
                }
                return ele;
            })
        }
        console.log(user.cart)
        user.save();
        const cart = user.cart;
        res.status(200).json(cart);
    }   
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});




module.exports = router;