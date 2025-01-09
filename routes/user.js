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
app.post('/updateUser',verifyToken, async (req, res) => {
    const userId = req.user.userId;
    const {username, password, sex,age,phone,avatar} = req.body;
    const sql = `UPDATE users SET username = ?, password = ?, sex = ? , age = ?,phone = ?, avatar = ?WHERE id = ?`;
    const result = await sqlSelect(sql,[username, password, sex,age, phone,avatar,userId]);
    if(result.affectedRows === 0) {
        res.status(404).send('没有查询到用户信息');
    }else{
        res.status(200).send('更新成功');
    }
})