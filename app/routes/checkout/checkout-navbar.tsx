import { Link } from '@remix-run/react';

export function CheckoutNavbar() {
  return (
    <header className='flex items-center  justify-between h-[72px] px-4 bg-foreground text-white sm:px-8 border-b'>
      <Link to='/cart' className='flex flex-1 basis-0 text-sm items-end'>
        <img src='/icons/chevron-left.svg' alt='back' />
        Back <span className='hidden md:block ml-1'> to Cart</span>
      </Link>
      <Link to='/'>
        <div className='flex items-center gap-2'>
          <img src='/img/logo.png' alt='' width={48} />
          <p className='hidden md:block font-bold text-2xl'>
            Odyssey Supply Co.
          </p>
        </div>
      </Link>
      <div className='flex-1 basis-0' />
    </header>
  );
}
