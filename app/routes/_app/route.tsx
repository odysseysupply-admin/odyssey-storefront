import { Outlet } from '@remix-run/react';
import AnnouncementBar from '~/routes/_app/announcement-bar';
import Footer from '~/routes/_app/footer';
import Navbar from '~/routes/_app/navbar.';

export default function Index() {
  return (
    <div>
      <AnnouncementBar />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
