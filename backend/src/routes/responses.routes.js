import express from 'express';
import { executeAction } from '../controllers/responses.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/execute', protect, executeAction);

export default router;
