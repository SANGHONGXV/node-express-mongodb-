# nodeadmin后端接口
### 此为镜像仓库-原仓库(Gitee):https://gitee.com/xiangmukuangjia/nodeadmin
## 1.部署

1.1 安装node环境

1.2 删除项目根目录下./node_modules文件夹，项目根目录下命令行操作：
> npm install

1.3 配置数据库创建一个test集合，或者自行修改
| config index.js

1.4 开发环境执行
> npm run server

或者

生产环境执行
> npm run start

1.5 生成api接口文档
>  npm run apidoc

1.6 打开api接口文档 
> 浏览器访问 http://127.0.0.1:5000/apidoc


## 2.技术栈
node+express+mongodb 

## 3.实现

- [x] 数据 增删改查
- [x] 上传图片，删除
- [x] 配置docapi
