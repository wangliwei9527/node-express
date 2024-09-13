const express = require('express');
const {sqlSelect,SECRET_KEY} = require('./db');
const {verifyToken} = require('./common');
const jwt = require('jsonwebtoken');
const {wxLogin} = require('./wxLogin');
const app = express();
const port = 3000;
const cors = require('cors');
// 允许所有域访问
app.use(cors());

app.get('/login', (req, res) => {
  const code = req.query.code
  wxLogin(code).then(async (data) => {
    console.log(data)
    const result = await sqlSelect('SELECT * FROM users WHERE openid = ?', [data.openid])
    console.log(result)
    // if (result.length !== 0) {
    //   await sqlSelect('UPDATE users SET session_key = ? WHERE openid = ?')
    // }
    const token = jwt.sign({ openid:data.openid }, SECRET_KEY, { expiresIn: '365d' });
    res.send(token)
  })
})
// 定义一个简单的路由
app.get('/getList',verifyToken, async (req, res) => {
  const openid = req.user.openid;  // 从 Token 中提取出 openid
  console.log('openid',openid)
  const data = await sqlSelect('SELECT * FROM users WHERE openid = ?', [openid])
  res.send(data[0])
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}
);
