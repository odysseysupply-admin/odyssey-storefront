import { useParams } from '@remix-run/react';

export default function ProductPage() {
  const { id } = useParams();
  return <div>This is the product page: {id}</div>;
}
