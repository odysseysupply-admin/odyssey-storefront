import { useCallback, useEffect, useState } from 'react';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '~/components/ui/carousel';

type Props = {
  productImages: string[];
};

export function ProductCarousel({ productImages }: Props) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  const [, setSelectedIndex] = useState(0);

  const onThumbClick = useCallback(
    (index: number) => {
      console.log(index);
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap() - 1);
  }, [mainApi, thumbApi, setSelectedIndex]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
  }, [mainApi, onSelect]);

  return (
    <>
      <Carousel setApi={setMainApi}>
        <CarouselContent className='h-[350px] max-w-[45p] px-4'>
          {productImages.map((imgURL, index) => (
            <CarouselItem key={index}>
              <img
                src={imgURL}
                alt='Product Images'
                className='w-full h-full object-contain md:object-contain px-4'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <Carousel setApi={setThumbApi}>
        <CarouselContent className='h-[350px] max-w-[45p] px-4'>
          {productImages.map((imgURL, index) => (
            <CarouselItem
              key={index}
              onClick={() => onThumbClick(index)}
              className='basis-1/3'>
              <img
                src={imgURL}
                alt='Product Images'
                className='w-full h-full object-contain md:object-contain px-4'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}
