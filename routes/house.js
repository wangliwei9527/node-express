const {app} = require('../app');
const {sqlSelect} = require('../db');
const {verifyToken,buildQuery} = require('../common');
/**
 * @swagger
 * /house:
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
 *     responses:
 *       200:
 *         description: 成功添加房屋
 */
app.post('/addHouse',verifyToken ,(req, res) => {
  const userId = req.user.id
    console.log(req.body);
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
      companyName
    } = req.body;
    // SQL 插入语句
  const sql = `INSERT INTO house 
  (propertyName, alias, totalPrice, type, heatingMethod, electricityMethod, gasMethod, buildingAddress, salesOfficeAddress, area, price, picture, state, pageView, houseType, squareMeter, district, phone, developmentArea, openingDate, deliveryDate, decorationStatus, propertyRightsDuration, plannedHouseholds, parkingRatio, ownerName, ownerContact, companyName, userId) 
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
];
sqlSelect(sql,values).then((result) => {
    console.log(result)
    if(result.affectedRows > 0){
        res.status(200).json({ message: '新增成功' });
    }else{
        res.status(200).json({ message: '新增失败' });
    }
    
})
});

app.get('/getHouse', (req, res) => {
// 定义一个SQL查询语句，从house表和user表中选择house表中的所有字段和user表中的phone字段，通过userId和id字段进行连接
    const filters =req.query
    const sql = buildQuery(filters)
    sqlSelect(sql).then((result) => {
        res.status(200).json({ message: '查询成功', data: result });
    })
})