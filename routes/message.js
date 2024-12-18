const { app } = require("../app");
const { verifyToken, buildQuery } = require("../common");

let messages = [];
/**
 * @swagger
 * /sendMessage:
 *   post:
 *     summary: 发送消息
 *     description: 用户向指定的接收者发送一条消息
 *     tags: [聊天功能]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sender:
 *                 type: string
 *                 description: 发送者的用户ID
 *                 example: "user123"
 *               recipientId:
 *                 type: string
 *                 description: 接收者的用户ID
 *                 example: "user456"
 *               content:
 *                 type: string
 *                 description: 消息内容
 *                 example: "你好！"
 *     responses:
 *       200:
 *         description: 消息发送成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "消息发送成功"
 *       400:
 *         description: 发送者或内容缺失
 *       500:
 *         description: 消息发送失败，服务器错误
 */

app.post("/sendMessage",verifyToken, (req, res) => {
  const { recipientId, content } = req.body;
  const senderId = req.user.userId; 
  if (!recipientId || !content) {
    return res
      .status(400)
      .json({ success: false, message: "接收者和内容不能为空" });
  }
  const timestamp = Date.now(); // 生成当前时间戳
  messages.push({ senderId, recipientId, content, timestamp }); // 存储消息

  res.json({ success: true, message: "消息发送成功" });
});

/**
 * @swagger
 * /getMessages:
 *   get:
 *     summary: 获取新的消息
 *     description: 获取指定用户从上次时间戳之后的未读消息
 *     tags: [聊天功能]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lastTimestamp
 *         required: false
 *         schema:
 *           type: integer
 *         description: 上次接收到消息的时间戳，获取该时间戳之后的消息
 *         example: 1609459200000
 *     responses:
 *       200:
 *         description: 成功返回新消息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sender:
 *                         type: string
 *                         description: 发送者的用户ID
 *                         example: "user123"
 *                       content:
 *                         type: string
 *                         description: 消息内容
 *                         example: "你好！"
 *                       timestamp:
 *                         type: integer
 *                         description: 消息的时间戳
 *                         example: 1609462800000
 *       400:
 *         description: 请求参数错误或用户身份验证失败
 *       500:
 *         description: 获取消息失败，服务器错误
 */

app.get("/getMessages",verifyToken, (req, res) => {
  const lastTimestamp = parseInt(req.query.lastTimestamp, 10) || 0;
  const userId = req.user.userId;

  // 筛选出比上次时间戳新的消息并且是该用户接收到的
  const newMessages = messages.filter((msg) => {
    return msg.timestamp > lastTimestamp && msg.recipientId === userId;
  });

  res.json({
    success: true,
    messages: newMessages,
  });
});

