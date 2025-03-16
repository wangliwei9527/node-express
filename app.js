const express = require("express");
const path = require("path");
const app = express();
const https = require('https');
const fs = require('fs');
const port = 3000;
// 加载 SSL 证书文件
// const options = {
//   key: fs.readFileSync('/install/zhufangzhijia.cn.key'),
//   cert: fs.readFileSync('/install/zhufangzhijia.cn.pem'),
// };
const cors = require("cors");
app.use(express.json()); // 解析 JSON 请求体
const setupSwagger = require("./swagger");
setupSwagger(app);
// 允许所有域访问
app.use(cors());
// 设置静态文件目录，将上传的图片文件夹公开
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
module.exports = { app };
require("./routes/index");
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// https.createServer(options, app).listen(443, () => {
//   console.log('HTTPS server running on zhufangzhijia.cn');
// });

