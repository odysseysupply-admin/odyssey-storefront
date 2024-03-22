export const formatAmount = ({
  countryCode,
  currencyCode,
  amount,
}: {
  countryCode: string;
  currencyCode: string;
  amount: number;
}) => {
  return new Intl.NumberFormat(countryCode, {
    style: 'currency',
    currencyDisplay: 'symbol',
    currency: currencyCode,
  }).format(amount / 100);
};

export const sluggifyTitle = (title: string) => {
  return title.replace(/\s+/g, '-').toLowerCase();
};
