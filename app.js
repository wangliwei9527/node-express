const express = require('express');
const {sqlSelect} = require('./db');
const {verifyToken} = require('./common');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(express.json()); // 解析 JSON 请求体
const setupSwagger = require('./swagger');
const log = require('./utils/log')
app.use(log);
setupSwagger(app);
// app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体
// 允许所有域访问
app.use(cors());
// 设置静态文件目录，将上传的图片文件夹公开
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
module.exports = { app };
require('./routes/index')
// 定义一个简单的路由
app.get('/getList',verifyToken, async (req, res) => {
  const openid = req.user.openid;  // 从 Token 中提取出 openid
  const data = await sqlSelect('SELECT * FROM users WHERE openid = ?', [openid])
  res.send(data[0])
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}
); 