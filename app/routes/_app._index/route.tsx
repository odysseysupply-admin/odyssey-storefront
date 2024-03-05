import FAQ from '~/routes/_app._index/faq';
import Hero from '~/routes/_app._index/hero';
import Products from '~/routes/_app._index/products';

// export const loader = async () => {
//   const products = await getProductsList();

//   return {
//     products,
//   };
// };

export default function Home() {
  // const { products } = useLoaderData<typeof loader>();

  // console.log(products);
  return (
    <div>
      <Hero />
      <Products />
      <FAQ />
    </div>
  );
}
