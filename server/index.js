const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors")
const adminController = require("./controllers/admin")

const app = express();

app.use(cors())
//app.use(express.static(path.resolve(__dirname, "../front-end/build")));

app.use(express.json());
//app.use(express.)

// company get route

app.get("/company",adminController.getCompanies)


// company post route
app.post("/company/updateInvoice",adminController.updateCompanyInvoiceStatus)

app.post("/company/refreshInvoice",adminController.refreshCompanyTimesheetStatus)

// employee post route 
app.post("/employee", adminController.postAddEmployee);

// work request route

//get
app.get("/workRequests",adminController.getWorkRequests)
//post
app.post("/workRequest",adminController.postWorkRequest);
//delete
app.delete("/workRequest/:id",adminController.deleteWorkRequests)
//update
app.put("/workRequest",adminController.updateWorkRequests)

app.get("*", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "../front-end/build", "index.html"));
});

mongoose
  .connect("mongodb://localhost:27017/test", { useNewUrlParser: true, useUnifiedTopology: true})
  .then((result) => {
    app.listen(5000, () => console.log("server is running"));
  })
  .catch((err) => console.log(err));
