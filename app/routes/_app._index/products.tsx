import type { PricedProduct } from '@medusajs/client-types';
import { Link } from '@remix-run/react';

type Props = {
  products: PricedProduct[];
};

// TODO: FIX DATA FOR TESTING
const Product = ({ product }: { product: PricedProduct }) => {
  const { title, thumbnail, id } = product;
  const titleURL = title.replace(/\s+/g, '-').toLowerCase();
  return (
    <Link
      to={title ? `/product/${titleURL}?id=${id}` : '/'}
      className='max-h-[450px]'>
      <div className='relative h-[325px] md:h-[350px] transition-all ease-out duration-200 transform hover:rotate-3  hover:shadow-lg  mb-4'>
        <img
          src={thumbnail || '/img/shirt1.jpg'}
          alt=''
          className=' w-full h-full object-contain'
        />
      </div>
      <div className='text-center'>
        <h3 className='underline  text-lg font-bold'>
          {title || 'Medusa Mangum Opus'}
        </h3>
        <p className='tracking-wider text-stone-800'>Php 150.00</p>
      </div>
    </Link>
  );
};

export default function Products({ products }: Props) {
  return (
    <section
      className='mb-24 px-4 lg:px-8 max-w-[1110px] mx-auto'
      id='products'>
      <h1 className='text-center text-3xl  mb-4 lg:text-4xl underline py-4 text-slate-700 tracking-wider'>
        ALL PRODUCTS
      </h1>

      <div className='grid gap-y-10 md:grid-cols-2 md:gap-x-10  lg:grid-cols-3 mb-4'>
        {products.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}
