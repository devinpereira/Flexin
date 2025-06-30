import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getUserAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} from "../controllers/addressController.js";

const router = express.Router();

// All address routes require authentication
router.use(protect);

router.get("/", getUserAddresses);
router.get("/:id", getAddress);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);
router.put("/:id/default", setDefaultAddress);

export default router;
