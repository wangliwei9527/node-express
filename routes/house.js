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
  console.log(req)
  const userId = req.user.id;
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
    image_urls
  } = req.body;
  const jsonUrls = JSON.stringify(image_urls);
  // SQL 插入语句
  const sql = `INSERT INTO house 
  (propertyName, alias, totalPrice, type, heatingMethod, electricityMethod, gasMethod, buildingAddress, salesOfficeAddress, area, price, picture, state, pageView, houseType, squareMeter, district, phone, developmentArea, openingDate, deliveryDate, decorationStatus, propertyRightsDuration, plannedHouseholds, parkingRatio, ownerName, ownerContact, companyName, userId, floor, face, propertyMoney, lift,image_urls) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // 插入的数据
  const values = [
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
    userId,
    floor,
    face,
    propertyMoney,
    lift,
    jsonUrls
  ];
  console.log('sql, values',sql, values)
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
app.get("/getHouseDetail", (req, res) => {
  // 定义一个SQL查询语句，从house表和user表中选择house表中的所有字段和user表中的phone字段，通过userId和id字段进行连接
  const itemId = req.query.itemId;
  const sql = `SELECT * FROM house WHERE id = ${itemId}`;
  sqlSelect(sql).then((result) => {
    res.status(200).json({ message: "查询成功", data: result });
  });
});
