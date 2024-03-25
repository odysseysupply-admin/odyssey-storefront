import type { Cart, LineItem } from '@medusajs/client-types';
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
import { formatAmount, sluggifyTitle } from '~/lib/products';

type Props = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

export const CartSummaryCheckout = ({ cart }: Props) => {
  const {
    subtotal: subTotal,
    tax_total: taxTotal,
    shipping_total: shippingTotal,
    total,
    region: { name: countryCode, currency_code: currencyCode },
    items,
  } = cart;
  const [applyCode, setApplyCode] = useState(false);
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Cart Details</h2>
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
              amount: subTotal,
            })}
          </p>
        </div>

        <div className='flex justify-between items-center '>
          <p>Shipping</p>
          <p>
            {formatAmount({
              countryCode,
              currencyCode,
              amount: shippingTotal ?? 0,
            })}
          </p>
        </div>

        <div className='flex justify-between items-center '>
          <p>Taxes</p>
          <p>
            {formatAmount({
              countryCode,
              currencyCode,
              amount: taxTotal ?? 0,
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
            amount: total,
          })}
        </p>
      </div>

      {items.map((item) => (
        <CartItem
          item={item as unknown as LineItem}
          countryCode={countryCode}
          currencyCode={currencyCode}
          key={item.id}
        />
      ))}
    </div>
  );
};

type CartItemProps = {
  item: LineItem;
  countryCode: string;
  currencyCode: string;
};
const CartItem = ({ item, currencyCode, countryCode }: CartItemProps) => {
  return (
    <div className='grid grid-cols-[64px_1fr_100px] md:grid-cols-[100px_1fr_100px] gap-4 mb-8'>
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
        <p className='text-sm text-slate-700'>Variant: {item.variant.title}</p>
        <p className='text-sm text-slate-700 mb-[2px]'>
          Quantity: {item.quantity}
        </p>
      </div>
      <p className=' text-slate-700 justify-self-end pr-4'>
        {formatAmount({
          countryCode,
          currencyCode,
          amount: item.subtotal,
        })}
      </p>
    </div>
  );
};
