const fs = require("fs");
const path = require("path");

// 中间件：记录接口返回值日志
function responseLogger(req, res, next) {
  // 保存原始的 `res.send` 方法
  const originalSend = res.send;

  // 重写 `res.send` 方法来捕获返回值
  res.send = function (body) {
    // 将接口的返回数据记录到日志文件
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      response: body,
    };

    const logFilePath = path.join(__dirname, "response_logs.json");
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
      if (err) {
        console.error("Failed to write response log:", err);
      }
    });

    // 恢复原始的 `res.send` 方法以继续处理响应
    return originalSend.call(this, body);
  };

  next();
}

module.exports = responseLogger;
