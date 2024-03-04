import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export default function Hero() {
  return (
    <section className='hero'>
      <img src='/img/feature-2.jpg' alt='' />
      <Link to='#products' className='hero__cta'>
        <Button variant='secondary'>Shop Now!</Button>
      </Link>
    </section>
  );
}
