import type { LineItem } from '@medusajs/client-types';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { medusa_cookie } from '~/lib/cookies';
import { deleteLineItem, getCart, updateLineItem } from '~/lib/medusa.server';
import { CartItem } from '~/routes/_app.cart/cart-item';
import { CartSummary } from '~/routes/_app.cart/cart-summary';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  if (cookie.cart_id) {
    const cart = await getCart(cookie.cart_id);
    return {
      cart,
      countryCode: cookie.country_code,
      currencyCode: cookie.currency_code,
    };
  }

  return {
    cart: null,
    countryCode: cookie.country_code,
    currencyCode: cookie.currency_code,
  };
};

export default function Cart() {
  const { cart, countryCode, currencyCode } = useLoaderData<typeof loader>();

  if (!cart || (cart?.items && cart.items.length === 0))
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

  const { items } = cart;

  return (
    <section className='h-[100vh] max-w-7xl mx-auto'>
      <div className='grid lg:grid-cols-[1fr_360px] mt-24 px-4'>
        <div className='mb-8 lg:mb-0'>
          <h2 className='text-xl font-bold mb-4'>Cart Details</h2>

          <table className='table-auto w-full'>
            <thead className='border-b border-slate-700 '>
              <tr>
                <th className='text-left font-bold text-slate-600 text-xl'>
                  Items
                </th>
                <th className='text-left font-bold text-slate-600 text-xl hidden md:table-cell'>
                  Quantity
                </th>
                <th className='text-left font-bold text-slate-600 text-xl'>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item as unknown as LineItem}
                  currencyCode={currencyCode}
                  countryCode={countryCode}
                />
              ))}
            </tbody>
          </table>
        </div>
        <CartSummary
          subTotal={cart.subtotal}
          taxTotal={cart.tax_total}
          total={cart.total}
          currencyCode={currencyCode}
          countryCode={countryCode}
        />
      </div>
    </section>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  switch (request.method) {
    case 'POST': {
      console.log(data);
      await updateLineItem(
        cookie.cart_id,
        data.lineItemId as string,
        Number(data.quantity)
      );
      return { ok: true };
    }

    case 'DELETE': {
      await deleteLineItem(cookie.cart_id, data.lineItemId as string);
      return { ok: true };
    }
  }
};
