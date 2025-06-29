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
} from '../controllers/trainerController.js';
import {
  getSubscriptionDetails,
  subscribeToPackage,
  cancelSubscription,
} from '../controllers/trainer.subscription.controller.js';


const router = express.Router();

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


// Get user's subscription details for a trainer
router.get('/:id/subscription', protect, getSubscriptionDetails);

// Subscribe to a package
router.post('/:id/subscribe', protect, subscribeToPackage);

// Cancel subscription
router.post('/:id/unsubscribe', protect, cancelSubscription);

// Add feedback to trainer
router.post('/:id/feedback', protect, addFeedbackToTrainer);



export default router;