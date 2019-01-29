const express = require("express");
const router = express.Router();
const passport = require("passport");
const Data = require('../../models/Data');
// $route GET api/data/test
// @desc  返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "data works" })
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
        pdfURL: req.body.pdfURL,
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
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req)
    Data.findOne({ _id: req.params.id })
        .then(data => {
            if (!data) {
                return res.status(404).json("没有任何内容");
            }
            res.json(data);
        })
        .catch(err => res.status(403).json(err))
})

// $route POST api/data/edit
// @desc  修改
// @access Privata
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newData = {}
    if(req.body.type) newData.type = req.body.type;
    if(req.body.title) newData.title =  req.body.title;
    if(req.body.content) newData.content = req.body.content;
    if(req.body.author) newData.author = req.body.author;
    if(req.body.pdfURL) newData.pdfURL = req.body.pdfURL;
    Data.findOneAndUpdate(
        {_id: req.params.id},
        {$set: newData},
        {new: true},
        {versionKey: false}
    ).then(data => res.json(data))
})


// $route delete api/data/del/:id
// @desc  删除
// @access Privata
router.delete("/del/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Data.findOneAndRemove({_id: req.params.id}).then(data =>{
        data.save().then(data => res.json(data))
    }).catch(err => res.status(404).json(err))
})

module.exports = router;