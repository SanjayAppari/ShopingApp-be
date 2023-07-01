const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

// clothing mongoose model 
const Clothing = require('../models/Clothing');


const multer = require("multer");
// add clothing route 
router.post('/addClothing',async (req,res)=>{
    try {
        const {title,description,price,brand,category,gender,image} = req.body;
        const clothing = new Clothing({
            title,description,price,brand,category,gender,image     
        });
        clothing.save();
        res.status(200).json({"Emaindhi":clothing});  
    }catch (err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});

// get all blogs 
router.get('/getClothings',async(req,res)=>{
    try {
        const items=await Clothing.find();
        res.status(200).json(items);
    }catch (err){
        res.status(400).json({"status":"Bad Request","error":err.message});
    }
});

// get all blogs by category
router.get('/getClothings/:category',async(req,res)=>{
    try {
        const category = req.params.category;
        const items = await Clothing.find({"category":category});
        res.status(200).json(items);
    }
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});   
    }
});

// get all blogs by gender
router.get('/getClothingsgender/:gender',async(req,res)=>{
    try {
        const gender = req.params.gender;
        const items = await Clothing.find({"gender":gender});
        res.status(200).json(items);
    }
    catch(err){
        res.status(400).json({"status":"Bad Request","error":err.message});   
    }
});



module.exports = router;
