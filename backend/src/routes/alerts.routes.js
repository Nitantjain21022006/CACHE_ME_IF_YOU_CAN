import express from 'express';
import { getAlerts, getAlertById, resolveAlert } from '../controllers/alerts.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAlerts);
router.get('/:id', authMiddleware, getAlertById);
router.patch('/:id/resolve', authMiddleware, resolveAlert);

export default router;
