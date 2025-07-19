// backend/routes/pendingTrainer.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { applyAsTrainer, getPendingTrainers, acceptTrainer, rejectTrainer } from '../controllers/pendingTrainer.controller.js';

const router = express.Router();

const upload = multer({ storage });

router.post(
  '/apply',
  protect,
  upload.fields([
    { name: 'identificationDocument', maxCount: 1 },
    { name: 'certificate0', maxCount: 1 },
    { name: 'certificate1', maxCount: 1 },
    { name: 'certificate2', maxCount: 1 },
    { name: 'certificate3', maxCount: 1 },
    { name: 'certificate4', maxCount: 1 },
  ]),
  applyAsTrainer
);

// Admin routes
router.get('/', protect, getPendingTrainers); // Get all pending
router.put('/accept/:pendingTrainerId', protect, acceptTrainer); // Accept
router.delete('/reject/:pendingTrainerId', protect, rejectTrainer); // Reject


export default router;