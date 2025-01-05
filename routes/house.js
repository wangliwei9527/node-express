const { app } = require("../app");
const { sqlSelect } = require("../db");
const { verifyToken, buildQuery } = require("../common");
/**
 * @swagger
 * /addHouse:
 *   post:
 *     summary: 添加房屋信息
 *     description: 创建一个新的房屋信息记录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyName:
 *                 type: string
 *                 description: 物业名称
 *               alias:
 *                 type: string
 *                 description: 别名
 *               totalPrice:
 *                 type: number
 *                 format: float
 *                 description: 总价
 *               type:
 *                 type: string
 *                 description: 房屋类型
 *               heatingMethod:
 *                 type: string
 *                 description: 供暖方式
 *               electricityMethod:
 *                 type: string
 *                 description: 用电方式
 *               gasMethod:
 *                 type: string
 *                 description: 用气方式
 *               buildingAddress:
 *                 type: string
 *                 description: 建筑地址
 *               salesOfficeAddress:
 *                 type: string
 *                 description: 售楼处地址
 *               area:
 *                 type: number
 *                 format: float
 *                 description: 面积
 *               price:
 *                 type: number
 *                 format: float
 *                 description: 单价
 *               picture:
 *                 type: string
 *                 description: 房屋图片URL
 *               state:
 *                 type: string
 *                 description: 房屋状态
 *               pageView:
 *                 type: integer
 *                 description: 浏览量
 *               houseType:
 *                 type: string
 *                 description: 户型
 *               squareMeter:
 *                 type: number
 *                 format: float
 *                 description: 平方米数
 *               district:
 *                 type: string
 *                 description: 区域
 *               phone:
 *                 type: string
 *                 description: 联系电话
 *               developmentArea:
 *                 type: number
 *                 format: float
 *                 description: 开发面积
 *               openingDate:
 *                 type: string
 *                 format: date
 *                 description: 开盘日期
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 description: 交房日期
 *               decorationStatus:
 *                 type: string
 *                 description: 装修状态
 *               propertyRightsDuration:
 *                 type: integer
 *                 description: 产权年限
 *               plannedHouseholds:
 *                 type: integer
 *                 description: 规划户数
 *               parkingRatio:
 *                 type: number
 *                 format: float
 *                 description: 车位比
 *               ownerName:
 *                 type: string
 *                 description: 业主姓名
 *               ownerContact:
 *                 type: string
 *                 description: 业主联系方式
 *               companyName:
 *                 type: string
 *                 description: 开发公司名称
 *               userId:
 *                 type: integer
 *                 description: 用户ID
 *               floor:
 *                 type: string
 *                 description: 楼层
 *               face:
 *                 type: string
 *                 description: 朝向
 *               propertyMoney:
 *                 type: string
 *                 description: 物业费
 *               lift:
 *                 type: string
 *                 description: 电梯
 *               image_urls:
 *                 type: string
 *                 description: 图片数组
 *     responses:
 *       200:
 *         description: 成功添加房屋
 */
