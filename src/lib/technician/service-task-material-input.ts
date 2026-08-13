import { ServiceMaterialUnit } from "@/generated/prisma/client";
import { z } from "zod";

const MAX_DECIMAL_10_2 = 99_999_999.99;
const DECIMAL_10_2_PATTERN = /^\d+(?:\.\d{1,2})?$/;

const quantitySchema = z
  .union([
    z
      .number()
      .finite()
      .positive()
      .max(MAX_DECIMAL_10_2)
      .refine(
        (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
        "Quantity must have at most two decimal places.",
      ),
    z
      .string()
      .trim()
      .regex(DECIMAL_10_2_PATTERN)
      .transform(Number)
      .pipe(z.number().finite().positive().max(MAX_DECIMAL_10_2)),
  ])
  .transform((value) => Number(value));

export const serviceTaskMaterialInputSchema = z.object({
  serviceRequestId: z.string().trim().uuid(),
  technicianId: z.string().trim().uuid(),
  name: z.string().trim().min(1).max(120),
  quantity: quantitySchema,
  unit: z.nativeEnum(ServiceMaterialUnit),
});

export type ServiceTaskMaterialInput = z.infer<
  typeof serviceTaskMaterialInputSchema
>;
