import type { ProductVariant } from '@medusajs/client-types';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ButtonLoadingSpinner } from '~/components/button-loading-spinner';
import { QuantityInput } from '~/components/quantity-input';
import { Button } from '~/components/ui/button';

import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
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

// TODO: INVENTORY NOT SYNCING WITH ITEMS IN CART
export const VariantStatus = ({ stocks }: { stocks: number }) => {
  if (stocks <= 10)
    return <p className='text-red-600 mb-2'>FEW STOCKS LEFT!!!</p>;

  return <p className='text-slate-700 mb-2'>{stocks} pcs left</p>;
};

export default function ProductPage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formAction?.includes('/product');

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
    <section className=' mt-12 mb-32 w-full px-4 '>
      <div className='grid max-w-7xl md:mt-16 lg:grid-cols-[1fr_450px] lg:gap-16 lg:mx-auto'>
        <div className='mb-12 link'>
          <ProductCarousel
            productImages={productImages as unknown as string[]}
          />
        </div>
        <div className='flex flex-col md:max-w-[450px] mx-auto'>
          <div className='flex flex-col items-center justify-center lg:items-start mb-4'>
            <h1 className='text-slate-800 text-2xl font-bold '>{title}</h1>
            <VariantStatus stocks={currentVariantStock || 0} />

            <p className=' text-md mb-4 '>{description}</p>
            <p className='text-slate-800 text-2xl font-bold'>
              {currentVariantObj?.price}
            </p>
          </div>

          <div className='mb-2'>
            <ProductVariantsPicker
              currentVariant={currentVariant || ''}
              productVariants={productVariants}
              productVariantsKeys={productVariantsKeys}
            />
          </div>

          <div className='mb-4'>
            <Sheet>
              <SheetTrigger>
                <p className='text-sm underline'>Size Chart</p>
              </SheetTrigger>
              <SheetContent className='flex items-center md:w-[500px]'>
                <img src='/img/size-chart.jpg' alt='size chart guide' />
              </SheetContent>
            </Sheet>
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
              <fieldset disabled={isSubmitting}></fieldset>
              <input
                hidden
                name='variantId'
                value={currentVariantObj.variantId}
                readOnly
              />
              <input hidden name='quantity' value={quantity} readOnly />
              <Button
                disabled={quantity === 0 || isSubmitting}
                type='submit'
                variant='default'
                className='flex items-center justify-center gap-2 w-full text-lg py-8'>
                {isSubmitting ? (
                  <ButtonLoadingSpinner />
                ) : (
                  <>
                    Add to Cart
                    <img
                      src='/icons/shopping-cart.svg'
                      className='h-4 w-4'
                      alt=''
                    />
                  </>
                )}
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
