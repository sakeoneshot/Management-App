const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: String,
  timesheetReceived: Boolean,
  timesheetReceivedDate: [String],
  requestHistory: [String]
});

module.exports = mongoose.model("Company", CompanySchema);
