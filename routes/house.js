const { app } = require("../app");
const { sqlSelect } = require("../db");
const { verifyToken, buildQuery,buildCommentTree } = require("../common");
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
 *               city:
 *                 type: string
 *                 description: 城市
 *               urgent:
 *                 type: boolean
 *                 description: 紧急
 *               home_describe:
 *                 type: string
 *                 description: 描述
 *     responses:
 *       200:
 *         description: 成功添加房屋
 */
app.post("/addHouse", verifyToken, (req, res) => {
  try {
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
      city,
      urgent,
      home_describe
    } = req.body;
    const jsonUrls = JSON.stringify(image_urls || []);
    // SQL 插入语句
    const sql = `INSERT INTO house 
    (propertyName, alias, totalPrice, type, heatingMethod, electricityMethod, gasMethod, buildingAddress, salesOfficeAddress, area, price, picture, state, pageView, houseType, squareMeter, district, phone, developmentArea, openingDate, deliveryDate, decorationStatus, propertyRightsDuration, plannedHouseholds, parkingRatio, ownerName, ownerContact, companyName, userId, floor, face, propertyMoney, lift,image_urls,city,urgent,home_describe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    // 插入的数据
    const values = [
      propertyName || "", 
      alias || "", 
      totalPrice || 0, 
      type || "", 
      heatingMethod || "", 
      electricityMethod || "", 
      gasMethod || "", 
      buildingAddress || "", 
      salesOfficeAddress || "", 
      area || 0, 
      price || 0, 
      picture || "", 
      state || "", 
      pageView || 0, 
      houseType || "", 
      squareMeter || 0, 
      district || "", 
      phone || "", 
      developmentArea || 0, 
      openingDate || null, 
      deliveryDate || null, 
      decorationStatus || "", 
      propertyRightsDuration || 0, 
      plannedHouseholds || 0, 
      parkingRatio || 0, 
      ownerName || "", 
      ownerContact || "", 
      companyName || "", 
      userId,
      floor || "", 
      face || "", 
      propertyMoney || "", 
      lift || "", 
      jsonUrls || "[]", 
      city || "", 
      urgent || false,
      home_describe || ""
    ];
    
    console.log("sql, values", sql, values);
    sqlSelect(sql, values).then((result) => {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "新增成功" });
      } else {
        res.status(200).json({ message: "新增失败" });
      }
    }).catch(error => {
      console.error("新增房屋失败:", error);
      res.status(500).json({ message: "新增失败", error: error.message, api: "/addHouse" });
    });
  } catch (error) {
    console.error("新增房屋处理异常:", error);
    res.status(500).json({ message: "处理请求异常", error: error.message, api: "/addHouse" });
  }
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
  try {
    const filters = req.query;
    // 在查询时添加 is_deleted = 0 条件
    const sql = buildQuery(filters) + " AND is_deleted = 0";
    sqlSelect(sql).then((result) => {
      res.status(200).json({ message: "查询成功", data: result });
    }).catch(error => {
      console.error("获取房屋列表失败:", error);
      res.status(500).json({ message: "查询失败", error: error.message, api: "/getHouse" });
    });
  } catch (error) {
    console.error("获取房屋列表处理异常:", error);
    res.status(500).json({ message: "处理请求异常", error: error.message, api: "/getHouse" });
  }
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
  try {
    const itemId = req.query.itemId;
    // 检查用户是否登录，如果未登录则userId为null
    const userId = req.user ? req.user.userId : null;

    if (!itemId) {
      return res.status(400).json({ message: "缺少参数 itemId", api: "/getHouseDetail" });
    }

    // 修改SQL查询以处理userId为null的情况
    const sql = `
    SELECT 
      house.*, 
      users.id AS userId, 
      users.username, 
      users.phone, 
      users.avatar,
      CASE 
        WHEN ? IS NULL THEN 0 -- 未登录用户始终返回未收藏(0)
        WHEN collections.id IS NOT NULL THEN 1 
        ELSE 0 
      END AS isCollected,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            'commentId', c.commentId,
            'userId', c.userId,
            'commentText', c.commentText,
            'createdAt', c.createdAt,
            'imageUrls', c.imageUrls,
            'parentCommentId', c.parentCommentId,
            'commenter', 
            JSON_OBJECT(
              'username', u.username,
              'avatar', u.avatar,
              'phone', u.phone
            )
          )
        )
        FROM comments c
        JOIN users u ON c.userId = u.id
        WHERE c.houseId = house.id
      ) AS comments
    FROM 
      house
    INNER JOIN 
      users 
    ON 
      house.userId = users.id
    LEFT JOIN 
      collections 
    ON 
      ? IS NOT NULL -- 只有登录用户才检查收藏情况
      AND collections.item_id = house.id 
      AND collections.user_id = ?
    WHERE 
      house.id = ? AND house.is_deleted = 0
    `;

    // 执行查询，注意参数顺序与SQL中的问号一一对应
    sqlSelect(sql, [userId, userId, userId, itemId]).then((houseResult) => {
      if (houseResult.length > 0) {
        const houseData = houseResult[0];
        if(houseData && houseData.comments){
          houseData.commentTree = buildCommentTree(houseData.comments);
        }else{
          houseData.commentTree = [];
        }
        delete houseData.comments;

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
            res.status(404).json({ message: "用户信息不存在", api: "/getHouseDetail" });
          }
        }).catch((err) => {
          console.error("查询用户信息失败:", err);
          res.status(500).json({ message: "服务器错误", error: err.message, api: "/getHouseDetail" });
        });

      } else {
        res.status(404).json({ message: "房产信息不存在", api: "/getHouseDetail" });
      }
    }).catch((err) => {
      console.error("查询房产信息失败:", err);
      res.status(500).json({ message: "查询失败", error: err.message, api: "/getHouseDetail" });
    });
  } catch (error) {
    console.error("获取房屋详情处理异常:", error);
    res.status(500).json({ message: "处理请求异常", error: error.message, api: "/getHouseDetail" });
  }
});
/**
 * @swagger
 * /search:
 *   post:
 *     summary: 房屋信息模糊查询
 *     description: 根据传入的多个可选条件进行房屋信息的模糊查询，返回符合条件的房屋列表。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias:
 *                 type: string
 *                 description: 房屋别名
 *               area:
 *                 type: number
 *                 description: 房屋面积
 *               houseType:
 *                 type: string
 *                 description: 户型
 *               floor:
 *                 type: string
 *                 description: 楼层
 *               face:
 *                 type: string
 *                 description: 朝向
 *               decorationStatus:
 *                 type: string
 *                 description: 装修状态
 *               type:
 *                 type: string
 *                 description: 房屋类型
 *               lift:
 *                 type: string
 *                 description: 电梯
 *               propertyMoney:
 *                 type: string
 *                 description: 物业费
 *               propertyName:
 *                 type: string
 *                 description: 物业名称
 *     responses:
 *       200:
 *         description: 查询成功，返回符合条件的房屋列表。
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
 *                       propertyName:
 *                         type: string
 *                         description: 物业名称
 *                         example: '小区A'
 *                       alias:
 *                         type: string
 *                         description: 房屋别名
 *                         example: '别墅'
 *                       area:
 *                         type: number
 *                         description: 面积
 *                         example: 100.5
 *                       houseType:
 *                         type: string
 *                         description: 户型
 *                         example: '三室一厅'
 *                       floor:
 *                         type: string
 *                         description: 楼层
 *                         example: '2楼'
 *                       face:
 *                         type: string
 *                         description: 朝向
 *                         example: '南'
 *                       decorationStatus:
 *                         type: string
 *                         description: 装修状态
 *                         example: '精装'
 *                       type:
 *                         type: string
 *                         description: 房屋类型
 *                         example: '住宅'
 *                       lift:
 *                         type: string
 *                         description: 电梯
 *                         example: '有'
 *                       propertyMoney:
 *                         type: string
 *                         description: 物业费
 *                         example: '500元/月'
 *       400:
 *         description: 请求失败，缺少至少一个查询条件。
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '至少传一个条件'
 *       500:
 *         description: 服务器错误，查询失败。
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: '数据库查询失败'
 */
app.post('/search', async (req, res) => {
  try {
    const { alias, area, houseType, floor, face, decorationStatus, type, lift, propertyMoney, propertyName } = req.body;

    // 初始化查询条件
    let conditions = [];
    let values = [];

    if (alias) {
      conditions.push("alias LIKE ?");
      values.push(`%${alias}%`);
    }
    if (area) {
      conditions.push("area LIKE ?");
      values.push(`%${area}%`);
    }
    if (houseType) {
      conditions.push("houseType LIKE ?");
      values.push(`%${houseType}%`);
    }
    if (floor) {
      conditions.push("floor LIKE ?");
      values.push(`%${floor}%`);
    }
    if (face) {
      conditions.push("face LIKE ?");
      values.push(`%${face}%`);
    }
    if (decorationStatus) {
      conditions.push("decorationStatus LIKE ?");
      values.push(`%${decorationStatus}%`);
    }
    if (type) {
      conditions.push("type LIKE ?");
      values.push(`%${type}%`);
    }
    if (lift) {
      conditions.push("lift LIKE ?");
      values.push(`%${lift}%`);
    }
    if (propertyMoney) {
      conditions.push("propertyMoney LIKE ?");
      values.push(`%${propertyMoney}%`);
    }
    if (propertyName) {
      conditions.push("propertyName LIKE ?");
      values.push(`%${propertyName}%`);
    }

    // 如果没有任何条件，返回错误
    if (conditions.length === 0) {
      return res.status(400).json({ message: '至少传一个条件', api: "/search" });
    }

    // 构建 SQL 查询
    const sql = `SELECT * FROM house WHERE ${conditions.join(' OR ')} AND is_deleted = 0`;
    
    try {
      // 执行查询
      const results = await sqlSelect(sql, values);
      res.status(200).json({ message: "查询成功", data: results });
    } catch (error) {
      console.error("搜索查询失败:", error);
      res.status(500).json({ message: '查询失败', error: error.message, api: "/search" });
    }
  } catch (error) {
    console.error("搜索处理异常:", error);
    res.status(500).json({ message: '处理请求异常', error: error.message, api: "/search" });
  }
});
app.post('/deleteHouse', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: "缺少参数 id", api: "/deleteHouse" });
    }
    
    const sql = `UPDATE house SET is_deleted = 1 WHERE id = ? AND userId = ?`;
    const result = await sqlSelect(sql, [id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '删除失败，找不到该房屋或无权限', api: "/deleteHouse" });
    } else {
      return res.status(200).json({ message: '删除成功' });
    }
  } catch (error) {
    console.error("删除房屋失败:", error);
    res.status(500).json({ message: '删除失败', error: error.message, api: "/deleteHouse" });
  }
});

// 确保保留原有的deleteHoust接口以向后兼容
app.post('/deleteHoust', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: "缺少参数 id", api: "/deleteHoust" });
    }
    
    const sql = `UPDATE house SET is_deleted = 1 WHERE id = ? AND userId = ?`;
    const result = await sqlSelect(sql, [id, userId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '删除失败，找不到该房屋或无权限', api: "/deleteHoust" });
    } else {
      return res.status(200).json({ message: '删除成功' });
    }
  } catch (error) {
    console.error("删除房屋失败:", error);
    res.status(500).json({ message: '删除失败', error: error.message, api: "/deleteHoust" });
  }
});
app.post('/updateHouse', verifyToken, async (req, res) => {
  try {
    console.log(req.body)
    // 从请求体获取房屋信息
    const {
      id,
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
    
    if (!id) {
      return res.status(400).json({ message: "缺少参数 id", api: "/updateHouse" });
    }
    
    const userId = req.user.userId;
    const jsonUrls = JSON.stringify(image_urls || []); // 将图片数组转为字符串，防止为空

    // 构建 SQL 更新语句
    const sql = `
      UPDATE house SET 
        propertyName = ?, 
        alias = ?, 
        totalPrice = ?, 
        type = ?, 
        heatingMethod = ?, 
        electricityMethod = ?, 
        gasMethod = ?, 
        buildingAddress = ?, 
        salesOfficeAddress = ?, 
        area = ?, 
        price = ?, 
        picture = ?, 
        state = ?, 
        pageView = ?, 
        houseType = ?, 
        squareMeter = ?, 
        district = ?, 
        phone = ?, 
        developmentArea = ?, 
        openingDate = ?, 
        deliveryDate = ?, 
        decorationStatus = ?, 
        propertyRightsDuration = ?, 
        plannedHouseholds = ?, 
        parkingRatio = ?, 
        ownerName = ?, 
        ownerContact = ?, 
        companyName = ?, 
        floor = ?, 
        face = ?, 
        propertyMoney = ?, 
        lift = ?, 
        image_urls = ? 
      WHERE id = ? AND userId = ?
    `;

    const values = [
      propertyName || "", 
      alias || "", 
      totalPrice || 0, 
      type || "", 
      heatingMethod || "", 
      electricityMethod || "", 
      gasMethod || "", 
      buildingAddress || "", 
      salesOfficeAddress || "", 
      area || 0, 
      price || 0, 
      picture || "", 
      state || "", 
      pageView || 0, 
      houseType || "", 
      squareMeter || 0, 
      district || "", 
      phone || "", 
      developmentArea || 0, 
      openingDate || null, 
      deliveryDate || null, 
      decorationStatus || "", 
      propertyRightsDuration || 0, 
      plannedHouseholds || 0, 
      parkingRatio || 0, 
      ownerName || "", 
      ownerContact || "", 
      companyName || "", 
      floor || "", 
      face || "", 
      propertyMoney || "", 
      lift || "", 
      jsonUrls || "[]", 
      id, 
      userId
    ];

    // 执行 SQL 更新操作
    const result = await sqlSelect(sql, values);

    // 如果没有更新任何记录，返回错误信息
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '更新失败，找不到该房屋或无权限', api: "/updateHouse" });
    } else {
      return res.status(200).json({ message: '更新成功' });
    }
  } catch (error) {
    console.error("更新房屋失败:", error);
    res.status(500).json({ message: '更新失败', error: error.message, api: "/updateHouse" });
  }
});

