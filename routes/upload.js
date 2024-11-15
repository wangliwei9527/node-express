const express = require("express");
const multer = require("multer");
const path = require("path");
const { app } = require("../app");
const { verifyToken } = require("../common");
// 配置 multer 中间件，用于设置存储位置和文件名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 设置上传图片保存的目录
  },
  filename: (req, file, cb) => {
    console.log('file',file);
    // 使用当前时间戳和文件原始名来命名文件
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
// 上传图片接口
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: 上传图片
 *     description: 接收并保存用户上传的图片，返回保存后的文件路径。
 *     tags:
 *       - 文件上传
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 要上传的图片文件
 *     responses:
 *       200:
 *         description: 图片上传成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 图片上传成功
 *                 filePath:
 *                   type: string
 *                   example: uploads/unique-file-name.jpg
 *                   description: 上传图片的保存路径
 *       500:
 *         description: 图片上传失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 图片上传失败
 */
app.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer 错误
      return res.status(400).json({ message: `文件上传失败: ${err.message}`, code: 400 });
    } else if (err) {
      // 其他错误
      return res.status(400).json({ message: `上传出错: ${err.message}`, code: 400 });
    }
    // 文件上传成功后的处理逻辑
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
      message: '图片上传成功',
      filePath: imageUrl,
      code: 200,
    });
  });
});
