const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport")
const app = express();

const applte = require("./routes/api/applte");
// DB config
const db = require("./config/index").mongoUrl;
// 上传
app.use('/upload',express.static('upload'));

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

// 配置apidoc
app.use(express.static(path.join(__dirname, 'public')))
app.get('/apidoc',function(req,res){
    res.sendfile("./public/apidoc/index.html")
})

// 使用routes
app.use("/api/applte",applte);

const port = process.env.POST || 5000;

app.listen(port,() => {
    console.log(`运行的端口号为 ${port}`)
})