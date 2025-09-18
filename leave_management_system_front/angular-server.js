const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Serve static files from src directory
app.use(express.static(path.join(__dirname, 'src')));

// Serve the main index.html for the Angular app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Handle Angular routing - serve index.html for all routes
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Angular app server running on http://localhost:${PORT}`);
  console.log(`📁 Serving Angular source files from src directory`);
  console.log(`🔗 Backend API: http://localhost:3001`);
  console.log(`🌐 Go to: http://localhost:${PORT} to see your Angular app`);
});
