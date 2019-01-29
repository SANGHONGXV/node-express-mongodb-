const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport")
const app = express();


const users = require("./routes/api/users");
const data = require("./routes/api/data");
const type = require("./routes/api/type");

// DB config
const db = require("./config/index").mongoUrl;

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

mongoose.connect(db)
        .then(() => console.log("Mongodb 连接成功"))
        .catch(err => console.log(err));

// passport初始化
app.use(passport.initialize());
// 配置passport
require("./config/passport")(passport);


// app.get("/",(req,res) => {
//     res.send("Hello world!");
// })

// 使用routes
app.use("/api/users",users);
app.use("/api/data",data);
app.use("/api/type",type);


const port = process.env.POST || 5000;

app.listen(port,() => {
    console.log(`运行的端口号为 ${port}`)
})