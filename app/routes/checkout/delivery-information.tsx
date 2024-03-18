import {
  getFormProps,
  getInputProps,
  useForm,
  type SubmissionResult,
} from '@conform-to/react';
import type { Address } from '@medusajs/client-types';
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { DeliveryInformationType } from '~/lib/types';

export type Props = {
  countryCode: string;
  lastResult:
    | SubmissionResult<string[]>
    | { success: boolean }
    | null
    | undefined;
  shippingAddress: Address;
  email: string;
};

export function DeliveryInformation(props: Props) {
  const [showForm, setShowForm] = useState(
    Boolean(props.shippingAddress?.first_name)
  );

  return (
    <div>
      {showForm ? (
        <div>
          Hello World
          <Button onClick={() => setShowForm(false)}>Edit Form</Button>
        </div>
      ) : (
        <DeliveryInformationForm {...props} />
      )}
    </div>
  );
}

const DeliveryInformationForm = ({
  countryCode,
  lastResult,
  shippingAddress,
  email,
}: Props) => {
  const [form, fields] = useForm<DeliveryInformationType>({
    lastResult: lastResult && !('success' in lastResult) ? lastResult : null,
    defaultValue: {
      first_name: shippingAddress?.first_name,
      last_name: shippingAddress?.last_name,
      address: shippingAddress?.address_1,
      city: shippingAddress?.city,
      phone: shippingAddress?.phone,
      postal_code: shippingAddress?.postal_code,
      province: shippingAddress?.province,
      email,
    },
  });

  // useEffect(() => {
  //   if (lastResult && 'success' in lastResult) {
  //     form.reset();
  //   }
  // }, [lastResult]);

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
        value={countryCode.toLocaleLowerCase()}
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
