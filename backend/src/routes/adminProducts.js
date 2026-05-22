import { Router } from 'express';
import mongoose from 'mongoose';

import { requireAdmin } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';
import {
  closeProduct,
  createProduct,
  listAdminProducts,
  updateProduct,
} from '../repositories/productRepository.js';
import { closeProductSchema, productPayloadSchema } from '../validation/productSchemas.js';

export const adminProductsRouter = Router();

adminProductsRouter.use(requireAdmin);

adminProductsRouter.get('/', async (_req, res, next) => {
  try {
    const products = await listAdminProducts();
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

adminProductsRouter.post('/', uploadProductImages.array('images'), async (req, res, next) => {
  try {
    const payload = parseProductPayload(req.body, req.files);
    const product = await createProduct(payload);
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
});

adminProductsRouter.put('/:productId', uploadProductImages.array('images'), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const payload = parseProductPayload(req.body, req.files);
    const product = await updateProduct(req.params.productId, payload);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

adminProductsRouter.patch('/:productId/close', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.productId)) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const { status } = closeProductSchema.parse(req.body);
    const product = await closeProduct(req.params.productId, status);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});

function parseProductPayload(body, files = []) {
  const parsed = productPayloadSchema.parse(body);
  const existingImages = parseExistingImages(parsed.existingImages);
  const uploadedImages = files.map((file, index) => ({
    url: `/uploads/${file.filename}`,
    alt: parsed.title,
    sortOrder: existingImages.length + index,
  }));

  return {
    title: parsed.title,
    description: parsed.description,
    price: parsed.price,
    category: parsed.category,
    brand: parsed.brand,
    platform: parsed.platform,
    condition: parsed.condition,
    status: parsed.status,
    wallapopUrl: parsed.wallapopUrl,
    featured: parsed.featured,
    images: [...existingImages, ...uploadedImages],
    closedAt: null,
    closeReason: null,
  };
}

function parseExistingImages(rawValue) {
  if (!rawValue) {
    return [];
  }

  const parsed = JSON.parse(rawValue);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed
    .filter((image) => image && typeof image.url === 'string')
    .map((image, index) => ({
      url: image.url,
      alt: typeof image.alt === 'string' ? image.alt : '',
      sortOrder: index,
    }));
}
