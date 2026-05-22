import mongoose from 'mongoose';

import {
  PRODUCT_CONDITIONS,
  PRODUCT_CONDITION_COLORS,
  PRODUCT_STATUS,
  PRODUCT_STATUSES,
} from '../domain/productConstants.js';

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    condition: {
      type: String,
      required: true,
      enum: PRODUCT_CONDITIONS,
    },
    status: {
      type: String,
      required: true,
      enum: PRODUCT_STATUSES,
      default: PRODUCT_STATUS.ACTIVE,
      index: true,
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    wallapopUrl: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    closeReason: {
      type: String,
      enum: [PRODUCT_STATUS.SOLD, PRODUCT_STATUS.WITHDRAWN, null],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

productSchema.virtual('conditionColor').get(function conditionColor() {
  return PRODUCT_CONDITION_COLORS[this.condition];
});

productSchema.index({ status: 1, category: 1, brand: 1, platform: 1 });
productSchema.index({ status: 1, createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);
