/**
 * @typedef Login_Request
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * @typedef Signup_Request
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 */


/**
 * @typedef User
 * @property {string} _id.required
 * @property {string} email.required
 * @property {string} name.required
 * @property {boolean} isAdmin.required
 * @property {string} createdAt.required
 */

/**
 * @typedef UserFull
 * @property {string} _id.required
 * @property {string} email.required
 * @property {string} name.required
 * @property {number} caloriesLimit.required
 * @property {Array<User>} friends.required
 * @property {boolean} isAdmin.required
 * @property {string} createdAt.required
 * @property {string} updatedAt.required
 */

/**
 * @typedef User_Search
 * @property {number} total.required
 * @property {number} limit.required
 * @property {number} offset.required
 * @property {Array<User>} rows.required
 */

/**
 * @typedef UserUpdate_Request
 * @property {string} email
 * @property {string} name
 * @property {number} caloriesLimit
 * @property {boolean} isAdmin - only `admins` can change it
 */

/**
 * @typedef UserInvite_Request
 * @property {string} email.required
 * @property {string} name.required
 */

/**
 * @typedef Product
 * @property {string} _id.required
 * @property {string} name.required
 * @property {User.model} createdBy.required
 * @property {string} createdAt.required
 * @property {string} updatedAt.required
 */

/**
 * @typedef ProductShort
 * @property {string} _id.required
 * @property {string} name.required
 * @property {string} createdAt.required
 * @property {string} updatedAt.required
 */

/**
 * @typedef Products_Search
 * @property {number} total.required
 * @property {number} limit.required
 * @property {number} offset.required
 * @property {Array<Product>} rows.required
 */

/**
 * @typedef ProductModify_Request
 * @property {string} name.required
 */

/**
 * @typedef JournalEntity
 * @property {string} _id.required
 * @property {ProductShort.model} product.required
 * @property {User.model} user.required
 * @property {number} calories.required
 * @property {string} createdAt.required
 * @property {string} updatedAt.required
 */

/**
 * @typedef Journal_Search
 * @property {number} total.required
 * @property {number} limit.required
 * @property {number} offset.required
 * @property {Array<JournalEntity>} rows.required
 */

/**
 * @typedef JournalEntity_Modify_Request
 * @property {string} productId.required
 * @property {number} calories.required
 * @property {string} userId - if set, requires `admin` role.
 * @property {string} createdAt - if set, requires `admin` role.
 */

/**
 * @typedef JournalStatistic
 * @property {number} entriesWeekBefore.required
 * @property {number} entriesCurrentWeek.required
 * @property {number} avgCaloriesCurrentWeek.required
 * @property {number} avgCaloriesWeekBefore.required
 */

/**
 * @typedef JournalReport
 * @property {string} date.required
 * @property {number} calories.required
 */
