import { Router } from 'express';
import { body } from 'express-validator';

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from './handlers/product.js';
import {
  createUpdate,
  deleteUpdate,
  getUpdateById,
  getUpdates,
  updateUpdate,
} from './handlers/update.js';
import { handleInputErrors } from './modules/middlewares.js';

const router = Router();

/**
 * Product
 */

router
  .route('/product')
  .get(getProducts)
  .post(body('name').exists(), handleInputErrors, createProduct);

router
  .route('/product/:id')
  .get(getProductById)
  .put(body('name').exists(), handleInputErrors, updateProduct)
  .delete(deleteProduct);

/**
 * Update
 */
router
  .route('/update')
  .get(getUpdates)
  .post(
    [
      body('title').exists(),
      body('body').exists(),
      body('status').isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']).optional(),
      body('version').optional(),
      body('asset').optional(),
      body('productId').isString(),
    ],
    handleInputErrors,
    createUpdate,
  );

router
  .route('/update/:id')
  .get(getUpdateById)
  .put(
    [
      body('title').optional(),
      body('body').optional(),
      body('status').isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']).optional(),
      body('version').optional(),
      body('asset').optional(),
    ],
    handleInputErrors,
    updateUpdate,
  )
  .delete(deleteUpdate);

/**
 * UpdatePoint
 */
router.get('/updatepoint', () => {});
router.get('/updatepoint/:id', () => {});

router.put(
  '/updatepoint/:id',
  body('name').optional(),
  body('description').optional(),
  handleInputErrors,
  (_req, res) => {
    res.json({ message: 'no errors!' });
  },
);

router.post(
  '/updatepoint',
  body('name').exists(),
  body('description').exists(),
  body('updateId').exists(),
  handleInputErrors,
  (_req, res) => {
    res.json({ message: 'no errors!' });
  },
);

router.delete('/updatepoint/:id', () => {});

export default router;
