import type { Cart, StoreCartsRes } from '@medusajs/client-types';
import Medusa from '@medusajs/medusa-js';
import type { DeliveryInformationType } from '~/lib/types';

if (!process.env.MEDUSA_BACKEND_URL) {
  throw new Error(
    'Error: Medusa Backend URL environment variable not provided'
  );
}

const medusa = new Medusa({
  baseUrl: process.env.MEDUSA_BACKEND_URL,
  maxRetries: 3,
});

// TODO MOVE TO SEPARATE FILES AND FOLDER
// TODO ERROR HANDLING FOR API CALLS

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

export const updateDeliveryInformation = async (
  cartId: string,
  data: DeliveryInformationType
) => {
  const {
    first_name,
    last_name,
    address,
    city,
    province,
    postal_code,
    phone,
    country_code,
    email,
  } = data;
  const { cart } = await medusa.carts.update(cartId, {
    // adds email for guest customer
    // TODO: email for signed up customer
    email,
    shipping_address: {
      first_name,
      last_name,
      address_1: address,
      city,
      country_code,
      province,
      postal_code,
      phone,
    },
    billing_address: {
      first_name,
      last_name,
      address_1: address,
      city,
      country_code,
      province,
      postal_code,
      phone,
    },
  });

  if (!cart) throw new Error('Unable to update delivery information');

  return cart;
};

// LINE ITEM
export const deleteLineItem = async (cartId: string, lineItemId: string) => {
  const { cart } = await medusa.carts.lineItems.delete(cartId, lineItemId);

  if (!cart) {
    throw new Error('Unable to delete line item from cart');
  }

  return cart;
};

export const updateLineItem = async (
  cartId: string,
  lineItemId: string,
  quantity: number
) => {
  const { cart } = await medusa.carts.lineItems.update(cartId, lineItemId, {
    quantity,
  });

  if (!cart) {
    throw new Error('Unable to update line item from cart');
  }

  return cart;
};

// SHIPPING
export const getShippingOptions = async (cartId: string) => {
  const { shipping_options: shippingOptions } =
    await medusa.shippingOptions.listCartOptions(cartId);

  if (!shippingOptions) {
    throw new Error('Unable to get shopping options');
  }

  return shippingOptions;
};

export const addShippingMethod = async (
  cartId: string,
  shippingMethodId: string
) => {
  const { cart } = await medusa.carts.addShippingMethod(cartId, {
    option_id: shippingMethodId,
  });

  if (!cart) {
    throw new Error('Unable to add shopping option');
  }

  await medusa.carts.createPaymentSessions(cart.id);

  return cart;
};

// DISCOUNT CODES
export const addDiscountCode = async (cartId: string, code: string) => {
  const cart = medusa.carts.update(cartId, {
    discounts: [
      {
        code,
      },
    ],
  });

  if (!cart) {
    throw new Error('Unable to apply discount code.');
  }

  return cart;
};

export const removeDiscountCode = async (cartId: string, code: string) => {
  const cart = medusa.carts.deleteDiscount(cartId, code);

  if (!cart) {
    throw new Error('Unable to remove discount code.');
  }

  return cart;
};

// DISCOUNT CODES
export const addGiftCard = async (
  cartId: string,
  code: string,
  codes: { code: string }[]
) => {
  console.log('codes', [...codes, { code }]);
  console.log('codes - 1', [
    {
      code,
    },
    { code },
  ]);
  const cart = medusa.carts.update(cartId, {
    gift_cards: [...codes, { code }],
  });

  if (!cart) {
    throw new Error('Unable to apply gift card.');
  }

  return cart;
};

export const removeGiftCard = async (
  cartId: string,
  code: string,
  codes: { code: string }[]
) => {
  const cart = medusa.carts.update(cartId, {
    gift_cards: codes.filter((c) => c.code !== code),
  });

  if (!cart) {
    throw new Error('Unable to remove discount code.');
  }

  return cart;
};

// PAYMENT INFORMATION
export const addPaymentMethod = async (
  cartId: string,
  paymentProviderId: string
) => {
  const _cart = await medusa.carts.retrieve(cartId);

  console.log('cart', _cart);
  if (_cart.cart?.payment_session) {
    return _cart as unknown as StoreCartsRes;
  }

  const cart = await medusa.carts.setPaymentSession(cartId, {
    provider_id: paymentProviderId,
  });

  if (!cart) {
    throw new Error('Unable to set payment method.');
  }

  return cart;
};

export const updatePaymentSession = async (cartId: string) => {
  const _cart = await getCart(cartId);

  if (_cart?.payment_session?.data?.paymentStatus === 'succeeded') {
    return _cart;
  }

  const cart = await medusa.carts.updatePaymentSession(
    cartId,
    _cart.payment_session.provider_id,
    {
      data: {
        paymentStatus: 'succeeded',
      },
    }
  );

  if (!cart) {
    throw new Error('Unable to update payment session.');
  }

  return cart as unknown as Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

export const completeCart = async (cartId: string) => {
  const data = await medusa.carts.complete(cartId);
  if (!data) {
    throw new Error('Unable to complete cart.');
  }

  return data;
};
