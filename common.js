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
function generateRandomName() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = Math.floor(Math.random() * 3) + 7; // Random length between 7 and 9
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}
function buildQuery(filters) {
  let baseQuery = `
    SELECT house.*, users.phone
    FROM house
    INNER JOIN users ON house.userId = users.id
  `;

  let conditions = [];
  
  if (filters.district) {
    conditions.push(`house.district = '${filters.district}'`);
  }
  if (filters.priceMin) {
    conditions.push(`house.price >= ${filters.priceMin}`);
  }
  if (filters.priceMax) {
    conditions.push(`house.price <= ${filters.priceMax}`);
  }
  if (filters.houseType) {
    conditions.push(`house.houseType = ${filters.houseType}`);
  }

  if (conditions.length > 0) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }

  return baseQuery;
}
exports.verifyToken = verifyToken
exports.generateRandomName = generateRandomName
exports.buildQuery = buildQuery