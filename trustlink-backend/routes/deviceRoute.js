import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { bindDeviceAfterVerification, listDevices, removeDevice } from '../controllers/deviceController.js';

const router = express.Router();
router.get("/", auth, listDevices);
router.delete("/:deviceId", auth, removeDevice);
router.post("/bind", bindDeviceAfterVerification);

export default router;