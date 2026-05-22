import '../config/env.js';

import mongoose from 'mongoose';

import { connectDatabase } from '../config/database.js';
import { PRODUCT_CONDITION, PRODUCT_STATUS } from '../domain/productConstants.js';
import { Product } from '../models/Product.js';

const categories = [
  {
    category: 'Juegos',
    brand: 'Sega',
    platforms: ['MegaDrive', 'Dreamcast', 'Master System'],
    names: ['Sonic', 'Streets of Rage', 'Golden Axe', 'Mega Man', 'Shinobi'],
  },
  {
    category: 'Juegos',
    brand: 'Nintendo',
    platforms: ['Super Nintendo', 'Nintendo 64', 'Game Boy', 'Nintendo Switch'],
    names: ['Mario Kart', 'Zelda', 'Metroid', 'Pokemon', 'Donkey Kong'],
  },
  {
    category: 'Consolas',
    brand: 'Sony',
    platforms: ['PlayStation', 'PlayStation 2', 'PSP'],
    names: ['Consola Fat', 'Consola Slim', 'Memory Pack', 'DualShock', 'Starter Set'],
  },
  {
    category: 'Accesorios',
    brand: 'Microsoft',
    platforms: ['Xbox', 'Xbox 360', 'Xbox One'],
    names: ['Mando Original', 'Cable AV', 'Disco Duro', 'Adaptador', 'Kit Online'],
  },
  {
    category: 'Merchandising',
    brand: 'Nintendo',
    platforms: ['Mario', 'Zelda', 'Pokemon'],
    names: ['Figura', 'Poster', 'Llavero', 'Guia', 'Caja Metalica'],
  },
];

const conditions = Object.values(PRODUCT_CONDITION);

function buildProduct(index) {
  const group = categories[index % categories.length];
  const platform = group.platforms[index % group.platforms.length];
  const baseName = group.names[index % group.names.length];
  const status = index % 10 === 0 ? PRODUCT_STATUS.SOLD : index % 15 === 0 ? PRODUCT_STATUS.WITHDRAWN : PRODUCT_STATUS.ACTIVE;
  const condition = conditions[index % conditions.length];
  const title = `${baseName} ${platform} #${String(index + 1).padStart(2, '0')}`;

  return {
    title,
    description: `Producto de prueba RetroBoli para validar catalogo, detalle, menu dinamico y administracion. ${title} incluye datos basicos y enlace de compra simulado.`,
    price: Number((12.95 + index * 3.75).toFixed(2)),
    category: group.category,
    brand: group.brand,
    platform,
    condition,
    status,
    images: [
      {
        url: '/logo-retroboli.jpg',
        alt: title,
        sortOrder: 0,
      },
    ],
    wallapopUrl: 'https://es.wallapop.com/',
    featured: status === PRODUCT_STATUS.ACTIVE && index % 7 === 0,
    closedAt: status === PRODUCT_STATUS.ACTIVE ? null : new Date(),
    closeReason: status === PRODUCT_STATUS.ACTIVE ? null : status,
  };
}

await connectDatabase();
await Product.deleteMany({
  description: /^Producto de prueba RetroBoli/,
});

const products = Array.from({ length: 50 }, (_item, index) => buildProduct(index));
await Product.insertMany(products);

const activeCount = products.filter((product) => product.status === PRODUCT_STATUS.ACTIVE).length;
const featuredCount = products.filter((product) => product.featured).length;

await mongoose.disconnect();

console.log(`Seed completed: ${products.length} products (${activeCount} active, ${featuredCount} featured).`);
