import express from 'express';

import { ProductsController } from '../controllers';
import { processError, AccessError } from '../utils';

const router = express.Router();

/**
 * Request for searching products
 *
 * @route GET /products
 * @group Products
 * @summary Search products
 * @param {string} name.query - Search by name
 * @param {boolean} onlyMy.query - Return only my products. If false -> returns all
 * @param {number} limit.query - Default: 30
 * @param {number} offset.query - Default: 0
 * @returns {Products_Search.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.get('/', async (req, res) => {
  try {
    res.json(await ProductsController.search(req.user, req.query));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for creating new product.
 *
 * @route POST /products
 * @group Products
 * @summary Create new product
 * @param {ProductModify_Request.model} body.body.required
 * @returns {Product.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.post('/', async (req, res) => {
  try {
    res.json(await ProductsController.create(req.user, req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for updating product by ID. Requires `admin` access.
 *
 * @route PUT /products/{productId}
 * @group Products
 * @summary Update product by ID
 * @param {string} productId.path.required - productId
 * @param {ProductModify_Request.model} body.body.required
 * @returns {Product.model} 200
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.put('/:productId', async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new AccessError();
    res.json(await ProductsController.update(req.params.productId, req.body));
  } catch (err) {
    processError(err, res);
  }
});

/**
 * Request for deleting product and all entities below it. Requires `admin` access.
 *
 * @route DELETE /products/{productId}
 * @group Products
 * @summary Delete product by ID
 * @param {string} productId.path.required - product ID
 * @returns {string} 200 - OK
 * @returns {string} 400 - Bad request
 * @returns {string} 401 - Unauthorized
 * @returns {string} 403 - You have not access
 * @returns {string} 404 - Not found
 * @returns {string} 500 - Server error
 * @security JWT
 */
router.delete('/:productId', async (req, res) => {
  try {
    if (!req.user.isAdmin) throw new AccessError();
    res.json(await ProductsController.remove(req.params.productId));
  } catch (err) {
    processError(err, res);
  }
});

export default router;
