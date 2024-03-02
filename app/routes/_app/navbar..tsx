import { Link } from '@remix-run/react';

export default function Navbar() {
  return (
    <header>
      <Link to='/'>
        <img src='/img/logo.png' alt='' width={64} />
        <div>Oddysey Supply Co.</div>
      </Link>
      <nav>
        <ul>
          <Link to='/'>
            <li>Home</li>
          </Link>
          <Link to='#products'>
            <li>Shop</li>
          </Link>
          <Link to='about'>
            <li>About</li>
          </Link>
          <Link to='faq'>
            <li>FAQ</li>
          </Link>
          <Link to='size-chart'>
            <li>Size Chart</li>
          </Link>

          {/* Search Icon */}
          <li>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-search'>
              <circle cx='11' cy='11' r='8' />
              <path d='m21 21-4.3-4.3' />
            </svg>
          </li>

          {/* Account Icon */}
          <li>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-user-round'>
              <circle cx='12' cy='8' r='5' />
              <path d='M20 21a8 8 0 0 0-16 0' />
            </svg>
          </li>

          {/* Shopping Cart */}
          <Link to='cart'>
            <li>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-shopping-cart'>
                <circle cx='8' cy='21' r='1' />
                <circle cx='19' cy='21' r='1' />
                <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
              </svg>
            </li>
          </Link>
        </ul>
      </nav>
    </header>
  );
}
