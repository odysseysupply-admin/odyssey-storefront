import type { PricedShippingOption } from '@medusajs/client-types';
import { Form, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { formatAmount } from '~/lib/products';
import { STEPS } from '~/routes/checkout/utils';

export type Props = {
  shippingOptions: PricedShippingOption[];
  countryCode: string;
  currencyCode: string;
  showForm: boolean;
  shippingMethod?: string;
};

export function ShippingInformation({
  shippingOptions,
  currencyCode,
  countryCode,
  showForm,
  shippingMethod = '',
}: Props) {
  console.log(shippingOptions);
  console.log(shippingMethod);
  const [selectedOption, setSelectedOption] = useState(shippingMethod !== '');
  const [, setSearchParams] = useSearchParams();

  if (!showForm)
    return (
      <div>
        Hello World
        <Button
          onClick={() =>
            setSearchParams((prev) => {
              prev.set('step', STEPS.SHIPPING_INFORMATION);
              return prev;
            })
          }>
          Edit
        </Button>
      </div>
    );
  return (
    <div>
      <Form method='POST'>
        <input
          type='text'
          hidden
          readOnly
          value={STEPS.SHIPPING_INFORMATION}
          name='step'
        />
        <RadioGroup
          defaultValue={shippingMethod}
          name='optionId'
          required
          onChange={() => setSelectedOption(true)}>
          {shippingOptions.map((option) => (
            <div
              className='flex items-center space-x-2 cursor-pointer'
              key={option.id}>
              <RadioGroupItem value={option.id} id={option.name} />
              <Label htmlFor={option.name} className='flex'>
                <p>{option.name}</p>-
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
    </div>
  );
}
