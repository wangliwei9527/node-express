const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;
// 定义一个简单的路由
app.get('/getList', (req, res) => {
  const type = req.query.type
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else{
      res.send(results)
    }
  })
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}
);
