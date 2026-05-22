import { Router } from 'express';
import mongoose from 'mongoose';

import {
  findActiveProductById,
  getActiveProductMenu,
  listActiveProducts,
} from '../repositories/productRepository.js';

export const publicProductsRouter = Router();

publicProductsRouter.get('/', async (_req, res, next) => {
  try {
    const products = await listActiveProducts();
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

publicProductsRouter.get('/menu', async (_req, res, next) => {
  try {
    const menu = await getActiveProductMenu();
    res.json({ menu });
  } catch (error) {
    next(error);
  }
});

publicProductsRouter.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const product = await findActiveProductById(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});
