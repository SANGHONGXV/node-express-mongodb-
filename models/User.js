const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    // 姓名
    name:{
        type:String,
        required:true
    },
    // 邮箱
    email:{
        type:String,
        required:true
    },
    // 密码
    password:{
        type:String,
        required:true
    },
    // 头像
    avatar:{
        type:String
    },
    // 角色
    identity:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

module.exports = User = mongoose.model("users",UserSchema);