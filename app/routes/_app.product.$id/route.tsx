import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';
import { Input } from '~/components/ui/input';
import { medusa_cookie } from '~/lib/cookies';
import { getProduct } from '~/lib/medusa.server';
import { formatPrice } from '~/lib/products';

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
        price: formatPrice({ countryCode, currencyCode, price: amount / 100 }),
        stocks: inventory_quantity || 0,
        stockStatus: getStockStatus(inventory_quantity || 0),
      },
    };
  }, {});
  const productVariantPricingMapkeys = Object.keys(productVariantPricingMap);
  const currentVariantStock =
    productVariantPricingMap[currentVariantKey]?.stocks;

  const [quantity, setQuantity] = useState(0);

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

  return (
    <section className='min-h-[100vh] mb-32 w-full px-4'>
      <div className='grid  max-w-5xl md:mt-16'>
        <Carousel>
          <CarouselContent className='h-[350px] max-w-[45p] px-4'>
            {productImages.map((imgURL, index) => (
              <CarouselItem key={index}>
                <img
                  src={imgURL!}
                  alt=''
                  className='w-full h-full object-contain md:object-contain'
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div>
          <h1>{title}</h1>
          <p>{description}</p>
          <p>{productVariantPricingMap[currentVariantKey]?.price}</p>
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
          <div className='flex gap-4'>
            <Input
              className='w-32 '
              type='text'
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value);

                if (!newQuantity) {
                  return setQuantity(0);
                }

                setQuantity(() => {
                  if (newQuantity > currentVariantStock)
                    return currentVariantStock;
                  if (newQuantity < 0) return 0;
                  return newQuantity;
                });
              }}
            />
            <div className='flex gap-2'>
              <Button
                className='w-10 text-xl font-bold'
                disabled={quantity === 0}
                onClick={() => {
                  setQuantity((prev) => {
                    if (prev === 0) return prev;
                    return prev - 1;
                  });
                }}>
                -
              </Button>
              <Button
                className='w-10 text-xl font-bold'
                disabled={quantity === currentVariantStock}
                onClick={() => {
                  setQuantity((prev) => {
                    if (prev === currentVariantStock) return prev;
                    return prev + 1;
                  });
                }}>
                +
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Button
            variant='default'
            className='flex items-center justify-center gap-2'>
            Add to Cart
            <img src='/icons/shopping-cart.svg' className='h-4 w-4' alt='' />
          </Button>
          <Button variant='secondary'>Buy Now!</Button>
        </div>
      </div>
    </section>
  );
}
