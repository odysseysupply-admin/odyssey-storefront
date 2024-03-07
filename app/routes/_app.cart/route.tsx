import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { medusa_cookie } from '~/lib/cookies';
import { getCart } from '~/lib/medusa.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  if (cookie.cartId) {
    const cart = await getCart(cookie.cartId);
    return { cart };
  }

  return { cart: null };
};

export default function Cart() {
  const { cart } = useLoaderData<typeof loader>();

  console.log('cart', cart);

  if (!cart)
    return (
      <section className='h-[100vh] px-4'>
        <div className='w-full h-full flex flex-col items-center mt-24'>
          <img
            src='/img/empty-cart.svg'
            alt=''
            className='mb-10 max-w-[500px]'
          />
          <div className='mb-4 text-center'>
            <h1 className='font-bold text-2xl tracking-tighter'>
              Your cart is empty :(
            </h1>
            <p>Add something to make me happy :)</p>
          </div>
          <Link to='/#products'>
            <Button
              size={'lg'}
              className='text-xl font-bold flex gap-2 justify-center items-center'>
              Shop Now
              <img src='/icons/shopping-cart.svg' alt='' />
            </Button>
          </Link>
        </div>
      </section>
    );

  return <section className='h-[100vh]'>Cart</section>;
}
