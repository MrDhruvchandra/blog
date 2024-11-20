import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { postRoutes } from './routes/posts.js';
import bodyParser from'body-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Increase limit for JSON bodies
app.use(bodyParser.json({ limit: '50mb' }));

// Increase limit for URL-encoded bodies
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI )
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});