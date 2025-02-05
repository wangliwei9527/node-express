const {app} = require('../app');
const {sqlSelect,SECRET_KEY} = require('../db');
const {wxLogin} = require('../wxLogin');
const {generateRandomName} = require('../common');
const path = require("path");
const jwt = require('jsonwebtoken');
// 动态生成默认头像 URL
function getFullAvatarURL(req) {
  const host = req.get("host"); // 获取请求的主机名和端口，例如 "localhost:3000"
  const protocol = req.protocol; // 获取请求协议，例如 "http" 或 "https"
  const avatarPath = path.join("/uploads", "avatar.png");
  return `${protocol}://${host}${avatarPath}`;
}
/**
 * @swagger
 * /login:
 *   get:
 *     summary: 用户登录接口
 *     description: 使用微信登录的接口，支持手机号和密码参数。若用户不存在则自动注册。
 *     tags: [用户管理]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: 微信登录凭证code
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[1-9][0-9]{10}$'
 *         description: 用户手机号
 *       - in: query
 *         name: password
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户密码
 *     responses:
 *       200:
 *         description: 登录成功，返回JWT令牌
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       500:
 *         description: 注册失败或其他错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 注册失败
 *                 code:
 *                   type: integer
 *                   example: 500
 */
app.get('/login', (req, res) => {
  const code = req.query.code;
  const phone = req.query.phone;
  const password = req.query.password;

  wxLogin(code).then(async (data) => {
    const result = await sqlSelect('SELECT * FROM users WHERE openid = ?', [data.openid]);

    if (result.length == 0) {
      // 用户不存在，进行注册流程
      const userName = generateRandomName();
      const defaultAvatarPath = getFullAvatarURL(req);
      const sql = `INSERT INTO users (username, password, openid, phone, sex, age, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const values = [userName, password, data.openid, phone, '男', 18, defaultAvatarPath];
      const sqlValue = await sqlSelect(sql, values);

      if (sqlValue.affectedRows > 0) {
        const newUser = await sqlSelect('SELECT * FROM users WHERE openid = ?', [data.openid]);
        const token = jwt.sign({ openid: data.openid, userId: newUser[0].id, phone: phone }, SECRET_KEY, { expiresIn: '365d' });
        res.send({
          code: 200,
          msg: '注册成功',
          token,
          userId: newUser[0].id,
        });
      } else {
        res.send({
          msg: '注册失败',
          code: 500,
        });
      }
    } else {
      // 用户已存在，进行密码校验
      if (result[0].password === password) {
        const token = jwt.sign({ openid: data.openid, userId: result[0].id, phone: phone }, SECRET_KEY, { expiresIn: '365d' });
        res.send({
          code: 200,
          msg: '登录成功',
          token,
          userId: result[0].id,
        });
      } else {
        res.send({
          code: 401,
          msg: '密码错误',
        });
      }
    }
  });
});