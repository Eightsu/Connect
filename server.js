
// Imports
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

// Declarations
const app = express();
connectDB();

// Initialize Middleware
app.use(express.json({ extended: false }));

// environment Variables
const PORT = process.env.PORT || 5000;


app.get('/', (req, res) => res.send('API RUNNING'));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.info(` coming in hot @ ${PORT}`);
});
