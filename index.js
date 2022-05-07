const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Server Home Page
app.get('/', async (req, res) => {
    res.send('Hello World');
})

// Server Listen
app.listen(port, () => {
    console.log('Server is running', port);
})