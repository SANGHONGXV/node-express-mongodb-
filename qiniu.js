const qiniu = require('qiniu');

const accessKey = 'xxx'; // accessKey
const secretKey = 'xxx'; // secretKey

const bucket = 'xxx'; //仓库名字

const options = {
  scope: 'xxx',// 仓库名字
};

function log(x) {
  console.log(x);
}

// 上传文件到七牛云
let upload = (key, file) => {
  return new Promise((resolve) => {
    try {
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);

      const config = new qiniu.conf.Config();
      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();

      formUploader.put(uploadToken, key, file, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          log(respErr);
          resolve(null);
        }
        if (respInfo.statusCode === 200) {
          resolve('http://qiniu.kuan1.top/' + respBody.key);
        } else {
          resolve(null);
        }
      });
    } catch (err) {
      log(err);
      resolve(null);
    }
  });
};

// 七牛云文件列表
let list = (limit = 10, marker = '') => {
  return new Promise((resolve) => {
    try {
      const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      const config = new qiniu.conf.Config();
      const bucketManager = new qiniu.rs.BucketManager(mac, config);

      const options = {
        limit: limit,
        prefix: '',
      };
      if (marker) {
        Object.assign(options, {marker});
      }
      bucketManager.listPrefix(bucket, options, function (err, respBody, respInfo) {
        if (err) {
          resolve(null);
          return;
        }
        if (respInfo.statusCode === 200) {
          let nextMarker = respBody.marker;
          let files = [];
          let items = respBody.items;

          items.forEach(function (item) {
            files.push('http://qiniu.kuan1.top/' + item.key);
          });
          resolve({
            files,
            marker: nextMarker
          });
        } else {
          log(respInfo);
          resolve(null);
        }
      });
    } catch (err) {
      log(err);
      resolve(null);
    }
  });
};


// 删除七牛云文件
let remove = (key) => {
  key = key.replace('http://pic.kuan1.top/', '')
    .replace('http://qiniu.kuan1.top/', '')
    .replace('http://test.kuan1.top/')
    .replace('http://ozjzwrsns.bkt.clouddn.com/', '')
    .replace('http://p1i3nwzqd.bkt.clouddn.com/', '');
  return new Promise((resolve, reject) => {
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);

    bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
      if (err) {
        log(err);
        resolve(null);
      } else {
        resolve(respInfo.statusCode === 200);
      }
    });
  });
};

module.exports = {
  upload,
  list,
  remove
};