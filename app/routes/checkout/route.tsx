import { parseWithZod } from '@conform-to/zod';
import type { Address } from '@medusajs/client-types';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { medusa_cookie } from '~/lib/cookies';
import { getCart, updateDeliveryInformation } from '~/lib/medusa.server';
import {
  DeliveryInformationSchema,
  DeliveryInformationType,
} from '~/lib/types';
import { CheckoutNavbar } from '~/routes/checkout/checkout-navbar';
import { DeliveryInformation } from '~/routes/checkout/delivery-information';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  if (cookie.cart_id) {
    const cart = await getCart(cookie.cart_id);
    return {
      cart,
    };
  }

  return redirect('/');
};

export default function Checkout() {
  const lastResult = useActionData<typeof action>();
  const { cart } = useLoaderData<typeof loader>();
  console.log('cart', cart);
  return (
    <div>
      <CheckoutNavbar />
      <section>
        <DeliveryInformation
          countryCode={cart.region.name}
          lastResult={lastResult}
          shippingAddress={cart.shipping_address as unknown as Address}
          email={cart.email}
        />
      </section>
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { step } = data as {
    step: string;
  };

  switch (step) {
    case 'delivery_information': {
      const submission = parseWithZod(formData, {
        schema: DeliveryInformationSchema,
      });

      if (submission.status !== 'success') {
        return json(submission.reply());
      }

      await updateDeliveryInformation(
        cookie.cart_id,
        data as unknown as DeliveryInformationType
      );

      return { success: true };
    }

    default:
      break;
  }
  return null;
};
