import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import { getProduct } from '~/lib/medusa.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id');

  if (!productId) {
    throw new Error('Product ID is missing!');
  }

  const product = await getProduct(productId);

  return { product };
};

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();

  console.log('product', product);

  const { id } = useParams();

  return (
    <section className='min-h-[100vh]'>This is the product page: {id}</section>
  );
}
