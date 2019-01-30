const express = require("express");
const router = express.Router();
// 头像引用全球公认头像gravatar
var gravatar = require('gravatar');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require("../../models/User");
const keys = require("../../config/index");
const passport = require("passport");
// $route GET api/users/test
// @desc  返回的请求的json数据
// @access public
// router.get("/test", (req, res) => {
//     res.json({ msg: "login works" })
// })

// $route POST api/users/register
// @desc  返回的请求的json数据
// @access public
router.post("/register", (req, res) => {
    // console.log(req.body);
    // 查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json("邮箱已经被注册")
            } else {
                var url = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: url,
                    password: req.body.password,
                    identity: req.body.identity
                })
                // password未进行加密
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // hash为加密后的密码
                        if (err) throw err;
                        newUser.password = hash;

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
})

// $route GET api/users
// @desc  获取所有
// @access Privata
// passport.authenticate("jwt", { session: false }),
router.get("/", (req, res) => {
    User.find()
        .then(user => {
            if (!user) {
                return res.status(404).json("没有任何内容");
            }
            res.json(user);
        })
        .catch(err => res.status(403).json(err))
})

// $route POST api/users/login
// @desc  返回token jwt passpord
// @access public

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(403).json("用户不存在");
            }
            //密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = { 
                            id: user.id, 
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        //   jwt.sign("规则","加密名字","过期时间","箭头函数")
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        })
                    } else {
                        return res.status(400).json("密码错误")
                    }
                })
        })
})

// $route GET api/users/current
// @desc return current user
// @access Private

// router.get("/current","验证token",(req, res) => {
//     res.json({msg:"success"})
// })
// passport.authenticate("验证方式",{session})
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})

// $route delete api/users/del/:id
// @desc  删除
// @access Privata
router.delete("/del/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    User.findOneAndRemove({_id: req.params.id}).then(user =>{
        user.save().then(user => res.json(user))
    }).catch(err => res.status(404).json(err))
})

module.exports = router;