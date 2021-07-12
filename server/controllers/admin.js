// controllers for admin functionality

const Employee = require("../models/employee");


// controllers for get request with employees -> fetch employee data from mongodb server
exports.getEmployees = (req, res, next) => {
  employee.find().then(employee => {
    //res.render(/);
  })
}

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
        console.log('successfully created employee')
        res.send(result)
    })
    .catch((err) => console.log(err));
};
