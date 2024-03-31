import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { STEPS } from '~/routes/checkout/utils';

type Props = {
  paymentComplete: boolean;
};

export function ReviewOrder({ paymentComplete }: Props) {
  return (
    <div className='mb-10 border-b border-slate-400 pb-8'>
      <h2 className='text-2xl font-bold mb-4 flex gap-4'>Review Order</h2>
      {paymentComplete && (
        <Form method='POST'>
          <input
            type='text'
            hidden
            readOnly
            value={STEPS.REVIEW_ORDER}
            name='step'
          />
          <Button>Place Order</Button>
        </Form>
      )}
    </div>
  );
}
