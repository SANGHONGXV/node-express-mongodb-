const express = require("express");
const router = express.Router();
const passport = require("passport");
const Type = require('../../models/Type');

// $route POST api/type/add
// @desc  创建新的
// @access Privata
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newData = new Data({
        name: req.body.name,
        date: req.body.date
    })
    newData.save()
        .then(type => res.json(type))
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
    if(req.body.type) newData.name = req.body.name;
    Data.findOneAndUpdate(
        {_id: req.params.id},
        {$set: newData},
        {new: true}
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