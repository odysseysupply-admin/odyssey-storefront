import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import type { Cart } from '@medusajs/client-types';
import { useFetcher, useSearchParams } from '@remix-run/react';
import { ButtonLoadingSpinner } from '~/components/button-loading-spinner';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { DeliveryInformationType } from '~/lib/types';
import { STEPS, lastResultType } from '~/routes/checkout/utils';

export type Props = {
  showForm: boolean;
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
  lastResult: lastResultType;
  paymentComplete: boolean;
};

export function DeliveryInformation(props: Props) {
  const [, setSearchParams] = useSearchParams();
  const { shipping_address, email } = props.cart;
  const {
    first_name: firstName,
    last_name: lastName,
    address_1: address,
    postal_code: postalCode,
    city,
    country_code: country,
    phone,
  } = shipping_address;

  return (
    <div className='mb-10 border-b border-slate-400 pb-8'>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold mb-4 flex gap-4'>
          Shipping Address
          {!props.showForm && <img src='/icons/check.svg' alt='check' />}
        </h2>
        {!props.showForm && !props.paymentComplete && (
          <Button
            variant='link'
            className='text-blue-600 text-md p-0'
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('step', STEPS.DELIVERY_INFORMATION);
                return prev;
              })
            }>
            Edit
          </Button>
        )}
      </div>
      {props.showForm ? (
        <DeliveryInformationForm {...props} />
      ) : (
        <div className='flex items-start gap-x-8 w-full text-slate-700'>
          <div className='basis-1/2 md:basis-[unset]'>
            <h2 className='font-bold mb-2'>Shipping Address</h2>
            <div>
              <p>
                {firstName} {lastName}
              </p>
              <p>{address}</p>
              <p>
                {postalCode},{city}
              </p>
              <p>{country.toUpperCase()}</p>
            </div>
          </div>
          <div className='basis-1/2 md:basis-[unset]'>
            <h2 className='font-bold mb-2'>Contact</h2>
            <div>
              <p>{phone}</p>
              <p>{email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DeliveryInformationForm = ({ cart, lastResult }: Props) => {
  const fetcher = useFetcher();
  const isSubmitting =
    fetcher.state === 'loading' || fetcher.state === 'submitting';
  const { shipping_address, email } = cart;
  const [form, fields] = useForm<DeliveryInformationType>({
    lastResult: lastResult && !('success' in lastResult) ? lastResult : null,
    defaultValue: {
      first_name: shipping_address?.first_name,
      last_name: shipping_address?.last_name,
      address: shipping_address?.address_1,
      city: shipping_address?.city,
      phone: shipping_address?.phone,
      postal_code: shipping_address?.postal_code,
      province: shipping_address?.province,
      email,
    },
  });

  return (
    <fetcher.Form method='POST' {...getFormProps(form)}>
      <div className='grid lg:grid-cols-2 gap-2 lg:gap-x-8'>
        <input
          type='text'
          hidden
          readOnly
          name='step'
          value='delivery_information'
        />
        <input
          type='text'
          hidden
          readOnly
          name='country_code'
          // need to lowercase for the shipping address
          value={shipping_address?.country_code!.toLocaleLowerCase()}
        />
        <input type='text' hidden readOnly name='country' value='Philippines' />
        <div className=''>
          <Label>
            First name <span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='First name'
            required
            {...getInputProps(fields.first_name, { type: 'text' })}
          />
          <div className='text-sm text-red-500'>{fields.first_name.errors}</div>
        </div>

        <div className=''>
          <Label>
            Last name <span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='Last name'
            required
            {...getInputProps(fields.last_name, { type: 'text' })}
          />
          <div className='text-sm text-red-500'>{fields.last_name.errors}</div>
        </div>

        <div className=''>
          <Label>
            Addrress<span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='Address'
            required
            {...getInputProps(fields.address, { type: 'text' })}
          />
          <div className='text-sm text-red-500'>{fields.address.errors}</div>
        </div>

        <div className=''>
          <Label>
            Postal Code<span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='Postal Code'
            required
            {...getInputProps(fields.postal_code, { type: 'text' })}
          />
          <div className='text-sm text-red-500'>
            {fields.postal_code.errors}
          </div>
        </div>

        <div className=''>
          <Label>
            City<span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='City'
            required
            {...getInputProps(fields.city, { type: 'text' })}
          />
          <div className='text-sm text-red-500'>{fields.city.errors}</div>
        </div>

        <div className=''>
          <Label>
            Province <span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='Province'
            required
            {...getInputProps(fields.province, { type: 'text' })}
          />
          <div className='text-sm text-red-500'>{fields.province.errors}</div>
        </div>

        <div className=''>
          <Label>
            Email<span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='Email'
            required
            {...getInputProps(fields.email, { type: 'text' })}
          />
          <div className='text-sm text-red-500'>{fields.email.errors}</div>
        </div>

        <div className='mb-4'>
          <Label>
            Phone Number<span className='text-lg text-red-500'>*</span>
          </Label>
          <Input
            placeholder='Phone Number'
            required
            {...getInputProps(fields.phone, { type: 'text' })}
          />

          <div className='text-sm text-red-500'>{fields.phone.errors}</div>
        </div>

        <Button className='w-full lg:w-fit' disabled={isSubmitting}>
          {isSubmitting ? <ButtonLoadingSpinner /> : 'Continue to Delivery'}
        </Button>
      </div>
    </fetcher.Form>
  );
};
