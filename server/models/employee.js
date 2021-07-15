//employee model using mongodb -> mongoose


const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workHistory = new Schema({
  date: Date,
  company: mongoose.ObjectId,
});

const employeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      reqruired: true,
    },
    city: {
      type: String,
      reqruired: true,
    },
    postalCode: {
      type: String,
      reqruired: true,
    },
  },
  dateOfBirth: String,
  phone: String,
  ownCar: String,
  status: String,
  note: String,
  payTax: String,
  sin: String,
  history: [workHistory],
});

module.exports = mongoose.model('Employee', employeeSchema)