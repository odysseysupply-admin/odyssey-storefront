import type { PricedProduct } from '@medusajs/client-types';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { medusa_cookie } from '~/lib/cookies';
import { getProductsList, getRegions } from '~/lib/medusa.server';
import FAQ from '~/routes/_app._index/faq';
import Hero from '~/routes/_app._index/hero';
import Products from '~/routes/_app._index/products';

export const loader = async () => {
  const products = await getProductsList();
  const regions = await getRegions();

  return json(
    {
      products,
    },
    {
      headers: {
        'Set-Cookie': await medusa_cookie.serialize(regions?.id),
      },
    }
  );
};

export default function Home() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />
      <Products products={products as PricedProduct[]} />
      <FAQ />
    </div>
  );
}
