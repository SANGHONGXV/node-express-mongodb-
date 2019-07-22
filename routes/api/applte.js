const express = require("express");
const router = express.Router();
const passport = require("passport");
const fs = require("fs");
const multer = require('multer');
const applte = require('../../models/applte');

/**
 * @api {post} /api/applte/test 测试
 * @apiGroup Applte
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/test", (req, res) => {
    res.json({ msg: "data works" })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/applte')
    },
    filename: function (req, file, cb) {
        var fileformat = (file.originalname).split('.');
        cb(null, file.fieldname+'-'+Date.now()+'.'+fileformat[fileformat.length-1]);
    }
})
const upload = multer({ storage: storage });

/**
 * @api {post} /api/applte/file/applteImg 上传详情(描述)配图
 * @apiGroup Applte
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.post('/file/applteImg', upload.single('applteImg'),(req, res, next) => {
    res.json({
        status:200,
        code:0,
        message:"上传成功",
        path: req.file.path
    })
});


/**
 * @api {post} /api/applte/file/applteIcon 上传图标
 * @apiGroup Applte
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.post('/file/applteIcon', upload.single('applteIcon'),(req, res, next) => {
　　res.json({
        status:200,
        code:0,
        message:"上传成功",
        path: req.file.path
    })
});

/**
 * @api {post} /api/applte/file/applteQRcode 上传Applte二维码
 * @apiGroup Applte
 * @apiVersion 1.0.0
 */

router.post('/file/applteQRcode', upload.single('applteQRcode'),(req, res, next) => {
　　res.json({
        status:200,
        code:0,
        message:"上传成功",
        path: req.file.path
    })
});



/**
 * @api {post} /api/applte/file/del 根据文件名删除Applte图片
 * @apiGroup Applte
 * @apiParam {String} name 名称
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
// passport.authenticate("jwt", { session: false }),
router.post('/file/del', (req, res) => {
    // 删除文件
    fs.unlink('upload/applte' + req.body.name,(err)=>{
        if(err) return res.status(0).json(err);
        res.json({
            status:200,
            code:0,
            message:"删除成功"
        })
    })
})

/**
 * @api {post} /api/applte/add 添加Applte
 * @apiGroup Applte
 * @apiParam {String} typeid 分类标识
 * @apiParam {String}  name 名称
 * @apiParam {String}  introduce 介绍
 * @apiParam {String}  author 开发人(团队)
 * @apiParam {Number}  rate 评分
 * @apiParam {String}  img 介绍图片集
 * @apiParam {String}  icon 图标
 * @apiParam {String}  qrcode 二维码
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
// passport.authenticate("jwt", { session: false }),
router.post("/add",  (req, res) => {
    const newData = new applte({
        typeid: req.body.typeid,
        name: req.body.name,
        introduce: req.body.introduce,
        author: req.body.author,
        rate: req.body.rate,
        imgURL: req.body.imgURL,
        iconURL: req.body.iconURL,
        qrcode: req.body.qrcode,
        createTime: req.body.createTime
    })
    newData.save()
        .then(data => res.json(data))
        .catch(err => console.log(err))
})

/**
 * @api {get} /api/applte/listAll 获取所有
 * @apiGroup Applte
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/listAll", (req, res) => {
    applte.find().populate('typeid')
        .then(data => {
            if (!data) {
                return res.status(404).json("没有任何内容");
            }
            res.json(data);
        })
        .catch(err => res.status(403).json(err))
})

/**
 * @api {post} /api/applte/listByPage 分页查询
 * @apiGroup Applte
 * @apiParam {String} pageSize 每页显示条数
 * @apiParam {String} page 显示页
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.post('/listByPage',(req,res) => { 
    let pageSize = req.body.pageSize || 5 //设置默认值
    let page = req.body.page || 1
    applte.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
        .then((data) => {
            if (!data) {
                return res.status(404).json("没有任何内容");
            }
            res.json({pageSize:pageSize,page:page,list:data});
        })
        .catch(err => res.status(403).json(err))
}) 

/**
 * @api {GET} /api/applte/one 获取单个
 * @apiGroup Applte
 * @apiParam {String}  id id
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

// passport.authenticate("jwt", { session: false }),
router.get("/one", (req, res) => {
    applte.findOne({ _id: req.query.id })
        .then(data => {
            if (!data) {
                return res.status(404).json("没有任何内容");
            }
            res.json(data);
        })
        .catch(err => res.status(403).json(err))
})

/**
 * @api {GET} /api/applte/list/ofName 通过name查询
 * @apiGroup Applte
 * @apiParam {String}  name 名称
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/list/ofName", (req, res) => {
    applte.find({name:{$regex:req.query.name}})
        .then(data => {
            if (!data) {
                return res.json({
                    "code":404,
                    "status":404,
                    "message":"暂无数据"
                });
            }
            res.json(data);
        })
        .catch(err => res.status(403).json(err))
})

/**
 * @api {GET} /api/applte/list/ofTypeid 通过Typeid查询
 * @apiGroup Applte
 * @apiParam {String} typeid 分类id
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

router.get("/list/ofTypeid", (req, res) => {
    console.log(req.query.typeid);
    
    applte.find({typeid:{$regex:req.query.typeid}})
        .then(doc => {
            if (!doc) {
                return res.json({
                    code:404,
                    status:404,
                    message:"暂无数据"
                });
            }
            res.json(doc);
        })
        .catch(err => res.status(403).json(err))
})


/**
 * @api {post} /api/applte/edit 修改
 * @apiGroup Applte
 * @apiParam {String} id 标识
 * @apiParam {String} typeid 分类标识
 * @apiParam {String}  name 名称
 * @apiParam {String}  introduce 介绍
 * @apiParam {String}  author 开发人(团队)
 * @apiParam {Number}  rate 评分
 * @apiParam {String}  img 介绍图片集
 * @apiParam {String}  icon 图标
 * @apiParam {String}  qrcode 二维码
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */
// passport.authenticate("jwt", { session: false }),
router.post("/edit",  (req, res) => {
    const newData = {}
    if (req.body.typeid) newData.typeid = req.body.typeid; 
    if (req.body.name) newData.name = req.body.name;
    if (req.body.introduce) newData.introduce = req.body.introduce;
    if (req.body.author) newData.author = req.body.author;
    if (req.body.rate) newData.rate = req.body.rate;
    if (req.body.imgURL) newData.imgURL = req.body.imgURL;
    if (req.body.iconURL) newData.iconURL = req.body.iconURL;
    if (req.body.qrcode) newData.qrcode = req.body.qrcode;
    applte.updateOne(
        { _id: req.body.id },
        { $set: newData },
        {runValidators:false}
        // { new: true },
        // { versionKey: false }
    ).then(data => {
        res.json({
            status:200,
            message:"成功",
            data:data
        })
    }).catch(err => res.status(403).json(err))
})


/**
 * @api {delete} /api/applte/del 删除
 * @apiGroup Applte
 * @apiParam {String} id 标识
 * @apiSuccess {json} result
 * @apiVersion 1.0.0
 */

//  passport.authenticate("jwt", { session: false }),
router.delete("/del", (req, res) => {
    applte.findOneAndRemove({ _id: req.body.id }).then(data => {
        data.save().then(data => res.json({
            status:200,
            code:0,
            message:"删除成功"
        }))
    }).catch(err => res.status(404).json(err))
})

module.exports = router;