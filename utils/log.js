const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();

// 解析 JSON 请求体
app.use(express.json());

// 创建日志目录（如果不存在）
const logDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const log = (req, res, next) => {
  const startTime = new Date();
  const endpointPath = req.path.replace(/\//g, "_") || "root";
  const logFileName = `${endpointPath}_log.json`;
  const logFilePath = path.join(__dirname, "logs", logFileName);

  // 记录请求日志
  const requestLog = {
    type: "Request",
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  };

  // 捕获响应和错误
  const originalJson = res.json;
  res.json = (data) => {
    const responseLog = {
      type: "Response",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      response: data,
      timestamp: new Date().toISOString(),
      duration: `${new Date() - startTime}ms`,
    };

    // 记录请求和响应日志到文件
    appendToLogFile(logFilePath, requestLog, responseLog);

    originalJson.call(res, data);
  };

  // 捕获未处理的错误并记录
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      const errorLog = {
        type: "Error",
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        message: "Request failed or incomplete.",
        timestamp: new Date().toISOString(),
        duration: `${new Date() - startTime}ms`,
      };

      appendToLogFile(logFilePath, errorLog); // 错误日志
    }
  });

  next();
};

// 将日志追加到文件中
function appendToLogFile(logFilePath, ...logs) {
  fs.readFile(logFilePath, "utf8", (err, fileData) => {
    let logEntries = [];
    if (!err && fileData.trim()) {
      try {
        logEntries = JSON.parse(fileData); // 读取现有日志
      } catch (parseError) {
        console.error("Error parsing existing log file:", parseError);
        logEntries = []; // 如果日志文件有问题，重置为空
      }
    }

    logEntries.push(...logs); // 添加新的日志条目
    fs.writeFile(
      logFilePath,
      JSON.stringify(logEntries, null, 2),
      (writeErr) => {
        if (writeErr) {
          console.error("Failed to write log:", writeErr);
        } else {
          console.log("Log written successfully.");
        }
      }
    );
  });
}

module.exports = log;
