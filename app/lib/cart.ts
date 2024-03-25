import type { LineItem } from '@medusajs/client-types';

export const sortLineItemsByDateAdded = (items?: LineItem[]) => {
  if (!items || items.length === 0) return [];
  return items.sort(
    (a, b) =>
      new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf()
  );
};
