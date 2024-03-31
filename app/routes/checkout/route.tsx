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
import { useEffect, useMemo } from 'react';
import { CartSummary } from '~/components/cart-summary';
import { medusa_cookie } from '~/lib/cookies';
import {
  addPaymentMethod,
  addShippingMethod,
  completeCart,
  getCart,
  getShippingOptions,
  updateDeliveryInformation,
  updatePaymentSession,
} from '~/lib/medusa.server';
import {
  DeliveryInformationSchema,
  DeliveryInformationType,
} from '~/lib/types';
import { CheckoutNavbar } from '~/routes/checkout/checkout-navbar';
import { DeliveryInformation } from '~/routes/checkout/delivery-information';
import { PaymentInformation } from '~/routes/checkout/payment-information';
import { ReviewOrder } from '~/routes/checkout/review-order';
import { ShippingInformation } from '~/routes/checkout/shipping_information';
import { STEPS, type lastResultType } from '~/routes/checkout/utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const checkoutSuccess = searchParams.get('success') === 'true';

  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};
  const cartId = cookie.cart_id;

  if (cartId) {
    const shippingOptions = await getShippingOptions(cartId);

    if (checkoutSuccess) {
      await updatePaymentSession(cartId);
    }

    const cart = await getCart(cartId);

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
  const propCart = cart as unknown as Omit<
    Cart,
    'refundable_amount' | 'refunded_total'
  >;
  const currentStep = searchParams.get('step');
  const paymentComplete = useMemo(
    () => cart?.payment_session?.data?.paymentStatus === 'succeeded',
    [cart?.payment_session?.data?.paymentStatus]
  );

  useEffect(() => {
    if (currentStep === STEPS.REVIEW_ORDER && paymentComplete) {
      setSearchParams((prev) => {
        prev.delete('success');
        return prev;
      });
    }

    if (
      !currentStep ||
      (currentStep === STEPS.REVIEW_ORDER && !propCart?.payment_session) ||
      (currentStep === STEPS.PAYMENT_INFORMATION &&
        propCart?.shipping_methods.length === 0)
    ) {
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
  }, [currentStep, paymentComplete]);

  console.log({ propCart });

  return (
    <div>
      <CheckoutNavbar />
      <section className='mx-4 md:mx-12 xl:mx-0'>
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_416px] content-container gap-x-40 py-12 max-w-7xl mx-auto'>
          <div className='mb-10'>
            <DeliveryInformation
              showForm={STEPS.DELIVERY_INFORMATION === currentStep}
              cart={propCart}
              lastResult={lastResult as unknown as lastResultType}
              paymentComplete={paymentComplete}
            />
            <ShippingInformation
              cart={propCart}
              showForm={STEPS.SHIPPING_INFORMATION === currentStep}
              shippingOptions={shippingOptions as unknown as ShippingOption[]}
              paymentComplete={paymentComplete}
            />
            <PaymentInformation
              cart={propCart}
              showForm={STEPS.PAYMENT_INFORMATION === currentStep}
              paymentComplete={paymentComplete}
            />

            <ReviewOrder paymentComplete={paymentComplete} />
          </div>
          {/* Cart Summary */}
          <CartSummary showItems cart={propCart} />
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

    case STEPS.PAYMENT_INFORMATION: {
      const { cart } = await addPaymentMethod(
        cartId,
        data.paymentProviderId as string
      );

      return redirect(cart.payment_session.data.checkout_url as string);
    }

    case STEPS.REVIEW_ORDER: {
      const { type } = await completeCart(cartId);

      if (type === 'order') {
        return redirect('/orders/confirmed/1');
      }

      return null;
    }

    default:
      return null;
  }
};
