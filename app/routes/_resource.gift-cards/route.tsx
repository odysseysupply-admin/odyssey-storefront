import { ActionFunctionArgs } from '@remix-run/node';
import { medusa_cookie } from '~/lib/cookies';
import { addGiftCard, removeGiftCard } from '~/lib/medusa.server';

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { code } = data as {
    code: string;
  };

  const cartId = cookie.cart_id;

  switch (request.method) {
    case 'POST': {
      await addGiftCard(cartId, code);
      return { ok: true };
    }
    case 'DELETE': {
      await removeGiftCard(cartId, code);
      return { ok: true };
    }
    default:
      return;
  }

  return null;
}
