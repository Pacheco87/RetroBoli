export const PRODUCT_STATUS = {
  ACTIVE: 'activo',
  SOLD: 'vendido',
  WITHDRAWN: 'retirado',
};

export const PRODUCT_STATUSES = Object.values(PRODUCT_STATUS);

export const PRODUCT_CONDITION = {
  NEW: 'nuevo',
  VERY_GOOD: 'muy bueno',
  GOOD: 'bueno',
  ACCEPTABLE: 'aceptable',
  NEEDS_REVIEW: 'necesita revision',
};

export const PRODUCT_CONDITIONS = Object.values(PRODUCT_CONDITION);

export const PRODUCT_CONDITION_COLORS = {
  [PRODUCT_CONDITION.NEW]: 'green',
  [PRODUCT_CONDITION.VERY_GOOD]: 'blue',
  [PRODUCT_CONDITION.GOOD]: 'lime',
  [PRODUCT_CONDITION.ACCEPTABLE]: 'amber',
  [PRODUCT_CONDITION.NEEDS_REVIEW]: 'red',
};
