import Medusa from '@medusajs/medusa-js';

if (!process.env.MEDUSA_BACKEND_URL) {
  throw new Error(
    'Error: Medusa Backend URL environment variable not provided'
  );
}

const medusa = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

export const getProductsList = async () => {
  const { products } = await medusa.products.list({
    currency_code: 'php',
  });

  if (!products) {
    throw new Error('Unable to fetch Product Lists');
  }

  return products;
};

export const getProduct = async (productId: string) => {
  const { product } = await medusa.products.retrieve(productId);

  if (!product) {
    throw new Error('Unable to fetch Product');
  }

  return product;
};

// TODO: Change to accept multi region
export const getRegions = async () => {
  const { regions } = await medusa.regions.list();
  if (!regions) {
    throw new Error('Unable to fetch Regions');
  }

  return regions.find((region) => region.currency_code === 'php');
};
