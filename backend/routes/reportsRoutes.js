import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getReportsOverview,
  getRevenueTrend,
  getSubscriptionDistribution,
  getSpecialtiesDistribution,
  getTopTrainers,
  getClientDistribution,
  getTrainersList
} from '../controllers/reportsController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get overview statistics
router.get('/overview', getReportsOverview);

// Get revenue trend data
router.get('/revenue-trend', getRevenueTrend);

// Get subscription package distribution
router.get('/subscription-distribution', getSubscriptionDistribution);

// Get trainer specialties distribution
router.get('/specialties-distribution', getSpecialtiesDistribution);

// Get top performing trainers
router.get('/top-trainers', getTopTrainers);

// Get client distribution (new vs returning)
router.get('/client-distribution', getClientDistribution);

// Get list of trainers for filtering
router.get('/trainers', getTrainersList);

export default router;
