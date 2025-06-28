import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getTrainerById,
  getAllTrainers,
} from '../controllers/trainerController.js';
import {
  getSubscriptionDetails,
  subscribeToPackage,
  cancelSubscription,
} from '../controllers/trainer.subscription.controller.js';


const router = express.Router();

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


export default router;