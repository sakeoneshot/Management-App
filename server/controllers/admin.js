// controllers for admin functionality

const Employee = require("../models/employee");
const Company = require("../models/company");
const WorkRequest = require("../models/requestWork");
const Todo = require("../models/todo");

//Companies

// controllers for get request with company -> fetch company data from mongodb server
exports.getCompanies = (req, res, next) => {
  Company.find()
    .select("-timesheetReceivedDate")
    .then((company) => {
      res.send(company);
    })
    .catch((err) => console.log(err));
};

// controllers for post company with company data
exports.postCompanies = (req, res, next) => {
  const newCompany = new Company({
    name: req.body.name,
  });

  newCompany
    .save()
    .then((result) => {
      console.log("successfully created company");
      res.send(result);
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
      const result = "hello result";
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
  Employee.find().then((employee) => {
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

//post
exports.postWorkRequest = (req, res, next) => {
  const company = req.body.company;
  const type = req.body.type;
  const numberOfPeople = req.body.numberOfPeople;
  const date = req.body.date;

  const newRequest = new WorkRequest({
    company,
    type,
    numberOfPeople,
    date,
    isDone: false,
  });

  newRequest
    .save()
    .then((result) => {
      console.log("successfully created request work");
      res.send(result);
    })
    .catch((err) => console.log(err));
};

//get

exports.getWorkRequests = (req, res, next) => {
  WorkRequest.find()
    .then((workRequests) => res.send(workRequests))
    .catch((err) => console.log(err));
};

//delete

exports.deleteWorkRequests = (req, res, next) => {
  console.log(req.params);
  WorkRequest.findByIdAndDelete(req.params.id, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully deleted workrequest");
      res.send(docs);
    }
  });
};

// put

exports.updateWorkRequests = (req, res, next) => {
  WorkRequest.findById(req.body._id)
    .then((request) => {
      const requestArr = req.body.recruitedPeople.split(" ");
      request.recruitedPeople = requestArr;
      return request.save();
    })
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
};

//Todo
// get Todo
exports.getTodo = (req, res, next) => {
  /*
    1. import todo model
    2. fetch todo from database
    3. if successful, send fetched todo data 
    3-2. if failed, log error
   */

  Todo.find()
    .then((todo) => {
      res.send(todo);
    })
    .catch((err) => console.log(err));
};

// post Todo
exports.postTodo = (req, res, next) => {
  /* 
     1. receive post todo data
     2. validatae todo 
     3-1. if valid, save todo to database
     3-1-1. if successful, send successful reponse
     3-1-2. if failed, log error
     3-2. if not valid, send appropriate response
    */
  const { todo, createdAt } = req.body;
  const createTodo = {
    createdAt,
    todo,
    isDone: false,
  };
  const newTodo = new Todo(createTodo);
  newTodo
    .save()
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
};
// delete Todo
exports.deleteTodo = (req, res, next) => {
  /*
     1. retrieve todo id from params
     2. delete todo by id
     3. if successful, respond with success
     3-1. if failed, response with error
    */

  const todoIdForDeletion = req.params.id;
  Todo.findByIdAndDelete(todoIdForDeletion, (err, docs) => {
    if (err) {
      console.log("error occured");
      res.send(err);
    } else {
      console.log("successfully deleted todo with id " + todoIdForDeletion);
      res.send(docs);
    }
  });
};

// update todo
exports.updateTodo = (req, res, next) => {
  /*
   1. get new todo data from request body
   2. find todo by id and edit data
  */

  const { todo, updatedAt, isDone, _id } = req.body;
  Todo.findById(_id)
    .then((todoToUpdate) => {
      todoToUpdate.todo = todo;
      todoToUpdate.updatedAt = updatedAt;
      if (isDone) {
        todoToUpdate.isDone = isDone;
      }

      return todoToUpdate.save();
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
};
