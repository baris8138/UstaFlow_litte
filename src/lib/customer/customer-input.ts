import { z } from "zod";

import {
  normalizeEmail,
  normalizeOptionalText,
  normalizePhone,
} from "@/lib/customer/normalization";

const optionalText = (maxLength: number) =>
  z.preprocess(
    normalizeOptionalText,
    z.string().max(maxLength).nullable(),
  );

const optionalPhone = z.preprocess((value) => {
  const normalized = normalizeOptionalText(value);

  return normalized === null ? null : normalizePhone(normalized);
}, z.string().regex(/^\+\d{10,15}$/).nullable());

const optionalEmail = z.preprocess((value) => {
  const normalized = normalizeOptionalText(value);

  return normalized === null ? null : normalizeEmail(normalized);
}, z.string().max(254).email().nullable());

export const customerCreateSchema = z.object({
  name: z.string().trim().min(2).max(150),
  type: z.enum(["INDIVIDUAL", "CORPORATE"]).default("INDIVIDUAL"),
  phone: optionalPhone,
  email: optionalEmail,
  addressLine: optionalText(250),
  city: optionalText(100),
  district: optionalText(100),
  postalCode: optionalText(20),
});

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;
