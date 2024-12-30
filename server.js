const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

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

// Root route to display a message
app.get('/', (req, res) => {
  res.send('Welcome to the RSVP API! Use /api/rsvp to submit RSVPs and /api/rsvps to view the list.');
});

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

// Endpoint to validate user login

const allowedUsers = process.env.ALLOWED_USERS.split(',').map((user) => {
  const [firstName, lastName] = user.split(' ');
  return { firstName, lastName };
});

app.post('/api/login', (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ message: 'Both first name and last name are required!' });
  }

  const user = allowedUsers.find(
    (u) =>
      u.firstName.toLowerCase() === firstName.toLowerCase() &&
      u.lastName.toLowerCase() === lastName.toLowerCase()
  );

  if (user) {
    res.status(200).json({ message: 'Login successful!' });
  } else {
    res.status(401).json({ message: 'Invalid first name or last name.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
