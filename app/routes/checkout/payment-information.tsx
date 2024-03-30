import type { Cart } from '@medusajs/client-types';
import { Form, useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { STEPS } from '~/routes/checkout/utils';

export type Props = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
  showForm: boolean;
  paymentComplete: boolean;
};

export function PaymentInformation({ cart, showForm, paymentComplete }: Props) {
  const { payment_sessions: paymentSessions, payment_session: paymentSession } =
    cart;

  const sortedPaymentSession = paymentSessions.sort(
    (a, b) => a.provider_id.charCodeAt(0) - b.provider_id.charCodeAt(0)
  );

  const [selectedOption, setSelectedOption] = useState(
    paymentSession?.provider_id || 'paymongo'
  );

  const [, setSearchParams] = useSearchParams();

  return (
    <div className='mb-10 border-b border-slate-400 pb-8'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold mb-4 flex gap-4'>
          Payment
          {!showForm && paymentSession?.provider_id && (
            <img src='/icons/check.svg' alt='check' />
          )}
        </h2>
        {!showForm && paymentSession?.provider_id && !paymentComplete && (
          <Button
            variant='link'
            className='text-blue-600 text-md p-0'
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('step', STEPS.PAYMENT_INFORMATION);
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
            value={STEPS.PAYMENT_INFORMATION}
            name='step'
          />
          <RadioGroup
            className='mb-4'
            defaultValue={selectedOption}
            name='paymentProviderId'
            required>
            {sortedPaymentSession.map((option) => (
              <div key={option.provider_id}>
                <div className='flex items-center space-x-2 cursor-pointer border-2 px-4 py-6 rounded-lg'>
                  <RadioGroupItem
                    value={option.provider_id}
                    id={option.provider_id}
                    onClick={() => setSelectedOption(option.provider_id)}
                  />
                  <Label
                    htmlFor={option.provider_id}
                    className='flex items-center justify-between w-full'>
                    <p>{option.provider_id}</p>

                    {option.provider_id === 'paymongo' && (
                      <div className='flex gap-1'>
                        <img
                          className='w-6 rounded-sm'
                          src='/img/gcash.png'
                          alt='gcash'
                        />
                        <img
                          className='w-6 rounded-sm'
                          src='/img/maya.jpg'
                          alt='maya'
                        />
                        <img
                          className='w-6 rounded-sm'
                          src='/img/bpi.png'
                          alt='bpi'
                        />
                        <img
                          className='w-6 rounded-sm'
                          src='/img/unionbank.jpeg'
                          alt='union bank'
                        />
                      </div>
                    )}
                  </Label>
                </div>
                {selectedOption === 'paymongo' &&
                  option.provider_id === 'paymongo' && (
                    <p className='p-8 bg-gray-200 '>
                      After Clicking &quot;Place Order&quot;, you will be
                      redirected to Secure Payments via Paymongo to complete
                      your purchase securely.
                    </p>
                  )}
              </div>
            ))}
          </RadioGroup>
          <Button disabled={!selectedOption}>Proceed to Payment</Button>
        </Form>
      ) : (
        <div className='text-slate-700'>
          {paymentSession?.provider_id && (
            <>
              <h2 className='font-bold mb-2'>Method</h2>
              <p>{paymentSession?.provider_id}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
