import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getSubscriptionDetails,
  subscribeToPackage,
  cancelSubscription,
  changeSubscription,
  getSubscriptionHistory,
  getTrainerSubscriptionTotal,
  getAllTrainersSubscriptionTotals,
  markTrainerPaymentAsPaid,
  getTrainerPaymentHistory
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

// Get total revenue for trainer
router.get('/:id/total-revenue', protect, getTrainerSubscriptionTotal);

// Get total revenue for all trainers
router.get('/all-trainers/revenue', protect, getAllTrainersSubscriptionTotals);

// Get payment history for a trainer
router.get('/:id/payment-history', protect, getTrainerPaymentHistory);

// Mark trainer payment as paid
router.post('/:id/mark-paid', protect, markTrainerPaymentAsPaid);

export default router;

