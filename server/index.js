const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.resolve(__dirname,'../front-end/build')))

app.use(express.json());
//app.use(express.)

app.post('/user', (req,res,next) => {

})

app.get('*',(req,res,next) => {
    res.sendFile(path.resolve(__dirname, '../front-end/build' , 'index.html'))
})

app.listen(3000,()=> console.log("server is running"))