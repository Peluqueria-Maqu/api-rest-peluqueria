// Init router and path
import express from 'express';
const router = express.Router();
import authRoute from './api/auth.route.js';


router.use('/auth', authRoute);
// router.use('/users', userRoute);

export default router;