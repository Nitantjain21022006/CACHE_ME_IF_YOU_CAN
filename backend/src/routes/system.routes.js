import express from 'express';
import { getSystemMetrics } from '../controllers/system.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/metrics', protect, getSystemMetrics);

export default router;
