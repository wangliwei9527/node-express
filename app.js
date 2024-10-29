const express = require('express');
const {sqlSelect,SECRET_KEY} = require('./db');
const {verifyToken} = require('./common');
const jwt = require('jsonwebtoken');
const {wxLogin} = require('./wxLogin');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(express.json()); // 解析 JSON 请求体
const setupSwagger = require('./swagger');
setupSwagger(app);
// app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体
// 允许所有域访问
app.use(cors());
// 创建日志文件流
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// 自定义中间件：记录请求参数
app.use((req, res, next) => {
  const logDetails = {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  };

  // 将日志信息转换为 JSON 格式并写入日志文件
  logStream.write(`Request: ${JSON.stringify(logDetails)}\n`);
  next();
});

// 使用 morgan 中间件记录日志
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[iso]', { stream: logStream }));
module.exports = { app };
require('./routes/index')
app.get('/login', (req, res) => {
  const code = req.query.code
  wxLogin(code).then(async (data) => {
    console.log(data)
    const result = await sqlSelect('SELECT * FROM users WHERE openid = ?', [data.openid])
    console.log(result)
    // if (result.length !== 0) {
    //   await sqlSelect('UPDATE users SET session_key = ? WHERE openid = ?')
    // }
    const token = jwt.sign({ openid:data.openid,userId:result[0].id }, SECRET_KEY, { expiresIn: '365d' });
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