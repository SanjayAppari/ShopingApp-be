const express = require('express');
const router = express.Router();

// clothing mongoose model 
const Clothing = require('../models/Clothing');


// add clothing route 
router.post('/addClothing',async (req,res)=>{
    try {
        const {title,description,price,brand,category,gender} = req.body;
        const clothing = new Clothing({
            title,description,price,brand,category,gender
        });
        clothing.save();
        res.status(200).json({"Item":clothing});
    }catch (err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});

// get all blogs 
router.get('/getClothings',async(req,res)=>{
    try {
        const items=await Clothing.find();
        res.status(200).json({"All Items ": items});
    }catch (err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});

// get all blogs by category
router.get('/getClothings/:category',async(req,res)=>{
    try {
        const category = req.params.category;
        const items = await Clothing.find({"category":category});
        res.status(200).json({"All Items ": items});
    }
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});   
    }
});



module.exports = router;
