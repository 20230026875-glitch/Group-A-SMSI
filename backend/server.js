const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());

// 1. I-SERVE ANG FRONTEND FILES
// Kini ang mupakita sa imong CSS, Images, ug JS files gikan sa frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// 2. KONEKSYON SA DATABASE (Aiven Cloud)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false } // Importante ni para sa Aiven connection security
});

db.connect(err => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database (Aiven)");
  }
});

// --- ROUTES ---

// 3. I-SERVE ANG INDEX.HTML SA ROOT PAGE
// Mao ni ang mupuli sa "WOMAN Backend is working"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 4. GET ALL TICKETS
app.get('/api/tickets', (req, res) => {
  const sql = "SELECT * FROM tickets ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result); 
  });
});

// 5. CREATE TICKET
app.post('/api/tickets', (req, res) => {
  const { issue, technician, priority } = req.body;
  const sql = "INSERT INTO tickets (issue, status, technician, priority) VALUES (?, 'Submitted', ?, ?)";
  const values = [issue, technician || 'Unassigned', priority || 'Medium'];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to create ticket" });
    res.json({ success: true, message: "Ticket created!", id: result.insertId });
  });
});

// 6. UPDATE TICKET STATUS
app.post('/api/responses', (req, res) => {
  const { ticketId } = req.body;
  const sql = "UPDATE tickets SET status = 'Resolved' WHERE id = ?";
  db.query(sql, [ticketId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Update failed" });
    res.json({ success: true, message: "Ticket updated!" });
  });
});

// 7. LOGIN VERIFICATION (Verify Access Code)
app.post('/api/verify', (req, res) => {
  const { code } = req.body;
  const sql = "SELECT * FROM users WHERE password = ?";
  db.query(sql, [code], (err, result) => {
    if (err) return res.json({ success: false, message: "Database error" });
    if (result.length > 0) {
      res.json({ success: true, message: "Welcome to SMSI System!" });
    } else {
      res.json({ success: false, message: "Invalid Access Code!" });
    }
  });
});

// Para dili mag-error sa "Page Not Found" inig refresh sa ubang pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Port settings para sa Render (Dapat 0.0.0.0 ang host)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 WOMAN API running on port ${PORT}`);
});
