import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';

type Props = {
  checkoutURL: string;
  showForm: boolean;
};

export function ReviewOrder({ showForm, checkoutURL }: Props) {
  return (
    <div>
      <h2 className='text-2xl font-bold mb-4 flex gap-4'>Review Order</h2>
      {showForm && (
        <Link to={checkoutURL} target='_blank' rel='noreferrer'>
          <Button>Place Order</Button>
        </Link>
      )}
    </div>
  );
}
