const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TypeSchema = new Schema({
    name:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = Type = mongoose.model("type",TypeSchema);