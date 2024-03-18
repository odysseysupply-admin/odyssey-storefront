import { z } from 'zod';

export const DeliveryInformationSchema = z.object({
  step: z.string(),
  country_code: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  address: z.string(),
  postal_code: z.string(),
  city: z.string(),
  country: z.string(),
  province: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

export type DeliveryInformationType = z.infer<typeof DeliveryInformationSchema>;