app.post("/addHouse", verifyToken, (req, res) => {
  const userId = req.user.userId;
  const {
    propertyName,
    alias,
    totalPrice,
    type,
    heatingMethod,
    electricityMethod,
    gasMethod,
    buildingAddress,
    salesOfficeAddress,
    area,
    price,
    picture,
    state,
    pageView,
    houseType,
    squareMeter,
    district,
    phone,
    developmentArea,
    openingDate,
    deliveryDate,
    decorationStatus,
    propertyRightsDuration,
    plannedHouseholds,
    parkingRatio,
    ownerName,
    ownerContact,
    companyName,
    floor,
    face,
    propertyMoney,
    lift,
    image_urls,
  } = req.body;
  const jsonUrls = JSON.stringify(image_urls);
  // SQL 插入语句
  const sql = `INSERT INTO house 
  (propertyName, alias, totalPrice, type, heatingMethod, electricityMethod, gasMethod, buildingAddress, salesOfficeAddress, area, price, picture, state, pageView, houseType, squareMeter, district, phone, developmentArea, openingDate, deliveryDate, decorationStatus, propertyRightsDuration, plannedHouseholds, parkingRatio, ownerName, ownerContact, companyName, userId, floor, face, propertyMoney, lift,image_urls) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  // 插入的数据
  const values = [
    propertyName || "", // 物业名称，默认为空字符串
    alias || "", // 别名，默认为空字符串
    totalPrice || 0, // 总价，默认为 0
    type || "", // 房屋类型，默认为空字符串
    heatingMethod || "", // 供暖方式，默认为空字符串
    electricityMethod || "", // 用电方式，默认为空字符串
    gasMethod || "", // 用气方式，默认为空字符串
    buildingAddress || "", // 建筑地址，默认为空字符串
    salesOfficeAddress || "", // 售楼处地址，默认为空字符串
    area || 0, // 面积，默认为 0
    price || 0, // 单价，默认为 0
    picture || "", // 房屋图片URL，默认为空字符串
    state || "", // 房屋状态，默认为空字符串
    pageView || 0, // 浏览量，默认为 0
    houseType || "", // 户型，默认为空字符串
    squareMeter || 0, // 平方米数，默认为 0
    district || "", // 区域，默认为空字符串
    phone || "", // 联系电话，默认为空字符串
    developmentArea || 0, // 开发面积，默认为 0
    openingDate || null, // 开盘日期，默认为空字符串
    deliveryDate || null, // 交房日期，默认为空字符串
    decorationStatus || "", // 装修状态，默认为空字符串
    propertyRightsDuration || 0, // 产权年限，默认为 0
    plannedHouseholds || 0, // 规划户数，默认为 0
    parkingRatio || 0, // 车位比，默认为 0
    ownerName || "", // 业主姓名，默认为空字符串
    ownerContact || "", // 业主联系方式，默认为空字符串
    companyName || "", // 开发公司名称，默认为空字符串
    userId,
    floor || "", // 楼层，默认为空字符串
    face || "", // 朝向，默认为空字符串
    propertyMoney || "", // 物业费，默认为空字符串
    lift || "", // 电梯，默认为空字符串
    jsonUrls || "[]", // 图片数组，默认为空数组
  ];
  console.log("sql, values", sql, values);
  sqlSelect(sql, values).then((result) => {
    if (result.affectedRows > 0) {
      res.status(200).json({ message: "新增成功" });
    } else {
      res.status(200).json({ message: "新增失败" });
    }
  });
});
/**
 * @swagger
 * /getHouse:
 *   get:
 *     summary: 获取房屋列表
 *     description: 根据可选的过滤条件查询房屋列表，并返回房屋信息以及对应用户的手机号。
 *     parameters:
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: 区域。
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *         description: 最低价格，用于筛选房屋价格不低于该值的记录。
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *         description: 最高价格，用于筛选房屋价格不高于该值的记录。
 *       - in: query
 *         name: houseType
 *         schema:
 *           type: integer
 *         description: 户型。
 *     responses:
 *       200:
 *         description: 查询成功，返回房屋列表。
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 查询成功
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 房屋ID
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         description: 用户ID
 *                         example: 42
 *                       city:
 *                         type: string
 *                         description: 城市
 *                         example: New York
 *                       price:
 *                         type: number
 *                         description: 价格
 *                         example: 750000
 *                       phone:
 *                         type: string
 *                         description: 用户的手机号
 *                         example: 1234567890
 *       500:
 *         description: 服务器错误
 */
app.get("/getHouse", (req, res) => {
  // 定义一个SQL查询语句，从house表和user表中选择house表中的所有字段和user表中的phone字段，通过userId和id字段进行连接
  const filters = req.query;
  const sql = buildQuery(filters);
  sqlSelect(sql).then((result) => {
    res.status(200).json({ message: "查询成功", data: result });
  });
});
/**
 * @swagger
 * /getHouseDetail:
 *   get:
 *     summary: 获取房产详情
 *     description: 根据房产的 itemId 从数据库中查询详细信息。
 *     tags:
 *       - 房产信息
 *     parameters:
 *       - in: query
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 房产的唯一标识 ID
 *     responses:
 *       200:
 *         description: 查询成功，返回房产详情数据
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 查询成功
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: 'Example House'
 *                       address:
 *                         type: string
 *                         example: '123 Example Street'
 *                       price:
 *                         type: number
 *                         example: 500000
 *                       userId:
 *                         type: integer
 *                         example: 2
 *       400:
 *         description: 缺少必要参数 itemId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 缺少参数 itemId
 *       500:
 *         description: 查询失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 查询失败
 */
app.get("/getHouseDetail", verifyToken, (req, res) => {
  const itemId = req.query.itemId;
  const userId = req.user.userId;

  // 查询房产信息
  const sql = `
    SELECT 
      house.*, 
      users.id AS userId, 
      users.username, 
      users.phone, 
      users.avatar,
      CASE 
        WHEN collections.id IS NOT NULL THEN 1 
        ELSE 0 
      END AS isCollected
    FROM 
      house
    INNER JOIN 
      users 
    ON 
      house.userId = users.id
    LEFT JOIN 
      collections 
    ON 
      collections.item_id = house.id AND collections.user_id = ?
    WHERE 
      house.id = ?
  `;
  
  if (!itemId) {
    return res.status(400).json({ message: "缺少参数 itemId" });
  }

  sqlSelect(sql, [userId, itemId]).then((houseResult) => {
    if (houseResult.length > 0) {
      const houseData = houseResult[0];

      // 查询用户信息
      const userSql = `SELECT username, avatar FROM users WHERE id = ?`;
      sqlSelect(userSql, [houseData.userId]).then((userResult) => {
        if (userResult.length > 0) {
          const userData = userResult[0];

          // 将查询到的用户信息添加到房产数据中
          houseData.username = userData.username;
          houseData.avatar = userData.avatar;

          res.status(200).json({ message: "查询成功", data: houseData });
        } else {
          res.status(404).json({ message: "用户信息不存在" });
        }
      }).catch((err) => {
        console.error("查询用户信息失败:", err);
        res.status(500).json({ message: "服务器错误" });
      });

    } else {
      res.status(404).json({ message: "房产信息不存在" });
    }
  }).catch((err) => {
    console.error("查询房产信息失败:", err);
    res.status(500).json({ message: "服务器错误" });
  });
});

