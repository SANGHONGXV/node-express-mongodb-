const express = require("express");
const router = express.Router();
const passport = require("passport");
const Type = require('../../models/Type');

// $route POST api/type/add
// @desc  创建新的
// @access Privata
// passport.authenticate("jwt", { session: false }),
router.post("/add", (req, res) => {
    const newData = new Type({
        name: req.body.name,
        date: req.body.date
    })
    newData.save()
        .then(type => res.json(type))
        .catch(err => console.log(err))
})
// $route GET api/type
// @desc  获取所有
// @access Privata
// passport.authenticate("jwt", { session: false }),
router.get("/", (req, res) => {
    Type.find()
        .then(type => {
            if (!type) {
                return res.status(404).json("还没有数据哦");
            }
            res.json(type);
        })
        .catch(err => res.status(403).json(err))
})

// $route GET api/type/:id
// @desc  获取单个
// @access Privata
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    console.log(req)
    Type.findOne({ _id: req.params.id })
        .then(type => {
            if (!type) {
                return res.status(404).json("还没有数据哦");
            }
            res.json(type);
        })
        .catch(err => res.status(403).json(err))
})

// $route POST api/type/edit
// @desc  修改
// @access Privata
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newData = {}
    if(req.body.name) newData.name = req.body.name;
    Type.findOneAndUpdate(
        {_id: req.params.id},
        {$set: newData},
        {new: true}
    ).then(type => res.json(type))
})


// $route delete api/data/del/:id
// @desc  删除
// @access Privata
router.delete("/del/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Type.findOneAndRemove({_id: req.params.id}).then(type =>{
        type.save().then(type => res.json(type))
    }).catch(err => res.status(404).json(err))
})

module.exports = router;