const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 5019;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files (assuming index.html is directly in the root directory)
app.use(express.static(__dirname));

// PostgreSQL database connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'login',
    password: '1412',
    port: 5433,
});

// API endpoint to fetch name by row number
app.get('/names/:row', async (req, res) => {
  const { row } = req.params;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT "Name" FROM "user" OFFSET $1 LIMIT 1', [row - 1]);
    if (result.rows.length > 0) {
      const name = result.rows[0].Name;
      res.send(name);
    } else {
      res.status(404).send('Name not found');
    }
    client.release();
  } catch (err) {
    console.error('Error fetching name from database', err);
    res.status(500).send('Error fetching name');
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
