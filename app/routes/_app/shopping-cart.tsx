import type { Cart } from '@medusajs/client-types';
import { Link, useFetcher, useLocation } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
type Props = {
  width?: number;
};

export default function ShoppingCart({ width }: Props) {
  const location = useLocation();
  const inCartRoute = location.pathname.includes('/cart');
  const [open, setOpen] = useState(false);

  const fetcher = useFetcher<{ cart: Cart }>();

  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(
    undefined
  );
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

    const timer = setTimeout(() => setOpen(false), 2000);

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
        onMouseEnter={!inCartRoute ? () => setOpen(true) : () => {}}
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
            className='w-[375px] md:min-w-[450px] min-h-[450px]'
            align='end'>
            <h2 className='text-center font-bold'>Cart</h2>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
