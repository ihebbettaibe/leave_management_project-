const express = require('express');
const path = require('path');
const app = express();
const PORT = 3002;

console.log('🚀 Starting Leave Management System Frontend Server...');

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

// Serve static files from root, src, user, and admin directories
app.use(express.static(path.join(__dirname)));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/user', express.static(path.join(__dirname, 'user')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Simple test route
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Leave Management Frontend Server is working!',
    timestamp: new Date().toISOString(),
    backend: 'http://localhost:3001'
  });
});

// Login page - use the public index.html which has login functionality
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registration page - redirect to login page for now
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register.html route
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dashboard page - serve the real dashboard
app.get('/dashboard', (req, res) => {
  console.log('Serving real dashboard page');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Dashboard.html route - serve the same real dashboard
app.get('/dashboard.html', (req, res) => {
  console.log('Serving real dashboard.html');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// User dashboard routes - serve real dashboard
app.get('/user/dashboard', (req, res) => {
  console.log('Serving user dashboard');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/user/dashboard.html', (req, res) => {
  console.log('Serving user dashboard.html');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Admin dashboard routes - serve real dashboard
app.get('/admin/dashboard', (req, res) => {
  console.log('Serving admin dashboard');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin/dashboard.html', (req, res) => {
  console.log('Serving admin dashboard.html');
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Index.html route
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Profile page - serve dedicated profile page
app.get('/profile', (req, res) => {
  console.log('Serving dedicated profile page');
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// Calendar page - serve dedicated calendar page
app.get('/calender', (req, res) => {
  console.log('Serving dedicated calendar page');
  res.sendFile(path.join(__dirname, 'calendar.html'));
});

// Leave requests page - serve dedicated leave requests page
app.get('/leaverequests', (req, res) => {
  console.log('Serving dedicated leave requests page');
  res.sendFile(path.join(__dirname, 'leave-requests.html'));
});

// Approvals page - serve dedicated approvals page
app.get('/approves', (req, res) => {
  console.log('Serving dedicated approvals page');
  res.sendFile(path.join(__dirname, 'approvals.html'));
});

// Main homepage - serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

console.log('✅ Routes configured');

// Handle server startup
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log(`\n🎉 Leave Management System Frontend Server is running!`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 Backend API: http://localhost:3001`);
  console.log(`📋 Available pages:`);
  console.log(`   • Home/Login: http://localhost:${PORT}`);
  console.log(`   • Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(`   • Profile: http://localhost:${PORT}/profile`);
  console.log(`   • Test endpoint: http://localhost:${PORT}/test`);
  console.log(`\n✨ Ready to use!`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Use: taskkill /PID <PID> /F`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});