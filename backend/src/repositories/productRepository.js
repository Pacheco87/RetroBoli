import { Product } from '../models/Product.js';
import { PRODUCT_STATUS } from '../domain/productConstants.js';
import { toPublicProduct } from '../presenters/productPresenter.js';

const publicProductProjection = {
  title: 1,
  description: 1,
  price: 1,
  category: 1,
  brand: 1,
  platform: 1,
  condition: 1,
  status: 1,
  images: 1,
  wallapopUrl: 1,
  featured: 1,
  createdAt: 1,
  updatedAt: 1,
};

export async function listActiveProducts() {
  const products = await Product.find({ status: PRODUCT_STATUS.ACTIVE }, publicProductProjection)
    .sort({ featured: -1, createdAt: -1 })
    .lean();

  return products.map(toPublicProduct);
}

export async function findActiveProductById(productId) {
  const product = await Product.findOne(
    {
      _id: productId,
      status: PRODUCT_STATUS.ACTIVE,
    },
    publicProductProjection,
  ).lean();

  return product ? toPublicProduct(product) : null;
}

export async function getActiveProductMenu() {
  const products = await Product.find(
    { status: PRODUCT_STATUS.ACTIVE },
    {
      title: 1,
      category: 1,
      brand: 1,
      platform: 1,
    },
  )
    .sort({ category: 1, platform: 1, title: 1 })
    .lean();

  const categories = new Map();

  for (const product of products) {
    const category = upsertGroup(categories, product.category);
    const brand = upsertGroup(category.brands, product.brand);
    const platform = upsertGroup(brand.platforms, product.platform);

    platform.products.push({
      id: product._id.toString(),
      title: product.title,
    });
  }

  return Array.from(categories.values()).map((category) => ({
    label: category.label,
    brands: Array.from(category.brands.values()).map((brand) => ({
      label: brand.label,
      platforms: Array.from(brand.platforms.values()).map((platform) => ({
        label: platform.label,
        products: platform.products,
      })),
    })),
  }));
}

function upsertGroup(map, label) {
  if (!map.has(label)) {
    map.set(label, {
      label,
      brands: new Map(),
      platforms: new Map(),
      products: [],
    });
  }

  return map.get(label);
}
