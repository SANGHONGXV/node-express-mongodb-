post  /users/register  用户新增注册
name 姓名
email 邮箱
avatar 头像
password 密码
identity  角色，身份

post /users/login   登录
email 邮箱
password 密码

post  /data/add   数据添加
type 类型
title 标题
content 内容
author 作者

get /data/ 获取所有
get   /data/:id   通过id获取
post     /data/update/:id   修改
delete      /data/del/:id  删除

