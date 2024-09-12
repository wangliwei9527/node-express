// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('MySQL connected...');
});

module.exports = db;
