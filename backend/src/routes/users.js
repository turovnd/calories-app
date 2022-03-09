import express from 'express';

import { UsersController } from '../controllers';
import { processError, AccessError } from '../utils';

const router = express.Router();

/**
 * Request for searching users. Requires `admin` access.
 *
 * @route GET /users
 * @group Users
 * @summary Search users
 * @param {string} name.query - Search by name or email
 * @param {number} limit.query - Default: 30
 * @param {number} offset.query - Default: 0
 * @returns {User_Search.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.get('/', async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new AccessError();
    res.json(await UsersController.search(req.query));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for getting user by ID. Requires `admin` access.
 *
 * @route GET /users/{id}
 * @group Users
 * @summary Get user by ID
 * @param {string} id.path.required - user ID
 * @returns {UserFull.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.get('/:id', async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new AccessError();
    res.json(await UsersController.getById(req.params.id));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for updating user info. Requires `admin` access.
 *
 * @route PUT /users/{id}
 * @group Users
 * @summary Update user by ID
 * @param {string} id.path.required - user ID
 * @param {UserUpdate_Request.model} body.body.required
 * @returns {UserFull.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.put('/:id', async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new AccessError();
    res.json(await UsersController.update(req.user, req.params.id, req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for deleting user and all his info. Requires `admin` access.
 *
 * @route DELETE /users/{id}
 * @group Users
 * @summary Delete user by ID
 * @param {string} id.path.required - user ID
 * @returns {string} 200 - OK
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.delete('/:id', async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new AccessError();
    res.json(await UsersController.remove(req.params.id));
  } catch (err) {
    processError(err, res);
  }
});

export default router;
