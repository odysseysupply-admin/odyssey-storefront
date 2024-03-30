import type { SubmissionResult } from '@conform-to/react';

export type lastResultType = SubmissionResult<string[]> | null | undefined;

export const STEPS = {
  DELIVERY_INFORMATION: 'delivery_information',
  SHIPPING_INFORMATION: 'shipping_information',
  PAYMENT_INFORMATION: 'payment_information',
  REVIEW_ORDER: 'review_order',
};
