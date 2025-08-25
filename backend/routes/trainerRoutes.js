import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerById,
  getAllTrainers,
  getTrainersForUser,
  addFollower,
  removeFollower,
  addFeedbackToTrainer,
  getMyTrainerProfile,
  updateMyTrainerProfile,
  uploadTrainerPhoto,
} from '../controllers/trainerController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();


// Upload trainer photo to Cloudinary
router.post('/upload-photo', protect, upload.single('photo'), uploadTrainerPhoto);


// Routes for current trainer's profile management
router.get('/my-profile', protect, getMyTrainerProfile);
router.put('/my-profile', protect, updateMyTrainerProfile);

router.get('/my-trainers', protect, getTrainersForUser);
router.post('/add-follower', protect, addFollower);
router.post('/remove-follower', protect, removeFollower);

// Create trainer and get all trainers
router.route('/').post(protect, createTrainer).get(getAllTrainers);

// Get, update, delete trainer by ID
router
  .route('/:id')
  .get(getTrainerById)
  .put(protect, updateTrainer)
  .delete(protect, deleteTrainer);


// Add feedback to trainer
router.post('/:id/feedback', protect, addFeedbackToTrainer);



export default router;