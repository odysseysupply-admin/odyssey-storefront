import { Link } from '@remix-run/react';

export default function Footer() {
  return (
    <footer className='bg-black text-white px-4 py-12'>
      <div className='px-4 mb-16'>
        <h2 className='font-bold text-2xl mb-4 text-center flex justify-center items-center gap-2'>
          Visit us
          <img src='/icons/map-pin.svg' alt='map pin icon' />
        </h2>

        <iframe
          src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d489.5510646018443!2d124.60927399999998!3d11.007945!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3307f1d4cd77e5a7%3A0x186c8fbced9fe09b!2sLunhaw%20Cafe!5e0!3m2!1sen!2sph!4v1709620643868!5m2!1sen!2sph'
          className='w-full h-[350px]'
          title='Store Location'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'></iframe>
      </div>

      <div className='text-center border-slate-300 w-full mb-4 '>
        <div className='max-w-[450px]  mx-auto'>
          <h2 className='font-bold text-2xl mb-2'>ODYSSEY SUPPLY CO.</h2>
          <p className='leading-6 tracking-wide'>
            We&apos;re not just a brand; we epitomize a lifestyle and mindset.
            Our ethos reflects dedication to excellence and innovation. Join us
            in embracing a journey of purpose and passion.
          </p>
        </div>
      </div>

      <div className='flex gap-4 items-center justify-center'>
        <Link to='' target='_blank'>
          <img src='/icons/facebook.svg' alt='facebook logo' />
        </Link>

        <Link to='' target='_blank'>
          <img src='/icons/instagram.svg' alt='instagram logo' />
        </Link>

        <Link to='' target='_blank'>
          <img src='/icons/x.svg' alt='x logo' />
        </Link>
      </div>
    </footer>
  );
}
