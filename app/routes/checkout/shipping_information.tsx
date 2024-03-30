import type {
  Cart,
  PricedShippingOption,
  ShippingMethod,
} from '@medusajs/client-types';
import { Form, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { formatAmount } from '~/lib/products';
import { STEPS } from '~/routes/checkout/utils';

export type Props = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
  shippingOptions: PricedShippingOption[];
  showForm: boolean;
  paymentComplete: boolean;
};

export function ShippingInformation({
  cart,
  shippingOptions,
  showForm,
  paymentComplete,
}: Props) {
  const {
    region: { name: countryCode, currency_code: currencyCode },
    shipping_methods: shippingMethod,
  } = cart;

  const defaultShippingMethod =
    shippingMethod[0] ??
    ({ shipping_option: { name: '', amount: 0 } } as Partial<ShippingMethod>);

  const {
    shipping_option: { name, amount },
  } = defaultShippingMethod;

  const [selectedOption, setSelectedOption] = useState(
    Boolean(defaultShippingMethod?.shipping_option_id)
  );

  const [, setSearchParams] = useSearchParams();

  return (
    <div className='mb-10 border-b border-slate-400 pb-8'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold mb-4 flex gap-4'>
          Shipping Method
          {!showForm && name && <img src='/icons/check.svg' alt='check' />}
        </h2>
        {!showForm && name && !paymentComplete && (
          <Button
            variant='link'
            className='text-blue-600 text-md p-0'
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('step', STEPS.SHIPPING_INFORMATION);
                return prev;
              })
            }>
            Edit
          </Button>
        )}
      </div>
      {showForm ? (
        <Form method='POST'>
          <input
            type='text'
            hidden
            readOnly
            value={STEPS.SHIPPING_INFORMATION}
            name='step'
          />
          <RadioGroup
            className='mb-4'
            defaultValue={defaultShippingMethod?.shipping_option_id}
            name='optionId'
            required
            onChange={() => setSelectedOption(true)}>
            {shippingOptions.map((option) => (
              <div
                className='flex items-center space-x-2 cursor-pointer border-2 px-4 py-6 rounded-lg'
                key={option.id}>
                <RadioGroupItem value={option.id} id={option.name} />
                <Label
                  htmlFor={option.name}
                  className='flex justify-between w-full'>
                  <p>{option.name}</p>
                  <p>
                    {formatAmount({
                      countryCode,
                      currencyCode,
                      amount: option.amount ?? 0,
                    })}
                  </p>
                </Label>
              </div>
            ))}
          </RadioGroup>
          <Button disabled={!selectedOption}>Continue to Payment</Button>
        </Form>
      ) : (
        <div className='text-slate-700'>
          {name && (
            <>
              <h2 className='font-bold mb-2'>Method</h2>
              <p>
                {name} (
                {formatAmount({
                  countryCode,
                  currencyCode,
                  amount: amount ?? 0,
                })}
                )
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
