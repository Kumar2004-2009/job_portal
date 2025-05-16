import './config/instrument.js'
import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/db.js";
import * as Sentry from '@sentry/node';
import { clerkWebhook } from './controllers/webhooks.js';

// Initialize Express
const app = express();

// connect to DB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello from server');   
})
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.post('/webhooks',clerkWebhook)


const PORT =process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port 5000');
});