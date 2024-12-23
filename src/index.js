import 'dotenv/config';
import express from 'express';
import webhookRoutes from './routes/webHookRoutes.js';
import { sendClassConfirmations } from './services/messageHandler.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', webhookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  sendClassConfirmations();
});