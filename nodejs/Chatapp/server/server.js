const express = require('express');
const path = require('path');

const publicPath = path.join(__dirname,'../public');
const PORT = process.env.PORT || 8080;

var app = express();
app.use(express.static(publicPath));
app.get('/',(req,res)=>{
    res.send('heloo');
})

app.listen(PORT,()=>{
    console.log(`Server is Running  ${PORT}`);
})