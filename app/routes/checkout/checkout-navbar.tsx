import { Link } from '@remix-run/react';

export function CheckoutNavbar() {
  return (
    <header className='flex items-center  justify-center lg:justify-start h-[72px] px-4 bg-foreground text-white sm:px-8 border-b'>
      <Link to='/'>
        <div className='flex items-center gap-2'>
          <img src='/img/logo.png' alt='' width={48} />
          <p className=' lg:block font-bold text-2xl'>Odyssey Supply Co.</p>
        </div>
      </Link>
    </header>
  );
}
