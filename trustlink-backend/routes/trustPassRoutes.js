import express from 'express';
import { generateTrustPassport, verifyTrustPassport } from '../controllers/trustPasscontroller.js';

const router = express.Router();

router.post("/trust/passport/verify", verifyTrustPassport);
export default router;