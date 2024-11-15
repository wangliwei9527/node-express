const {app} = require('../app');
const {verifyToken} = require('../common');
const {sqlSelect} = require('../db');
/**
 * @swagger
 *  /getUser:
 *   get:
 *     summary: 请求用户信息
 *     description: 获取用户信息
 */
app.get('/getUser',verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const sql = `SELECT * FROM users WHERE id = ?`;
    const result = await sqlSelect(sql,[userId]);
    if(result.length === 0) {
        res.status(404).send('没有查询到用户信息');
    }else{
        res.send(result[0]);
    }
})