const { app } = require("../app");
const { sqlSelect } = require("../db");
const { verifyToken } = require("../common");

/**
 * @swagger
 * /recordView:
 *   post:
 *     summary: 记录浏览记录
 *     description: 记录用户浏览某个项目的历史记录
 *     tags: [浏览记录管理]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: integer
 *                 description: 被浏览的项目ID
 *                 example: 123
 *     responses:
 *       200:
 *         description: 新增浏览记录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 新增浏览记录成功
 *       400:
 *         description: 缺少参数或用户ID或房产ID不能为空
 *       500:
 *         description: 新增浏览记录失败
 */
app.post("/recordView", verifyToken, async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user.userId;
  if (!userId || !itemId) {
    return res.status(400).json({ message: "用户id或者房产id不能为空" });
  }
  const sql =
    "INSERT INTO browsing_history (user_id, item_id, viewed_at) VALUES (?, ?, NOW())";
  try {
    // 删除旧的浏览记录
    await sqlSelect(
      "DELETE FROM browsing_history WHERE user_id = ? AND item_id = ?",
      [userId, itemId]
    );
    // 插入浏览记录
    await sqlSelect(sql, [userId, itemId]);
    res.status(200).json({ message: "新增浏览记录成功" });
  } catch (error) {
    res.status(500).json({ message: "新增浏览记录失败" });
  }
});

/**
 * @swagger
 * /getBrowsingHistory:
 *   get:
 *     summary: 查询浏览记录
 *     description: 查询用户的浏览记录列表，按时间倒序排序
 *     tags: [浏览记录管理]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页记录数
 *     responses:
 *       200:
 *         description: 查询成功，返回用户浏览记录
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 浏览记录ID
 *                       user_id:
 *                         type: integer
 *                         description: 用户ID
 *                       item_id:
 *                         type: integer
 *                         description: 项目ID
 *                       viewed_at:
 *                         type: string
 *                         format: date-time
 *                         description: 浏览时间
 *       400:
 *         description: 缺少用户ID
 *       500:
 *         description: 查询浏览记录失败
 */
app.get("/getBrowsingHistory", verifyToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user.userId;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  const offset = (page - 1) * limit;
  const sql = `SELECT bh.user_id, bh.viewed_at, h.*
            FROM browsing_history AS bh
            JOIN house AS h ON bh.item_id = h.id
            WHERE bh.user_id = ?
            ORDER BY bh.viewed_at DESC
            LIMIT ? OFFSET ?
            `;
  try {
    // 查询用户的浏览记录，按时间倒序排序
    const rows = await sqlSelect(sql, [userId, parseInt(limit), offset]);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ message: "查询浏览记录失败" });
  }
});
