const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const https = require('https');
// 加载 SSL 证书文件
// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem'),
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
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
