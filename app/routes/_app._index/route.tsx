import type { PricedProduct } from '@medusajs/client-types';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { medusa_cookie } from '~/lib/cookies';
import { getProductsList, getRegions } from '~/lib/medusa.server';
import FAQ from '~/routes/_app._index/faq';
import Hero from '~/routes/_app._index/hero';
import Products from '~/routes/_app._index/products';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const products = await getProductsList();
  const regions = await getRegions();

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  return json(
    {
      products,
      currencyCode: cookie.currency_code,
      countryCode: cookie.country_code,
    },
    {
      headers: {
        'Set-Cookie': await medusa_cookie.serialize({
          region_id: regions?.id,
          currency_code: regions?.currency_code,
          country_code: regions?.name,
        }),
      },
    }
  );
};

export default function Home() {
  const { products, currencyCode, countryCode } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />
      <Products
        products={products as PricedProduct[]}
        currencyCode={currencyCode}
        countryCode={countryCode}
      />
      <FAQ />
    </div>
  );
}
