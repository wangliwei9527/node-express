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
app.post('/upload', upload.single('file'), (req, res) => {
    try {
     const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
     console.log(imageUrl);
     res.setHeader('Content-Type', 'application/json; charset=utf-8');
      // 文件上传成功后的处理逻辑
      res.status(200).json({
        message: '图片上传成功',
        filePath: imageUrl,  // 返回文件路径
        code:200
      });
    } catch (error) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(500).json({ message: '图片上传失败' ,code:500});
    }
  });