const express = require('express');
const connectToMongo = require('./db');

app = express();

connectToMongo();
app.use(express.json()); // allows to access the req body by the route - (body parser)

// routes
app.use('/shoping-redux/auth',require('./routes/auth.js'));
app.use('/shoping-redux/clothing',require('./routes/clothing.js'));



app.listen(5000,(req,res)=>{
    console.log('server is running at port 3000');
});
