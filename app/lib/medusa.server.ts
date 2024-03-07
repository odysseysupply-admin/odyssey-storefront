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

// PRODUCTS
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

// REGIONS

// TODO: Change to accept multi region
export const getRegions = async () => {
  const { regions } = await medusa.regions.list();

  if (!regions) {
    throw new Error('Unable to fetch Regions');
  }

  return regions.find((region) => region.currency_code === 'php');
};

// CARTS2

export const createCart = async (regionId: string) => {
  const { cart } = await medusa.carts.create({
    region_id: regionId,
  });

  if (!cart) {
    throw new Error('Unable to create cart');
  }

  return { cartId: cart.id };
};

export const addLineItemToCart = async (
  cartId: string,
  variantId: string,
  quantity: string
) => {
  const { cart } = await medusa.carts.lineItems.create(cartId, {
    variant_id: variantId,
    quantity: Number(quantity),
  });

  if (!cart) {
    throw new Error('Unable to  add items in cart');
  }

  return cart;
};

export const getCart = async (cartId: string) => {
  const { cart } = await medusa.carts.retrieve(cartId);

  if (!cart) {
    throw new Error('Unable to retrieve cart');
  }

  return cart;
};
