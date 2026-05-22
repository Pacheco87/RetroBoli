import { PRODUCT_CONDITION_COLORS } from '../domain/productConstants.js';

export function toPublicProduct(product) {
  return {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    brand: product.brand,
    platform: product.platform,
    condition: product.condition,
    conditionColor: PRODUCT_CONDITION_COLORS[product.condition],
    status: product.status,
    images: product.images,
    wallapopUrl: product.wallapopUrl,
    featured: product.featured,
    closedAt: product.closedAt,
    closeReason: product.closeReason,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
