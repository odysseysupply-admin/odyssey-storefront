import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

type Props = {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  variantStock: number;
  isReadOnly?: boolean;
};

export const QuantityInput = ({
  quantity,
  setQuantity,
  variantStock,
  isReadOnly = false,
}: Props) => {
  return (
    <div>
      <div className='flex'>
        <Button
          variant='outline'
          className='w-10 text-xl font-bold rounded-none rounded-l-sm border-r-0'
          disabled={quantity === 1}
          onClick={() => {
            setQuantity((prev) => {
              if (prev === 0) return 1;
              return prev - 1;
            });
          }}>
          -
        </Button>
        <Input
          readOnly={isReadOnly}
          className='w-12 rounded-none border-x-0 text-center'
          type='text'
          value={quantity}
          onChange={(e) => {
            const newQuantity = parseInt(e.target.value);

            if (!newQuantity) {
              return setQuantity(0);
            }

            setQuantity(() => {
              if (newQuantity > variantStock) return variantStock;
              if (newQuantity <= 0) {
                return 1;
              }
              return newQuantity;
            });
          }}
        />
        <Button
          variant='outline'
          className='w-10 text-xl font-bold rounded-none rounded-e-sm border-l-0'
          disabled={quantity === variantStock}
          onClick={() => {
            setQuantity((prev) => {
              if (prev === variantStock) return prev;
              return prev + 1;
            });
          }}>
          +
        </Button>
      </div>
    </div>
  );
};
