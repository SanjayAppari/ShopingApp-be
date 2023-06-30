const mongoose = require('mongoose');

const connectToMongo = async ()=>{
    mongoose.connect('mongodb://0.0.0.0:27017/shoponline',await console.log('Connected to Mongodb'));
}

module.exports = connectToMongo;
