USE woman_db;

-- insert user (will add login data)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@smsi.com', 'SMSI-2026', 'admin');

-- show data
SELECT * FROM users;
