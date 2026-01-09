const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import our routes
const authRoutes = require('./routes/auth'); 

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

app.use('/api/auth', authRoutes);

// Root route for testing
app.get('/', (req, res) => {
    res.send('ProjVerify Backend is running...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});