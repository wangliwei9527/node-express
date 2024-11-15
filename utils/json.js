const fs = require('fs');
const path = require('path');

// 中间件：记录接口返回值日志
function json(req, res, next) {
  // 保存原始的 `res.json` 方法
  const originalJson = res.json;

  // 重写 `res.json` 方法来捕获返回值
  res.json = function (body) {
    // 构造日志条目
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      responseStatus: res.statusCode,
      response: body,
    };

    const logFilePath = path.join(__dirname, 'response_logs.json');
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
      if (err) {
        console.error('Failed to write response log:', err);
      }
    });

    // 调用原始的 `res.json` 方法
    return originalJson.call(this, body);
  };

  next();
}

module.exports = json;
