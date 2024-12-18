const fs = require("fs").promises;
const path = require("path");
const { createLogger, format, transports } = require("winston");

// 日志文件路径
const logFilePath = path.join(process.cwd(), "logs", "api_logs.json");

// 初始化日志文件
async function initializeLogFile() {
  try {
    // 检查日志文件是否存在
    const fileExists = await fs.access(logFilePath).then(() => true).catch(() => false);
    if (!fileExists) {
      // 如果文件不存在，初始化为空数组
      await fs.writeFile(logFilePath, "[]");
    }
  } catch (error) {
    console.error("日志文件初始化失败:", error);
  }
}

// 追加日志到文件
async function appendLog(log) {
  try {
    const fileData = await fs.readFile(logFilePath, "utf-8");
    const logs = JSON.parse(fileData || "[]"); // 读取现有日志
    logs.push(log); // 添加新日志
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2)); // 格式化写入
  } catch (error) {
    console.error("日志写入失败:", error);
  }
}

// 创建 winston 日志记录器
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(), // 控制台输出
  ],
});

// 包装日志记录方法
logger.logRequest = async (req) => {
  const logEntry = {
    type: "Request",
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    timestamp: new Date().toISOString(),
  };
  await appendLog(logEntry);
};

logger.logResponse = async (res, data, duration) => {
  const logEntry = {
    type: "Response",
    status: res.statusCode,
    response: data,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  };
  await appendLog(logEntry);
};

// 初始化日志文件
initializeLogFile();

module.exports = logger;
