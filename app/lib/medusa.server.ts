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
    fields: 'title,thumbnail',
    currency_code: 'php',
  });

  if (!products) {
    throw new Error('Unable to fetch Product Lists');
  }

  return products;
};
