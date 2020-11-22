const express = require('express');
const path = require('path');

const publicPath = path.join(__dirname,'../public');


var app = express();
app.use(express.static(publicPath));
app.get('/',(req,res)=>{
    res.send('heloo');
})

app.listen(8080,()=>{
    console.log(`Server is Running 8080`);
})