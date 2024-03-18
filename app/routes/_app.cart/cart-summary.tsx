import { Link } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { formatAmount } from '~/lib/products';

type Props = {
  subTotal?: number;
  taxTotal?: number | null;
  total?: number;
  countryCode: string;
  currencyCode: string;
};

export const CartSummary = ({
  subTotal = 0,
  taxTotal = 0,
  total = 0,
  currencyCode,
  countryCode,
}: Props) => {
  const [applyCode, setApplyCode] = useState(false);
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Summary</h2>
      <div className='border-b border-slate-200 pb-4 px-4 mb-4'>
        <div className='flex items-center mb-2 gap-2'>
          <Button
            variant='link'
            className='text-blue-600 text-md p-0'
            onClick={() => setApplyCode(!applyCode)}>
            Add gift card or discount code
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='bg-slate-400 rounded-full'>
                <img
                  src='/icons/info.svg'
                  alt='more info for gift card and discount codes'
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-slate-600'>
                  You can add multiple gift cards, <br />
                  but only one discount code.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {applyCode && (
          <div className='flex gap-2'>
            <Input className='bg-slate-100' />
            <Button variant='secondary' className='shadow-sm'>
              Apply
            </Button>
          </div>
        )}
      </div>

      <div className='flex flex-col gap-2 px-4 text-slate-600 border-b border-slate-200 pb-2 mb-2'>
        <div className='flex justify-between items-center '>
          <div className='flex items-center gap-2 '>
            <p>Subtotal</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className='bg-slate-400 rounded-full'>
                  <img
                    src='/icons/info.svg'
                    alt='more info for gift card and discount codes'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cart total excluding shipping and taxes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p>
            {formatAmount({
              countryCode,
              currencyCode,
              amount: subTotal / 100,
            })}
          </p>
        </div>

        {/* <div className='flex justify-between items-center '>
          <p>Shipping</p>

          <p>1000</p>
        </div> */}

        <div className='flex justify-between items-center '>
          <p>Taxes</p>
          <p>
            {formatAmount({
              countryCode,
              currencyCode,
              amount: (taxTotal ?? 0) / 100,
            })}
          </p>
        </div>
      </div>

      <div className='flex justify-between items-center px-4 font-semibold py-4 border-b border-slate-200 mb-4'>
        <h3 className=''>Total</h3>
        <p className=''>
          {formatAmount({
            countryCode,
            currencyCode,
            amount: total / 100,
          })}
        </p>
      </div>

      <Link to='/checkout'>
        <Button className='w-full'>Go to checkout</Button>
      </Link>
    </div>
  );
};
