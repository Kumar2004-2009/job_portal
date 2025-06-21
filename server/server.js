import './config/instrument.js'
import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/db.js";
import * as Sentry from '@sentry/node';
import { clerkWebhook } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import connectCloudinary from "./config/cloudinary.js";
import { clerkMiddleware } from '@clerk/express'


// Initialize Express
const app = express();

// connect to DB
await connectDB();
await connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
    res.send('Hello from server');   
})
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks',clerkWebhook)
app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users',userRoutes)


const PORT =process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});