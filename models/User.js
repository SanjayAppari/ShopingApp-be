const mongoose =require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true 
    },
    cart:[
        {
            title:String,
            description:String,
            price:Number,
            brand:String,
            category:String,
            gender:String,  
        }
    ]
});

module.exports = mongoose.model('Users',UserSchema);