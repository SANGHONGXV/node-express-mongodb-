const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DataSchema = new Schema({
    type:{
        type:String
    },
    title:{
        type:String
    },
    content:{
        type:String
    },
    author:{
        type:String 
    },
    authorId:{
        type:String
    },
    pdfURL:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = Data = mongoose.model("data",DataSchema);