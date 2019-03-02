const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DataSchema = new Schema({
    // 文章类型
    type:{
        type:String
    },
    // 文章题目
    title:{
        type:String
    },
    // 封面url
    pictureUrl:{
        type:String
    },
    // 内容
    content:{
        type:String
    },
    // 发布者name
    author:{
        type:String 
    },
    // 发布者id
    authorId:{
        type:String
    },
    // 图片URL
    imgURL:{
        type:String
    },
    // pdfURL
    pdfURL:{
        type:String
    },
    // 时间
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = Data = mongoose.model("data",DataSchema);