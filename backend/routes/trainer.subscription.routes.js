import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getSubscriptionDetails,
  subscribeToPackage,
  cancelSubscription,
  changeSubscription,
  getSubscriptionHistory
} from '../controllers/trainer.subscription.controller.js';

const router = express.Router();

// Get user's subscription details for a trainer
router.get('/:id', protect, getSubscriptionDetails);

// Subscribe to a package
router.post('/:id', protect, subscribeToPackage);

// Cancel subscription
router.delete('/:id', protect, cancelSubscription);

// Change subscription package
router.put('/:id', protect, changeSubscription);

// Get subscription history
router.get('/:id/history', protect, getSubscriptionHistory);

export default router;

