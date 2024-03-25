import { parseWithZod } from '@conform-to/zod';
import type { Cart, ShippingOption } from '@medusajs/client-types';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import {
  useActionData,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import { useEffect } from 'react';
import { medusa_cookie } from '~/lib/cookies';
import {
  addShippingMethod,
  getCart,
  getShippingOptions,
  updateDeliveryInformation,
} from '~/lib/medusa.server';
import {
  DeliveryInformationSchema,
  DeliveryInformationType,
} from '~/lib/types';
import { CartSummaryCheckout } from '~/routes/checkout/cart-summary-checkout';
import { CheckoutNavbar } from '~/routes/checkout/checkout-navbar';
import { DeliveryInformation } from '~/routes/checkout/delivery-information';
import { PaymentInformation } from '~/routes/checkout/payment-information';
import { ShippingInformation } from '~/routes/checkout/shipping_information';
import { STEPS, type lastResultType } from '~/routes/checkout/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};
  const cartId = cookie.cart_id;
  if (cartId) {
    const cart = await getCart(cartId);
    const shippingOptions = await getShippingOptions(cartId);

    return {
      cart,
      shippingOptions,
    };
  }

  return redirect('/');
};

export default function Checkout() {
  const lastResult = useActionData<typeof action>();
  const { cart, shippingOptions } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('step')) {
      setSearchParams((prev) => {
        let currStep;
        if (!cart.shipping_address?.first_name) {
          currStep = STEPS.DELIVERY_INFORMATION;
        } else {
          currStep = STEPS.SHIPPING_INFORMATION;
        }
        prev.set('step', currStep);
        return prev;
      });
    }
  }, []);

  return (
    <div>
      <CheckoutNavbar />
      <section className='mx-4'>
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_416px] content-container gap-x-40 py-12 max-w-7xl mx-auto'>
          <div>
            <DeliveryInformation
              showForm={STEPS.DELIVERY_INFORMATION === searchParams.get('step')}
              cart={
                cart as unknown as Omit<
                  Cart,
                  'refundable_amount' | 'refunded_total'
                >
              }
              lastResult={lastResult as unknown as lastResultType}
            />
            <ShippingInformation
              shippingMethod={cart.shipping_methods[0]?.shipping_option_id}
              showForm={STEPS.SHIPPING_INFORMATION === searchParams.get('step')}
              shippingOptions={shippingOptions as unknown as ShippingOption[]}
              currencyCode={cart.region.currency_code}
              countryCode={cart.region.name}
            />
            <PaymentInformation />
          </div>
          {/* Cart Summary */}
          <CartSummaryCheckout
            cart={
              cart as unknown as Omit<
                Cart,
                'refundable_amount' | 'refunded_total'
              >
            }
          />
        </div>
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

  const cartId = cookie.cart_id;

  switch (step) {
    case STEPS.DELIVERY_INFORMATION: {
      const submission = parseWithZod(formData, {
        schema: DeliveryInformationSchema,
      });

      if (submission.status !== 'success') {
        return json(submission.reply());
      }

      await updateDeliveryInformation(
        cartId,
        data as unknown as DeliveryInformationType
      );

      return redirect(`/checkout?step=${STEPS.SHIPPING_INFORMATION}`);
    }

    case STEPS.SHIPPING_INFORMATION: {
      await addShippingMethod(cartId, data.optionId as string);
      return redirect(`/checkout?step=${STEPS.PAYMENT_INFORMATION}`);
    }

    default:
      return null;
  }
};
