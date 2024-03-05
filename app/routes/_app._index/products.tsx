import { Link } from '@remix-run/react';

export default function Products() {
  return (
    <section className='mb-16 px-4 lg:px-8' id='products'>
      <h1 className='text-center text-3xl font-bold mb-4 lg:text-4xl underline py-4'>
        ALL PRODUCTS
      </h1>

      <div className='grid gap-y-10 md:grid-cols-2 md:gap-x-10  lg:grid-cols-3 mb-4'>
        <Link to={'/product/123'} className='max-h-[450px] '>
          <div className='relative h-[325px] md:h-[350px] transition-all ease-out duration-200 transform hover:rotate-3 '>
            <img
              src='/img/shirt1.jpg'
              alt=''
              className=' w-full h-full object-contain'
            />
          </div>
          <div className='text-center'>
            <h3 className='underline  text-lg font-bold'>
              Odyssey Magnum Opus Shirt
            </h3>
            <p className='tracking-wider text-stone-800'>Php 150.00</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
