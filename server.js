
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
const PORT = process.env.PORT || 3000;


// app.get('/', (req, res) => res.send('API RUNNING'));

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

if (process.env.NODE_ENV === 'production') {
  // Set static folder //! The client folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    // ?  Go from current directory into client/build and load index.
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.info(` coming in hot @ ${PORT}`);
});
