import express from 'express';
import * as settingsController from '../controllers/settings.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All settings routes are ADMIN only
router.use(protect);
router.use(isAdmin);

// Security Thresholds
router.get('/security', settingsController.getSecuritySettings);
router.post('/security', settingsController.updateSecuritySettings);

// Notifications
router.get('/notifications', settingsController.getNotificationSettings);
router.post('/notifications', settingsController.updateNotificationSettings);

// API Keys
router.get('/api-keys', settingsController.getApiKeys);
router.post('/api-keys/rotate', settingsController.rotateApiKey);

// Sectors
router.get('/sectors', settingsController.getSectors);
router.post('/sectors', settingsController.updateSectorStatus);

export default router;
