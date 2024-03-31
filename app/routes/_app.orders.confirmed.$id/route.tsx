import { LoaderFunctionArgs, json } from '@remix-run/node';
import { medusa_cookie } from '~/lib/cookies';

// TODO: ERROR HANDLING AND ADDING ERROR BOUNDARIES
// TODO: REFUND PAYMENT
// TODO: FAILED PAYMENT
// HEADERS REDIRECT IN ROOT TRY USING HEADERS IN REMIX IF CAN
// TODO: CODE CLEAN UP FOR ALL THE PRODUCTS
// TODO: UI CLEAN UP TO MAKE IT MORE SHARP
// TODO: SEO TAGS
// TODO: DEPLOYMENT

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  if (cookie.cart_id) {
    cookie.cart_id = '';
  }

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await medusa_cookie.serialize(cookie),
      },
    }
  );
};

export default function ConfirmedOrdersPage() {
  return <div>Confirmed Orders</div>;
}
