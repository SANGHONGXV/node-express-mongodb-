const express = require("express");
const router = express.Router();
const passport = require("passport");
const fs = require("fs");
const multer = require('multer');
const Data = require('../../models/Data');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload')
    },
    filename: function (req, file, cb) {
        var fileformat = (file.originalname).split('.');
        cb(null, file.fieldname+'-'+Date.now()+'.'+fileformat[fileformat.length-1]);
    }
})
const upload = multer({ storage: storage });

// $route GET api/data/test
// @desc  返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "data works" })
})

// $route put api/data/file
router.post('/file', upload.single('file'),(req, res, next) => {
// 　　res.send(req);
    res.json(req.file.path)
});

router.delete('/file/del/:name',(req, res) => {
    // console.log(req.params.name);
    // 删除文件
    fs.unlink('upload/' + req.params.name);
})

// $route POST api/data/add
// @desc  创建新的
// @access Privata
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newData = new Data({
        type: req.body.type,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        authorId: req.body.authorId,
        pdfURL: req.body.pdfURL,
        imgURL: req.body.imgRUL,
        date: req.body.date
    })
    newData.save()
        .then(data => res.json(data))
        .catch(err => console.log(err))
})
// $route GET api/data
// @desc  获取所有
// @access Privata
// passport.authenticate("jwt", { session: false }),
router.get("/", (req, res) => {
    Data.find()
        .then(data => {
            if (!data) {
                return res.status(404).json("没有任何内容");
            }
            res.json(data);
        })
        .catch(err => res.status(403).json(err))
})


// $route GET api/data/:id
// @desc  获取单个
// @access Privata
// passport.authenticate("jwt", { session: false }),
router.get("/:id", (req, res) => {
    Data.findOne({ _id: req.params.id })
        .then(data => {
            if (!data) {
                return res.status(404).json("没有任何内容");
            }
            res.json(data);
        })
        .catch(err => res.status(403).json(err))
})

// $route GET api/data/:title
// @desc 模糊查询
// @access Privata
router.get("/title/:title", (req, res) => {
    Data.find({ title: { $regex: req.params.title } })
        .then(data => {
            if (!data) {
                return res.status(404).json("没有任何内容");
            }
            res.json(data);
        })
        .catch(err => res.status(403).json(err))
})




// $route GET api/data/pagelist
// @desc  分页获取
// @access Privata




// $route POST api/data/edit
// @desc  修改
// @access Privata
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newData = {}
    if (req.body.type) newData.type = req.body.type;
    if (req.body.title) newData.title = req.body.title;
    if (req.body.content) newData.content = req.body.content;
    if (req.body.author) newData.author = req.body.author;
    if (req.body.authorId) newData.authorId = req.body.authorId;
    if (req.body.pdfURL) newData.pdfURL = req.body.pdfURL;
    Data.findOneAndUpdate(
        { _id: req.params.id },
        { $set: newData },
        { new: true },
        { versionKey: false }
    ).then(data => res.json(data))
})


// $route delete api/data/del/:id
// @desc  删除
// @access Privata
router.delete("/del/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Data.findOneAndRemove({ _id: req.params.id }).then(data => {
        data.save().then(data => res.json(data))
    }).catch(err => res.status(404).json(err))
})

module.exports = router;