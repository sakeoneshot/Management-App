// controllers for admin functionality

const Employee = require("../models/employee");
const Company = require("../models/company");
const Request = require("../models/requestWork")

// controllers for get request with company -> fetch company data from mongodb server
exports.getCompanies = (req, res, next) => {
  Company.find()
    .select("-timesheetReceivedDate")
    .then((company) => {
      res.send(company);
    })
    .catch((err) => console.log(err));
};

// controllers for post request with refresh company tiemsheet status all to false
exports.refreshCompanyTimesheetStatus = (req, res, next) => {
  Company.find()
    .then((companies) => {
      companies.forEach((company) => {
        company.timesheetReceived = false;
        company.save();
      });
      
      //const result = companies.save();
      //console.log(result);
      const result = 'hello result'
      return result;
    })
    .then((result) =>
      res.send("Successfully reset timesheet status of all companies")
    )
    .catch((err) => res.send(err));
};

// controllers for post request with company data -> save company data to mongodb server
exports.updateCompanyInvoiceStatus = (req, res, next) => {
  const companyID = req.body._id;
  Company.findById(companyID)
    .then((prod) => {
      if (!prod) {
        console.log(prod);
        throw "No matching company";
      }
      const isTimesheetReceived = prod.timesheetReceived;

      prod.timesheetReceived = !prod.timesheetReceived;
      const arrIndex = prod.timesheetReceivedDate.find(
        (date) => date === req.body.timesheetReceivedDate
      );
      if (isTimesheetReceived && arrIndex) {
        prod.timesheetReceivedDate.splice(arrIndex, 1);
      } else if (!isTimesheetReceived && !arrIndex) {
        prod.timesheetReceivedDate.push(req.body.timesheetReceivedDate);
      }

      return prod.save();
    })
    .then((result) => res.send("Successfully updated company info"))
    .catch((err) => console.log(err));
};

// controllers for get request with employees -> fetch employee data from mongodb server
exports.getEmployees = (req, res, next) => {
  employee.find().then((employee) => {
    //res.render(/);cd
  });
};

// controllers for post request with employee data -> save employee data to mongodb server
exports.postAddEmployee = (req, res, next) => {
  const name = req.body.name;
  const address = {
    street: req.body.street,
    city: req.body.city,
    postalCode: req.body.postalCode,
  };
  const dateOfBirth = req.body.dob;
  const phone = req.body.phone;
  const ownCar = req.body.ownCar;
  const status = req.body.status;
  const note = req.body.note;
  const payTax = req.body.payTax;
  const sin = req.body.sin;

  const employee = new Employee({
    name,
    address,
    dateOfBirth,
    phone,
    ownCar,
    status,
    note,
    payTax,
    sin,
  });

  employee
    .save()
    .then((result) => {
      console.log("successfully created employee");
      res.send(result);
    })
    .catch((err) => console.log(err));
};


//handles work request 

exports.postWorkRequest = (req,res,next) => {
  

  const company = req.body.company;
  const type = req.body.type;
  const numberOfPeople = req.body.numberOfPeople;
  const date = req.body.date;

  const newRequest = new Request({
    company,
    type,
    numberOfPeople,
    date,
    isDone: false
  })

  newRequest.save().then(result => {console.log('successfully created request work'); res.send(result)}).catch(err => console.log(err))
}