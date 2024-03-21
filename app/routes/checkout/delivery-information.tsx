import {
  getFormProps,
  getInputProps,
  useForm,
  type SubmissionResult,
} from '@conform-to/react';
import type { Cart } from '@medusajs/client-types';
import { Form, useSearchParams } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { DeliveryInformationType } from '~/lib/types';
import { STEPS } from '~/routes/checkout/utils';

export type Props = {
  showForm: boolean;
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
  lastResult:
    | SubmissionResult<string[]>
    | { success: boolean }
    | null
    | undefined;
};

export function DeliveryInformation(props: Props) {
  const [, setSearchParams] = useSearchParams();
  return (
    <div>
      {props.showForm ? (
        <DeliveryInformationForm {...props} />
      ) : (
        <div>
          Hello World
          <Button
            onClick={() =>
              setSearchParams((prev) => {
                prev.set('step', STEPS.DELIVERY_INFORMATION);
                return prev;
              })
            }>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}

const DeliveryInformationForm = ({ cart, lastResult }: Props) => {
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
    <Form method='POST' {...getFormProps(form)}>
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
      <div>
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

      <div>
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

      <div>
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

      <div>
        <Label>
          Postal Code<span className='text-lg text-red-500'>*</span>
        </Label>
        <Input
          placeholder='Postal Code'
          required
          {...getInputProps(fields.postal_code, { type: 'text' })}
        />
        <div className='text-sm text-red-500'>{fields.postal_code.errors}</div>
      </div>

      <div>
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

      {/* <div>
        <Label>
          Country<span className='text-lg text-red-500'>*</span>
        </Label>
        <Input
          type='text'
          placeholder='Country'
          name={fields.country.name}
        />
        <div className='text-sm text-red-500'>{fields.country.errors}</div>
      </div> */}

      <div>
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

      <div>
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

      <div>
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

      <Button>Continue to Delivery</Button>
    </Form>
  );
};
