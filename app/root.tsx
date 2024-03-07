import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { medusa_cookie } from '~/lib/cookies';
import { getRegions } from '~/lib/medusa.server';

import stylesheet from '~/tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await medusa_cookie.parse(cookieHeader)) || {};

  if (cookie.region_id) return null;

  const regions = await getRegions();

  return redirect(request.url, {
    headers: {
      'Set-Cookie': await medusa_cookie.serialize({
        region_id: regions?.id,
        currency_code: regions?.currency_code,
        country_code: regions?.name,
      }),
    },
  });
};

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='font-poppins'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
