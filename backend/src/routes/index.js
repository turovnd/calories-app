import express from 'express';

import { addPassportMiddleware } from '../services/passport';

import AuthRoutes from './auth';
import UsersRoutes from './users';
import ProfileRoutes from './profile';
import ProductsRoutes from './products';
import JournalRoutes from './journal';


// Import common models
import './_swagger';

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/profile', addPassportMiddleware(), ProfileRoutes);
router.use('/users', addPassportMiddleware(), UsersRoutes);
router.use('/products', addPassportMiddleware(), ProductsRoutes);
router.use('/journal', addPassportMiddleware(), JournalRoutes);

export default router;
