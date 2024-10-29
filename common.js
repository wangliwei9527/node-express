// 验证 Token 的中间件
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./db');
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // 获取请求头中的 token
  if (!token) {
    return res.status(403).json({ error: '未提供 Token' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token 无效' });
    }

    req.user = decoded;  // 将解析出来的用户信息保存到 req 对象中
    next();  // 继续执行下一个中间件或路由处理
  });
}
exports.verifyToken = verifyToken