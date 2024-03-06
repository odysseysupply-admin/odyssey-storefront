import { Outlet } from '@remix-run/react';
import Footer from '~/routes/_app/footer';
import Navbar from '~/routes/_app/navbar.';

export default function Index() {
  return (
    <div className='relative'>
      {/* <AnnouncementBar /> */}
      <Navbar />
      <Outlet />
      <Footer />

      <div className='p-2 text-sm tracking-tighter flex gap-2 items-center justify-center'>
        Powered by Chupify <img src='/icons/coffee.svg' alt='coffee icon' />
      </div>
    </div>
  );
}
