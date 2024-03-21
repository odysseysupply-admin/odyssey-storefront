import type { PricedVariant } from '@medusajs/client-types';
import { formatAmount } from '~/lib/products';

export type ProductVariants = {
  [key: string]: {
    variantId: string;
    price: string;
    stocks: number;
    stockStatus: string;
  };
};

const getStockStatus = (stock: number) => {
  if (stock === 0) return 'SOLD OUT';
  if (stock > 0 && stock <= 10) return 'FEW STOCKS LEFT';
  return `${stock}PCS AVAILABLE STOCKS`;
};

export const getProductVariants = (
  variants: PricedVariant[],
  currencyCode: string,
  countryCode: string
): { productVariants: ProductVariants; productVariantsKeys: string[] } => {
  const productVariants = variants.reduce((acc, curr) => {
    const { prices, options, inventory_quantity, id } = curr;
    const { value } = options![0];
    const { amount } = prices!.find(
      (price) => price.currency_code === currencyCode
    )!;

    return {
      ...acc,
      [value]: {
        variantId: id,
        price: formatAmount({
          countryCode,
          currencyCode,
          amount: amount,
        }),
        stocks: inventory_quantity || 0,
        stockStatus: getStockStatus(inventory_quantity || 0),
      },
    };
  }, {});

  return { productVariants, productVariantsKeys: Object.keys(productVariants) };
};
