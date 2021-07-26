const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const workRequest = new Schema({
    company: String,
    type: String,
    numberOfPeople: String,
    date: String,
    recruitedPeople: [String],
    isDone: Boolean
})

module.exports = mongoose.model('WorkRequest',workRequest)