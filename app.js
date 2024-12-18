const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
// const logger = require("./utils/logger"); // 引入自定义日志模块
// // 请求日志中间件
// app.use(async (req, res, next) => {
//   const startTime = new Date();
//   await logger.logRequest(req); // 记录请求日志

//   const originalJson = res.json;
//   res.json = async (data) => {
//     const duration = new Date() - startTime;
//     await logger.logResponse(res, data, duration); // 记录响应日志
//     originalJson.call(res, data);
//   };

//   next();
// });
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
