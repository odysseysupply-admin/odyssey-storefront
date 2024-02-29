import { Outlet } from '@remix-run/react';

export default function Index() {
  return (
    <div>
      <div>Navbar</div>
      <Outlet />
      <div>Footer</div>
    </div>
  );
}
