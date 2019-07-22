const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const applteSchema = new Schema({
    // 类型
    typeid:{
        type:String
    },
    // 名字
    name:{
        type:String
    },
    // 介绍
    introduce:{
        type:String
    },
    // 开发者
    author:{
        type:String
    },
    // 评分
    rate:{
       type:Number 
    },
    // 图片集URL
    imgURL:{
        type:String
    },
    // 图标URL   
    iconURL:{
        type:String
    },
    // 二维码URL
    qrcode:{
        type:String
    },
    // 时间
    createTime:{
        type:Date,
        default:Date.now()
    }
})

module.exports = applte = mongoose.model("applte",applteSchema);