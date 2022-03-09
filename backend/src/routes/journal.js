import express from 'express';

import { JournalController } from '../controllers';
import { processError, AccessError } from '../utils';

const router = express.Router();

/**
 * Request for getting food entities from journal. Available for admins and users.
 * If user makes request -> returns only his data.
 * If admin -> returns all if 'userId' has not sent.
 *
 * @route GET /journal
 * @group Journal
 * @summary Get food entities from journal
 * @param {string} fromDate.query - Search entities from date
 * @param {string} dueDate.query - Search entities due date
 * @param {string} userId.query - Available only for `admin` role. If sent `ALL` - returns info for all users.
 * @param {number} limit.query - Default: 30
 * @param {number} offset.query - Default: 0
 * @returns {Journal_Search.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.get('/', async (req, res) => {
  try {
    if (req.query.userId && !req.user.isAdmin) throw new AccessError();
    res.json(await JournalController.search(req.user, req.query));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for creating a new food entity in journal.
 * Only `admin` can create a food entity for any user.
 *
 * @route POST /journal
 * @group Journal
 * @summary Create new food entity in journal
 * @param {JournalEntity_Modify_Request.model} body.body.required
 * @returns {JournalEntity.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.post('/', async (req, res) => {
  try {
    res.json(await JournalController.create(req.user, req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for updating existed food entity in journal.
 * Only `admin` can update existed food entity for any user.
 * Owner of existed food entity can update it by himself.
 *
 * @route PUT /journal/{entityId}
 * @group Journal
 * @summary Update existed food entity in journal
 * @param {string} entityId.path.required - entity ID
 * @param {JournalEntity_Modify_Request.model} body.body.required
 * @returns {JournalEntity.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.put('/:entityId', async (req, res) => {
  try {
    res.json(await JournalController.update(req.user, req.params.entityId, req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for deleting existed food entity from journal.
 * Only `admin` can delete existed food entity for any user.
 * Owner of existed food entity can delete it by himself.
 *
 * @route DELETE /journal/{entityId}
 * @group Journal
 * @summary Delete existed food entity from journal
 * @param {string} entityId.path.required - entity ID
 * @returns {string} 200 - OK
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.delete('/:entityId', async (req, res) => {
  try {
    res.json(await JournalController.remove(req.user, req.params.entityId));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for getting statistics of journal. Requires `admin` role.
 *
 * @route GET /journal/statistic
 * @group Journal
 * @summary Get statistic of journal
 * @returns {JournalStatistic.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.get('/statistic', async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new AccessError();
    res.json(await JournalController.getStatistic());
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for getting report from my journal. By default returns data of previous 2 weeks.
 * If `fromDate` and `dueDate` set, data returns for selected period.
 * The response always contains 'today' calories.
 *
 * @route GET /journal/report
 * @group Journal
 * @summary Get report from my journal
 * @param {string} fromDate.query - Search entities from date
 * @param {string} dueDate.query - Search entities due date
 * @returns {Array<JournalReport>} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.get('/report', async (req, res) => {
  try {
    res.json(await JournalController.getMyReport(req.user, req.query));
  } catch (err) {
    processError(err, res);
  }
});


export default router;
