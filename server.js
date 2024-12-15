const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Mock database file
const DATA_FILE = './database.json';

// Helper functions to read/write the database
const readDatabase = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeDatabase = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// API to submit RSVP
app.post('/api/rsvp', (req, res) => {
  const { name, email, attendance } = req.body;

  if (!name || !email || !attendance) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  const database = readDatabase();
  database.rsvps.push({ name, email, attendance });
  writeDatabase(database);

  res.status(200).json({ message: 'RSVP submitted successfully!' });
});

// API to get all RSVPs
app.get('/api/rsvps', (req, res) => {
  const database = readDatabase();
  res.status(200).json(database.rsvps);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
