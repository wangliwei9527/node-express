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

  const requestLog = {
    type: "Request",
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  };

  // 记录请求日志
  fs.readFile(logFilePath, (err, fileData) => {
    let logs = [];
    if (!err && fileData.length) {
      logs = JSON.parse(fileData);
    }

    logs.push(requestLog);

    fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Failed to write log:", writeErr);
      }
    });
  });

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

    // 记录响应日志
    fs.readFile(logFilePath, (err, fileData) => {
      let logs = [];
      if (!err && fileData.length) {
        logs = JSON.parse(fileData);
      }

      logs.push(responseLog);

      fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("Failed to write log:", writeErr);
        }
      });
    });

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

      fs.readFile(logFilePath, (err, fileData) => {
        let logs = [];
        if (!err && fileData.length) {
          logs = JSON.parse(fileData);
        }

        logs.push(errorLog);

        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (writeErr) => {
          if (writeErr) {
            console.error("Failed to write log:", writeErr);
          }
        });
      });
    }
  });

  next();
};

module.exports = log;
