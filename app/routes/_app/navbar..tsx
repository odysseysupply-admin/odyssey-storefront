import { Link } from '@remix-run/react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import ShoppingCart from '~/routes/_app/shopping-cart';

const NavLinks = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Shop',
    link: '/#products',
  },
  {
    name: 'About',
    link: '/about',
  },
  {
    name: 'FAQ',
    link: '/faq',
  },
  {
    name: 'Size Chart',
    link: '/size-chart',
  },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className='flex items-center  justify-between h-[72px] px-4 bg-foreground text-white sm:px-8 border-b sticky top-0 z-50'>
      {/* Mobile Menu */}
      <Sheet open={openMenu} onOpenChange={setOpenMenu}>
        <SheetTrigger className='block lg:hidden'>
          <img
            src='/icons/menu.svg'
            alt='hambuger menu'
            width={32}
            className='mr-[40px]'
          />
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='mt-4 h-full'>
            <ul className='h-full flex flex-col items-center justify-center gap-6'>
              {NavLinks.map(({ name, link }) => {
                return (
                  <li key={name} className='text-lg'>
                    <Link to={link} onClick={() => setOpenMenu(false)}>
                      {name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      <Link to='/'>
        <div className='flex items-center gap-2'>
          <img src='/img/logo.png' alt='' width={48} />
          <p className='hidden lg:block font-bold text-2xl'>
            Oddysey Supply Co.
          </p>
        </div>
      </Link>

      {/* Desktop Menu */}
      <nav className='hidden lg:block'>
        <ul className='flex gap-8'>
          {NavLinks.map(({ name, link }) => {
            return (
              <li key={name} className='tracking-tight'>
                <Link to={link}>{name}</Link>
              </li>
            );
          })}

          {/* Search Icon */}
          <li>
            <img src='/icons/search.svg' alt='search icon' />
          </li>

          {/* Account Icon */}
          <li>
            <img src='/icons/user-round.svg' alt='account icon' />
          </li>

          {/* Shopping Cart */}
          <li>
            <ShoppingCart />
          </li>
        </ul>
      </nav>

      {/* Mobile Menu Extension */}
      <nav className='lg:hidden'>
        <ul className='flex gap-2'>
          {/* Account Icon */}
          <li>
            <img src='/icons/user-round.svg' alt='account icon' width={32} />
          </li>

          {/* Shopping Cart */}
          <li>
            <ShoppingCart width={32} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
