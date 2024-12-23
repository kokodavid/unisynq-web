import express from 'express';
import { verifyWebhook, processWebhook } from '../controllers/webHookController.js';

const router = express.Router();

router.get('/webhook', verifyWebhook);
router.post('/webhook', processWebhook);

export default router;