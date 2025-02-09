const { app } = require("../app");
const { sqlSelect } = require("../db");
const { verifyToken } = require("../common");
  
app.post('/addComment', verifyToken, async (req, res) => {
    try {
      const userId = req.user.userId;  // 从用户认证信息中获取userId
      const {
        houseId,
        commentText,
        imageUrls,  // 图片URL数组
        parentCommentId,  // 回复评论ID
      } = req.body;
  
      // 判断必填字段是否为空
      if (!houseId || !commentText) {
        return res.status(400).json({ message: '缺少必要的参数' });
      }
  
      // 将图片URL数组转换为JSON字符串
      const jsonUrls = imageUrls ? JSON.stringify(imageUrls) : null;
  
      // 插入评论的SQL语句
      const sql = `
        INSERT INTO comments (houseId, userId, commentText, imageUrls, parentCommentId)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      // 插入的数据
      const values = [houseId, userId, commentText, jsonUrls, parentCommentId || null];
      
      // 执行SQL查询
      const result = await sqlSelect(sql, values);
      
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: '评论添加成功' });
      } else {
        return res.status(500).json({ message: '评论添加失败' });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ message: '服务器错误，添加评论失败', error: error.message });
    }
  });
  