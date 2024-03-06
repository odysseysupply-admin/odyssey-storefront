export const formatPrice = ({
  countryCode,
  currencyCode,
  price,
}: {
  countryCode: string;
  currencyCode: string;
  price: number;
}) => {
  return new Intl.NumberFormat(countryCode, {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency: currencyCode,
  }).format(price);
};
