const axios = require('axios');

const { AppSecret, AppId } = require('./db'); // 注意文件的路径
const wxLogin = function (code) {
  console.log('123',{
    appid: AppId,
    secret:AppSecret,
    js_code:code,
    grant_type:'authorization_code'
  });
  return new Promise((resolve, reject) => {axios.get('https://api.weixin.qq.com/sns/jscode2session',{
    params: {
      appid: AppId,
      secret: AppSecret,
      js_code: code,
      grant_type: 'authorization_code'
    }
  })
  .then(response => {
    resolve(response.data);
  })
  .catch(error => {
    reject(error);
  });
  })
  
}
exports.wxLogin = wxLogin;