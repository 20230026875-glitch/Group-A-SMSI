const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Gi-enable ang CORS aron makakonektar ang imong website sa server
app.use(cors()); 
app.use(express.json());

// Koneksyon sa Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "S3rv3r!Lock$992",
  database: "woman_db"
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Test Route para masiguro nga nag-andar ang server
app.get('/', (req, res) => {
  res.send('Backend is working');
});

// Route para sa Login Verification
app.post('/api/verify', (req, res) => {
  const { code } = req.body;

  const sql = "SELECT * FROM users WHERE password = ?";

  db.query(sql, [code], (err, result) => {
    if (err) {
      return res.json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      // Kung sakto ang code
      res.json({ success: true, message: "Welcome to SMSI System!" });
    } else {
      // Kung sayop ang code
      res.json({ success: false, message: "Invalid Access Code!" });
    }
  });
});

// Port settings
app.listen(5000, () => {
  console.log("API running at http://localhost:5000");
});
