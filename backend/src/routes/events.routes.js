import express from 'express';
import { ingestEvent, getEventStats } from '../controllers/events.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Allow ingestion from sensors
router.post('/ingest', ingestEvent);
router.get('/stats', authMiddleware, getEventStats);

export default router;
