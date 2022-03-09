import express from 'express';

import { AuthController } from '../controllers';
import { processError } from '../utils';

const router = express.Router();

/**
 * Request for login
 *
 * @route POST /auth/login
 * @group Auth
 * @summary Login
 * @param {Login_Request.model} body.body.required
 * @returns {string} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 */
router.post('/login', async (req, res) => {
  try {
    res.json(await AuthController.login(req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for signup
 *
 * @route POST /auth/signup
 * @group Auth
 * @summary Signup
 * @param {Signup_Request.model} body.body.required
 * @returns {string} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 500 - Server error
 */
router.post('/signup', async (req, res) => {
  try {
    res.json(await AuthController.signup(req.body));
  } catch (err) {
    processError(err, res);
  }
});


export default router;
