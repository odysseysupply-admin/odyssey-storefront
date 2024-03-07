import type { PricedProduct } from '@medusajs/client-types';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { medusa_cookie } from '~/lib/cookies';
import { getProductsList } from '~/lib/medusa.server';
import FAQ from '~/routes/_app._index/faq';
import Hero from '~/routes/_app._index/hero';
import Products from '~/routes/_app._index/products';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const products = await getProductsList();

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  return {
    products,
    currencyCode: cookie.currency_code,
    countryCode: cookie.country_code,
  };
};

// TODO: PRICING FOR SALE!
export default function Home() {
  const { products, currencyCode, countryCode } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />
      <Products
        products={products as unknown as PricedProduct[]}
        currencyCode={currencyCode}
        countryCode={countryCode}
      />
      <FAQ />
    </div>
  );
}
