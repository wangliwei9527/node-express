const {app} = require('../app');
const {sqlSelect} = require('../db');
const {verifyToken} = require('../common');
/**
 * @swagger
 * /addCollection:
 *   post:
 *     summary: 添加收藏
 *     description: 用户收藏某个项目
 *     tags: [收藏管理]
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
 *                 description: 被收藏的项目ID
 *                 example: 123
 *     responses:
 *       200:
 *         description: 收藏成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 收藏成功
 *       400:
 *         description: 缺少参数或已收藏
 *       500:
 *         description: 收藏失败
 */
app.post('/addCollection', verifyToken,async (req, res) => {
    const userId = req.user.userId;
    const { itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ message: '缺少参数itemId' });
    }
    try {
        // 插入收藏记录
        await sqlSelect('INSERT INTO collections (user_id, item_id, created_at) VALUES (?, ?, NOW())',[userId, itemId])
        res.status(200).json({ message: '收藏成功' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: '该房产已收藏' });
        }
        res.status(500).json({ message: '收藏失败' });
    }
});
/**
 * @swagger
 * /removeCollection:
 *   post:
 *     summary: 取消收藏
 *     description: 取消用户的某个项目收藏
 *     tags: [收藏管理]
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
 *                 description: 要取消收藏的项目ID
 *                 example: 123
 *     responses:
 *       200:
 *         description: 取消收藏成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 取消收藏成功
 *       400:
 *         description: 缺少参数或未收藏
 *       500:
 *         description: 取消收藏失败
 */
app.post('/removeCollection',verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const { itemId } = req.body;

    if (!userId || !itemId) {
        return res.status(400).json({ message: '缺少参数itemId' });
    }

    try {
        // 删除收藏记录
        const [result] = await sqlSelect('DELETE FROM collections WHERE user_id = ? AND item_id = ?',[userId, itemId])

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: '该房产未收藏' });
        }
        res.status(200).json({ message: '取消收藏成功' });
    } catch (error) {
        res.status(500).json({ message: '取消收藏失败' });
    }
});

/**
 * @swagger
 * /getUserCollections:
 *   get:
 *     summary: 查询用户收藏
 *     description: 获取用户的所有收藏项目，按时间排序
 *     tags: [收藏管理]
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
 *         description: 每页项目数
 *     responses:
 *       200:
 *         description: 查询成功，返回用户收藏数据
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
 *                         description: 收藏记录ID
 *                       user_id:
 *                         type: integer
 *                         description: 用户ID
 *                       item_id:
 *                         type: integer
 *                         description: 项目ID
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: 收藏时间
 *       500:
 *         description: 查询收藏失败
 */
app.get('/getUserCollections',verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const sql = 'SELECT * FROM collections WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    try {
        // 查询用户的收藏列表，按时间排序
        const [rows] = await sqlSelect(sql,[userId, parseInt(limit), offset])

        res.status(200).json({ data: rows });
    } catch (error) {
        res.status(500).json({ message: '查询收藏失败' });
    }
});

