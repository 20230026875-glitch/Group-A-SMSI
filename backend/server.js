const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middlewares
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
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL (woman_db)");
  }
});

// --- ROUTES ---

// 1. TEST ROUTE
app.get('/', (req, res) => {
  res.send('WOMAN Backend is working');
});

// 2. GET ALL TICKETS (Para sa Dashboard ug Logs)
app.get('/api/tickets', (req, res) => {
  const sql = "SELECT * FROM tickets ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) {
      console.log("Error fetching tickets:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result); 
  });
});

// 3. CREATE TICKET (Legacy Encoding - Automated)
app.post('/api/tickets', (req, res) => {
  const { issue, technician, priority } = req.body;
  const sql = "INSERT INTO tickets (issue, status, technician, priority) VALUES (?, 'Submitted', ?, ?)";
  
  const values = [
    issue, 
    technician || 'Unassigned',
    priority || 'Medium'
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating ticket:", err);
      return res.status(500).json({ error: "Failed to create ticket" });
    }
    res.json({ success: true, message: "Ticket created!", id: result.insertId });
  });
});

// 4. UPDATE TICKET STATUS (Response Panel)
app.post('/api/responses', (req, res) => {
  const { ticketId, message } = req.body;
  // Gi-update nato ang status ngadto sa 'Resolved' inig submit sa response
  const sql = "UPDATE tickets SET status = 'Resolved' WHERE id = ?";
  
  db.query(sql, [ticketId], (err, result) => {
    if (err) {
      console.error("Update failed:", err);
      return res.status(500).json({ success: false, message: "Update failed" });
    }
    res.json({ success: true, message: "Ticket updated and response logged!" });
  });
});

// 5. LOGIN VERIFICATION
app.post('/api/verify', (req, res) => {
  const { code } = req.body;
  const sql = "SELECT * FROM users WHERE password = ?";
  db.query(sql, [code], (err, result) => {
    if (err) {
      return res.json({ success: false, message: "Database error" });
    }
    if (result.length > 0) {
      res.json({ success: true, message: "Welcome to SMSI System!" });
    } else {
      res.json({ success: false, message: "Invalid Access Code!" });
    }
  });
});

// Port settings
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 WOMAN API running on port ${PORT}`);
});
