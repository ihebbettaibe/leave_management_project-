const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

console.log('Starting server setup...');

// Error handling for the app
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).send('Something broke!');
});

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

console.log('CORS setup complete...');

// Log static file serving
const staticPath = path.join(__dirname, 'src');
console.log('Static path:', staticPath);
app.use(express.static(staticPath));

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Serve the main index.html for the Angular app
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

// Handle Angular routing - serve index.html for all routes
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

console.log('Routes setup complete...');

// Handle server startup errors
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`✅ Angular app server running on http://localhost:${PORT}`);
  console.log(`📁 Serving Angular source files from src directory`);
  console.log(`🔗 Backend API: http://localhost:3001`);
  console.log(`🌐 Go to: http://localhost:${PORT} to see your Angular app`);
  console.log('Server is ready and listening...');
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the process using this port or use a different port.`);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Graceful shutdown...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

console.log('Server setup complete, attempting to start...');