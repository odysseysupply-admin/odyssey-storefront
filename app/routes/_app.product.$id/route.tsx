import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { QuantityInput } from '~/components/quantity-input';
import { Button } from '~/components/ui/button';

import { medusa_cookie } from '~/lib/cookies';
import { addLineItemToCart, createCart, getProduct } from '~/lib/medusa.server';
import { formatAmount } from '~/lib/products';
import { ProductCarousel } from '~/routes/_app.product.$id/product-carousel';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id');

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  if (!productId) {
    throw new Error('Product ID is missing!');
  }

  const product = await getProduct(productId);

  return {
    product,
    currencyCode: cookie.currency_code,
    countryCode: cookie.country_code,
  };
};

//TODO: OPTIONS CURRENTLY HARDCODED
//TODO: PRICE CURRENTLY HARDCODED
//TODO: FIX VARIANTS AUTO

const getStockStatus = (stock: number) => {
  if (stock === 0) return 'SOLD OUT';
  if (stock > 0 && stock <= 10) return 'FEW STOCKS LEFT';
  return `${stock}PCS AVAILABLE STOCKS`;
};

export default function ProductPage() {
  const { product, currencyCode, countryCode } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentVariant = searchParams.get('variant');
  const currentVariantKey =
    currentVariant as keyof typeof productVariantPricingMap;

  const { title, images, thumbnail, variants, description } = product;
  const productImages = [thumbnail, ...images!.map((img) => img.url)];

  console.log(productImages);

  const productVariantPricingMap: {
    [key: string]: {
      variantId: string;
      price: string;
      stocks: number;
      stockStatus: string;
    };
  } = variants.reduce((acc, curr) => {
    const { prices, options, inventory_quantity, id } = curr;
    const { value } = options![0];
    const { amount } = prices.find(
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
  const productVariantPricingMapkeys = Object.keys(productVariantPricingMap);
  const currentVariantObj = productVariantPricingMap[currentVariantKey];
  const currentVariantStock = currentVariantObj?.stocks;

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!searchParams.get('variant')) {
      setSearchParams(
        (prev) => {
          prev.set('variant', productVariantPricingMapkeys[0]);
          return prev;
        },
        {
          preventScrollReset: true,
        }
      );
    }
  }, []);

  if (!searchParams.get('variant')) return <div className='h-[100vh]'></div>;

  return (
    <section className='min-h-[100vh] mb-32 w-full '>
      <div className='grid  max-w-5xl md:mt-16'>
        <ProductCarousel productImages={productImages as unknown as string[]} />
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
          <p>{currentVariantObj?.price}</p>
        </div>

        <div>
          <div>
            <h3>Size</h3>
          </div>
          <div className='flex gap-4'>
            {productVariantPricingMapkeys.map((variant) => (
              <Button
                disabled={
                  productVariantPricingMap[
                    variant as keyof typeof productVariantPricingMap
                  ]?.stocks === 0
                }
                variant={currentVariant === variant ? 'default' : 'outline'}
                className='px-8 py-4 rounded-full'
                key={variant}
                onClick={() => {
                  setSearchParams(
                    (prev) => {
                      prev.set('variant', variant);
                      return prev;
                    },
                    {
                      preventScrollReset: true,
                    }
                  );
                }}>
                {variant}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p>
            Quantity: {currentVariantStock || 0}
            pcs left
          </p>
          <QuantityInput
            quantity={quantity}
            setQuantity={setQuantity}
            variantStock={currentVariantStock}
          />
        </div>

        <div>
          <Form method='POST' onSubmit={() => setQuantity(1)}>
            <input
              hidden
              name='variantId'
              value={currentVariantObj.variantId}
              readOnly
            />
            <input hidden name='quantity' value={quantity} readOnly />
            <Button
              disabled={quantity === 0}
              type='submit'
              variant='default'
              className='flex items-center justify-center gap-2'>
              Add to Cart
              <img src='/icons/shopping-cart.svg' className='h-4 w-4' alt='' />
            </Button>
          </Form>
          <Button variant='secondary'>Buy Now!</Button>
        </div>
      </div>
    </section>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  let cartId = cookie.cart_id;

  if (!cartId) {
    const { cartId: id } = await createCart(cookie.region_id);
    cartId = id;

    cookie.cart_id = id;
  }

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { variantId, quantity } = data as {
    variantId: string;
    quantity: string;
  };

  await addLineItemToCart(cartId, variantId, quantity);

  return json(
    { ok: true },
    {
      headers: {
        'Set-Cookie': await medusa_cookie.serialize(cookie),
      },
    }
  );
};
