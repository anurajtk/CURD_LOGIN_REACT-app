const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const cors = require('cors');

// Initialize the express app
const app = express();

// Enable CORS for your frontend application (if needed)
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Secret key to sign JWT token
const JWT_SECRET_KEY = 'anuraj-secret-key';  // Change this to a secure key in production

// File path for storing users
const usersFilePath = './src/files/users.json';

// Utility function to read users data from file
const readUsersFromFile = async () => {
  try {
    const data = await fs.readJson(usersFilePath);
    return data;
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

// Utility function to write users data to file
const writeUsersToFile = async (users) => {
  try {
    await fs.writeJson(usersFilePath, users);
  } catch (err) {
    console.error('Error writing users file:', err);
  }
};

// Generate JWT token
function generateToken(username) {
  return jwt.sign({ username }, JWT_SECRET_KEY, { expiresIn: '24h' });  // Token expires in 1 day
}

// Middleware to verify JWT token for protected routes
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'NO_TOKEN_PROVIDED' });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'INVALID_OR_EXPIRED_TOKEN' });
    }

    // Store the decoded user info in request object (you can use it in the next routes)
    req.user = decoded;
    next();
  });
}

// Route to handle login and generate JWT token
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Fetch all users from the JSON file
  const users = await readUsersFromFile();

  // Find the user by username (either email or username)
  const user = users.find(user => user.username === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate a JWT token for the user
  const authToken = generateToken(user.username);

  // Send the token back to the client
  return res.json({
    message: 'Login successful',
    status: 200,
    authToken: authToken
  });
});

// 1. Get all users (Protected route)
app.get('/users', verifyToken, async (req, res) => {
  const users = await readUsersFromFile();
  res.json(users);
});

// 2. Add a new user (Protected route)
app.post('/users', verifyToken, async (req, res) => {
  const { firstName, middleName, lastName, username, password } = req.body;

  // Simple validation
  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = await readUsersFromFile();

  // Generate a new user ID (increment the last ID)
  const newId = (users.length > 0) ? (parseInt(users[users.length - 1].id) + 1).toString() : '1';

  const newUser = {
    id: newId,
    firstName,
    middleName,
    lastName,
    username,
    password
  };

  users.push(newUser);

  // Save updated users to file
  await writeUsersToFile(users);

  res.status(201).json(newUser);
});

// 3. Update an existing user (Protected route)
app.put('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { firstName, middleName, lastName, username, password } = req.body;

  if (!firstName || !lastName || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = await readUsersFromFile();

  // Find the user by ID
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update user
  const updatedUser = {
    ...users[userIndex],
    firstName,
    middleName,
    lastName,
    username,
    password
  };

  users[userIndex] = updatedUser;

  // Save updated users to file
  await writeUsersToFile(users);

  res.json(updatedUser);
});

// 4. Delete a user (Protected route)
app.delete('/users/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  const users = await readUsersFromFile();

  // Find the user by ID
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Remove user from array
  const deletedUser = users.splice(userIndex, 1);

  // Save updated users to file
  await writeUsersToFile(users);

  res.json(deletedUser[0]);
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
