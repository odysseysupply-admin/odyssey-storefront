import { Link } from '@remix-run/react';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
type Props = {
  width?: number;
};

export default function ShoppingCart({ width }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Link to='cart' className='lg:hidden'>
        <img
          src='/icons/shopping-cart.svg'
          alt='Shopping Cart Icon'
          width={width}
        />
      </Link>
      <div
        className='hidden lg:block'
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}>
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
            align='end'
            className='w-[375px] md:min-w-[450px] min-h-[450px]'>
            <h2 className='text-center font-bold'>Cart</h2>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
