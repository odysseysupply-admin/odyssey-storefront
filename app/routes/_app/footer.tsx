import { Link } from '@remix-run/react';

export default function Footer() {
  return (
    <footer>
      <h2>ODYSSEY SUPPLY CO.</h2>
      <p>Odyssey Supply Co. is more than just a brand</p>
      <p>It&pos;s a lifestyle and a mindset.</p>

      <div>
        <p>Visit us @</p>
      </div>

      <div>
        <Link to='/'>
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
            className='lucide lucide-facebook'>
            <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
          </svg>
        </Link>

        <Link to='/'>
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
            className='lucide lucide-instagram'>
            <rect width='20' height='20' x='2' y='2' rx='5' ry='5' />
            <path d='M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' />
            <line x1='17.5' x2='17.51' y1='6.5' y2='6.5' />
          </svg>
        </Link>

        <Link to='/'>
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
            className='lucide lucide-x'>
            <path d='M18 6 6 18' />
            <path d='m6 6 12 12' />
          </svg>
        </Link>
      </div>
    </footer>
  );
}
