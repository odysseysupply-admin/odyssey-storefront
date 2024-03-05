import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';

export default function Hero() {
  return (
    <section className='relative w-full mb-8 lg:mb-16'>
      {/* Carousel Content for Desktop */}
      <Carousel
        className='hidden lg:block'
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}>
        <CarouselContent className='max-h-[805px]'>
          <CarouselItem>
            <img src='/img/feature-1.jpg' alt='' className='w-full' />
          </CarouselItem>
          <CarouselItem>
            <img src='/img/feature-3.jpg' alt='' className='w-full' />
          </CarouselItem>
          <CarouselItem>
            <img src='/img/feature-4.jpg' alt='' className='w-full' />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* Carousel Content for Mobile */}
      <Carousel
        className='lg:hidden'
        plugins={[
          Autoplay({
            delay: 3000,
          }),
        ]}>
        <CarouselContent className='h-[100vh] '>
          <CarouselItem>
            <img
              src='/img/feature-1-mobile.jpg'
              alt=''
              className='w-full h-[100vh] object-cover md:object-contain'
            />
          </CarouselItem>
          <CarouselItem>
            <img
              src='/img/feature-2-mobile.jpg'
              alt=''
              className='w-full h-[100vh] object-cover md:object-contain'
            />
          </CarouselItem>
          <CarouselItem>
            <img
              src='/img/feature-3-mobile.jpg'
              alt=''
              className='w-full h-[100vh] object-cover md:object-contain'
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </section>
  );
}
