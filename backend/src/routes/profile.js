import express from 'express';

import { UsersController } from '../controllers';
import { processError } from '../utils';

const router = express.Router();

/**
 * Request for getting profile info
 *
 * @route GET /profile
 * @group Profile
 * @summary Get profile info
 * @returns {UserFull.model} 200
 * @returns {string} 401 - Unauthorized
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.get('/', async (req, res) => {
  try {
    res.json(await UsersController.getById(req.user.id));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for updating profile
 *
 * @route PUT /profile
 * @group Profile
 * @summary Update profile info
 * @param {UserUpdate_Request.model} body.body.required
 * @returns {UserFull.model} 200
 * @returns {string} 401 - Unauthorized
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.put('/', async (req, res) => {
  try {
    res.json(await UsersController.update(req.user, req.user.id, req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for inviting a friend for seeing the profile
 *
 * @route POST /profile/invite-friend
 * @group Profile
 * @summary Invite friend to the profile
 * @param {UserInvite_Request.model} body.body.required
 * @returns {User.model} 200
 * @returns {string} 401 - Unauthorized
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.post('/invite-friend', async (req, res) => {
  try {
    res.json(await UsersController.inviteFriend(req.user, req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for removing the friend from the profile
 *
 * @route DELETE /profile/remove-friend/{id}
 * @group Profile
 * @summary Remove friend
 * @param {string} id.path.required - userId
 * @returns {string} 200 - OK
 * @returns {string} 401 - Unauthorized
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.delete('/remove-friend/:id', async (req, res) => {
  try {
    res.json(await UsersController.removeFriend(req.user, req.params.id));
  } catch (err) {
    processError(err, res);
  }
});

export default router;
