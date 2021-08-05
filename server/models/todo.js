/*
 1. need mongoose
 2. create schema
 3. create model
 4. export
*/

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Todo = new Schema({
  todo: String,
  isDone: Boolean,
  createdAt: String,
  updatedAt: String
});

module.exports = mongoose.model("Todo", Todo);
