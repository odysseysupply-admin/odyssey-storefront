type Props = {
  selected: boolean;
  onClick: () => void;
  productImage: string;
};

export function ProductCarouselThumb({
  selected,
  productImage,
  onClick,
}: Props) {
  return (
    <div
      className={'embla-thumbs__slide'.concat(
        selected ? ' embla-thumbs__slide--selected' : ''
      )}>
      <button
        onClick={onClick}
        type='button'
        className='embla-thumbs__slide__number'>
        <img src={productImage} alt='' width={60} />
      </button>
    </div>
  );
}
