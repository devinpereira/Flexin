// backend/routes/pendingTrainer.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import { applyAsTrainer, getPendingTrainers } from '../controllers/pendingTrainer.controller.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post(
  '/apply',
  protect,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'identificationDocument', maxCount: 1 },
    { name: 'certificate0', maxCount: 1 },
    { name: 'certificate1', maxCount: 1 },
    { name: 'certificate2', maxCount: 1 },
    { name: 'certificate3', maxCount: 1 },
    { name: 'certificate4', maxCount: 1 },
  ]),
  applyAsTrainer
);

router.get('/pending', protect, getPendingTrainers);

export default router;