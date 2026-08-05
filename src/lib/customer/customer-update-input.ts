import { z } from "zod";

import { customerCreateSchema } from "@/lib/customer/customer-input";

export const customerUpdateSchema = customerCreateSchema.extend({
  id: z.string().trim().uuid(),
});

export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;
