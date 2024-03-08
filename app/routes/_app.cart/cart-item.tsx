import type { LineItem } from '@medusajs/client-types';
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { QuantityInput } from '~/components/quantity-input';
import { Button } from '~/components/ui/button';
import { formatAmount } from '~/lib/products';

type Props = {
  item: LineItem;
  currencyCode: string;
  countryCode: string;
};

const LineItemQuantityInput = ({
  variantStock,
  itemQuantity,
  lineItemId,
}: {
  variantStock: number;
  itemQuantity: number;
  lineItemId: string;
}) => {
  const [quantity, setQuantity] = useState(itemQuantity);
  return (
    <>
      <Form method='DELETE'>
        <input
          type='text'
          hidden
          readOnly
          value={lineItemId}
          name='lineItemId'
        />
        <Button variant='outline' size='sm'>
          <img src='/icons/trash-2.svg' alt='' className='h-4 w-4' />
        </Button>
      </Form>
      <Form method='POST'>
        <input
          type='text'
          hidden
          readOnly
          value={lineItemId}
          name='lineItemId'
        />
        <input type='text' hidden readOnly value={quantity} name='quantity' />
        <QuantityInput
          isReadOnly
          quantity={quantity}
          setQuantity={setQuantity}
          variantStock={variantStock}
        />
      </Form>
    </>
  );
};

export const CartItem = ({ item, currencyCode, countryCode }: Props) => {
  return (
    <tr className='mb-2 border-b border-slate-200 '>
      {/* Item Details */}
      <td className='pr-2 '>
        <div className='p-2 pr-0 flex items-center '>
          <img
            src='/img/shirt1.jpg'
            alt='item thumbnail'
            className='rounded-lg border-[1.5px] w-[64px] h-[64px] md:w-[96px] md:h-[96px] p-1'
          />
          <div className='ml-2 self-start mt-2 tracking-tight flex flex-col justify-center md:self-center leading-none '>
            <p className='text-lg font-bold'>{item.title}</p>
            <p className='text-slate-600'>
              {formatAmount({
                countryCode,
                currencyCode,
                amount: item.unit_price / 100,
              })}
            </p>
            <p className='text-slate-600'>Variant: {item.description}</p>

            <div className='flex gap-2  items-center mt-2 md:flex-row md:hidden'>
              <LineItemQuantityInput
                variantStock={item?.variant?.inventory_quantity || 0}
                itemQuantity={item.quantity}
                lineItemId={item.id}
              />
            </div>
          </div>
          <p></p>
        </div>
      </td>

      {/* Item Quantity */}
      <td className='pr-2 hidden md:table-cell'>
        <div className='flex gap-2 items-center '>
          <LineItemQuantityInput
            variantStock={item?.variant?.inventory_quantity || 0}
            itemQuantity={item.quantity}
            lineItemId={item.id}
          />
        </div>
      </td>

      {/* Total */}
      <td className='pr-2'>
        {formatAmount({
          countryCode,
          currencyCode,
          amount: (item.subtotal || 0) / 100,
        })}
      </td>
    </tr>
  );
};
