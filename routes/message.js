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
 *               senderId:
 *                 type: string
 *                 description: 发送者的用户ID
 *                 example: "1"
 *               recipientId:
 *                 type: string
 *                 description: 接收者的用户ID
 *                 example: "9"
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

app.post("/sendMessage", verifyToken, (req, res) => {
  const { recipientId, content, senderUsername, senderAvatar } = req.body;
  const { userId: senderId } = req.user;

  if (!recipientId || !content || !senderUsername || !senderAvatar) {
    return res
      .status(400)
      .json({ success: false, message: "接收者、内容、发送者用户名和发送者头像不能为空" });
  }

  const timestamp = Date.now(); // 生成当前时间戳

  // 创建消息对象
  const message = {
    senderId,
    recipientId,
    content,
    timestamp,
    senderUsername,
    senderAvatar
  };

  // 存储消息
  messages.push(message);

  res.json({ success: true, message: "消息发送成功", data: message });
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
 *                       senderId:
 *                         type: string
 *                         description: 发送者的用户ID
 *                         example: "1"
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

app.get("/getMessages", verifyToken, (req, res) => {
  const lastTimestamp = parseInt(req.query.lastTimestamp, 10) || 0;
  const userId = req.user.userId;
  console.log('userId', userId);

  // 筛选出时间大于lastTimestamp的消息，且发送人或接收人是当前用户
  const newMessages = messages.filter((msg) => {
    return msg.timestamp > lastTimestamp && 
           (msg.recipientId == userId || msg.senderId == userId);
  });

  res.json({
    success: true,
    messages: newMessages,
  });
});

