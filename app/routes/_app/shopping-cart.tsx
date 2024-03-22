import type { Cart } from '@medusajs/client-types';
import { Link, useFetcher, useLocation } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { formatAmount, sluggifyTitle } from '~/lib/products';
type Props = {
  width?: number;
};

// TODO: Cleanup component move to serparate files

export default function ShoppingCart({ width }: Props) {
  const location = useLocation();
  const inCartRoute = location.pathname.includes('/cart');
  const [open, setOpen] = useState(false);

  const fetcher = useFetcher<{
    cart: Cart;
    currencyCode: string;
    countryCode: string;
  }>();

  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const cartItems =
    fetcher.data?.cart?.items.sort(
      (a, b) =>
        new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
    ) || [];

  const setOpenAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer);
    }

    setOpen(true);
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load('/cart');
    }
  }, [fetcher]);

  // close popover when in /cart and prevents from opening on other routes initially
  useEffect(() => {
    if (inCartRoute) {
      const timer = setTimeout(() => setOpen(false), 2000);
      setActiveTimer(timer);
    }

    return () => clearTimeout(activeTimer);
  }, [inCartRoute]);

  const timedOpen = () => {
    setOpen(true);

    const timer = setTimeout(() => setOpen(false), 3000);

    setActiveTimer(timer);
  };

  const previous = useRef(false);
  // Open popover when there is new item on the cart
  useEffect(() => {
    if (previous.current) {
      timedOpen();
    }

    if (fetcher.data?.cart.items) {
      previous.current = true;
    }
  }, [fetcher.data]);

  return (
    <>
      <div
        onMouseEnter={!inCartRoute ? () => setOpenAndCancel() : () => {}}
        onMouseLeave={!inCartRoute ? () => setOpen(false) : () => {}}>
        <Popover open={open}>
          <PopoverTrigger asChild>
            <Link to='cart'>
              <img
                src='/icons/shopping-cart.svg'
                alt='Shopping Cart Icon'
                width={width}
              />
            </Link>
          </PopoverTrigger>

          <PopoverContent
            className='w-[375px] md:min-w-[450px] overflow-y-auto max-h-[500px] bottom-[-50px]'
            align='end'
            sideOffset={27}>
            {cartItems.length === 0 ? (
              'Empty Cart'
            ) : (
              <div>
                <h2 className='text-xl text-center font-bold mb-4'>Cart</h2>
                <div className='mb-8'>
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className='grid grid-cols-[64px_1fr_100px] md:grid-cols-[100px_1fr_100px] gap-4 mb-8'>
                      <Link
                        to={`/product/${sluggifyTitle(item.title)}?id=${
                          item.variant.product_id
                        }&variant=${item.variant.title}`}>
                        <img
                          src={item.thumbnail}
                          alt=''
                          className='w-[64px] md:w-[95px] h-full object-contain p-2 border border-slate-200 rounded-lg'
                        />
                      </Link>

                      <div className='leading-5'>
                        <p className='font-bold'>{item.title}</p>
                        <p className='text-sm text-slate-700'>
                          Variant: {item.variant.title}
                        </p>
                        <p className='text-sm text-slate-700 mb-[2px]'>
                          Quantity: {item.quantity}
                        </p>
                        <Button
                          size='sm'
                          variant='link'
                          className='items-start gap-1 px-0 h-[20px] text-slate-700'>
                          <img
                            src='/icons/trash-2.svg'
                            alt=''
                            className='h-4 w-4'
                          />
                          Remove
                        </Button>
                      </div>
                      <p className='font-bold text-slate-700'>
                        {formatAmount({
                          countryCode: fetcher.data?.countryCode || 'PH',
                          currencyCode: fetcher.data?.currencyCode || 'php',
                          amount: item.subtotal,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='text-sm mb-4 flex justify-between items-center pr-1'>
                  <p>
                    <span className='font-bold'>Subtotal</span> (excl.taxes)
                  </p>
                  <p>
                    {formatAmount({
                      countryCode: fetcher.data?.countryCode || 'PH',
                      currencyCode: fetcher.data?.currencyCode || 'php',
                      amount: fetcher.data?.cart.subtotal,
                    })}
                  </p>
                </div>
                {!inCartRoute && (
                  <Link to={'/cart'}>
                    <Button className='w-full'>Go to Cart</Button>
                  </Link>
                )}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
