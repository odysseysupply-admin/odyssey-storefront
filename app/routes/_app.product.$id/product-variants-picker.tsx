import { useSearchParams } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { ProductVariants } from '~/routes/_app.product.$id/utils';

type Props = {
  productVariants: ProductVariants;
  productVariantsKeys: string[];
  currentVariant: string;
};

export function ProductVariantsPicker({
  productVariants,
  productVariantsKeys,
  currentVariant,
}: Props) {
  const [, setSearchParams] = useSearchParams();

  return (
    <>
      <div>
        <h3 className='font-bold text-slate-700 mb-2'>Sizes:</h3>
      </div>
      <div className='flex gap-2 items-center'>
        {productVariantsKeys.map((variant) => (
          <Button
            disabled={
              productVariants[variant as keyof typeof productVariants]
                ?.stocks === 0
            }
            variant={currentVariant === variant ? 'default' : 'outline'}
            className=''
            key={variant}
            onClick={() => {
              setSearchParams(
                (prev) => {
                  prev.set('variant', variant);
                  return prev;
                },
                {
                  preventScrollReset: true,
                }
              );
            }}>
            {variant}
          </Button>
        ))}
      </div>
    </>
  );
}
