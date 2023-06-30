const mongoose =require('mongoose');
const {Schema} = mongoose;

const ClothingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true 
    },
    brand:{
        type:String,
        required:true  
    },
    category:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Clothing',ClothingSchema);