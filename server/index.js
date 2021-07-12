const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors")
const adminController = require("./controllers/admin")

const app = express();

app.use(cors())
app.use(express.static(path.resolve(__dirname, "../front-end/build")));

app.use(express.json());
//app.use(express.)


// employee post route 
app.post("/employee", adminController.postAddEmployee);

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "../front-end/build", "index.html"));
});

mongoose
  .connect("mongodb://localhost:27017/test")
  .then((result) => {
    app.listen(5000, () => console.log("server is running"));
  })
  .catch((err) => console.log(err));
