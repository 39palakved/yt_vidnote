const connectToMongo = require('./db');
const express = require('express');
const cors = require("cors");

connectToMongo(); // Pehle MongoDB connect karo

const app = express(); // Phir Express app initialize karo
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
