import type { ProductVariant } from '@medusajs/client-types';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { QuantityInput } from '~/components/quantity-input';
import { Button } from '~/components/ui/button';

import { medusa_cookie } from '~/lib/cookies';
import { addLineItemToCart, createCart, getProduct } from '~/lib/medusa.server';
import { ProductCarousel } from '~/routes/_app.product.$id/product-carousel';
import { ProductVariantsPicker } from '~/routes/_app.product.$id/product-variants-picker';
import { getProductVariants } from '~/routes/_app.product.$id/utils';

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

export default function ProductPage() {
  const { product, currencyCode, countryCode } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentVariant = searchParams.get('variant');
  const currentVariantKey = currentVariant;

  const { title, images, thumbnail, variants, description } = product;
  const productImages = [thumbnail, ...images!.map((img) => img.url)];

  const { productVariants, productVariantsKeys } = getProductVariants(
    variants as unknown as ProductVariant[],
    currencyCode,
    countryCode
  );
  const currentVariantObj =
    productVariants[currentVariantKey as keyof typeof productVariants];
  const currentVariantStock = currentVariantObj?.stocks;

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!searchParams.get('variant')) {
      setSearchParams(
        (prev) => {
          prev.set('variant', productVariantsKeys[0]);
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
    <section className='min-h-[100vh] mt-12 mb-20 w-full px-4 '>
      <div className='grid max-w-5xl md:mt-16 lg:grid-cols-2'>
        <div className='mb-8 '>
          <ProductCarousel
            productImages={productImages as unknown as string[]}
          />
        </div>
        <div>
          <div className='flex flex-col items-center justify-center mb-4'>
            <h1 className='text-slate-800 text-2xl font-bold '>{title}</h1>
            <p className=' text-slate-700 mb-2'>
              {currentVariantStock || 0} pcs in stock
            </p>
            <p className=' text-md mb-4 '>{description}</p>
            <p className='text-slate-800 text-2xl font-bold'>
              {currentVariantObj?.price}
            </p>
          </div>

          <div className='mb-4'>
            <ProductVariantsPicker
              currentVariant={currentVariant || ''}
              productVariants={productVariants}
              productVariantsKeys={productVariantsKeys}
            />
          </div>

          <div className='mb-4'>
            <QuantityInput
              full
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
                className='flex items-center justify-center gap-2 w-full text-lg py-8'>
                Add to Cart
                <img
                  src='/icons/shopping-cart.svg'
                  className='h-4 w-4'
                  alt=''
                />
              </Button>
            </Form>
          </div>
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
