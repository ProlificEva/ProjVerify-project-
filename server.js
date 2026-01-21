require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Check for required environment variables
const requiredEnv = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'S3_BUCKET_NAME', 'REGION_S3'];
requiredEnv.forEach(key => {
    if (!process.env[key]) {
        console.error(`CRITICAL ERROR: ${key} is missing from .env!`);
        process.exit(1);
    }
});

const authRoutes = require('./routes/auth'); 
const proposalRoutes = require('./routes/proposal');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/proposals', proposalRoutes);

app.get('/', (req, res) => res.send('ProjVerify Backend is running...'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server is running on port ${PORT}`);
    console.log(`=================================`);
});