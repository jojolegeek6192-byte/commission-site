import { z } from "zod";

export const currencies = ["EUR", "USD", "ROBUX"] as const;

export const currencySymbols: Record<(typeof currencies)[number], string> = {
  EUR: "€",
  USD: "$",
  ROBUX: "R$",
};

export const currencyLabels: Record<(typeof currencies)[number], string> = {
  EUR: "Euro (€)",
  USD: "Dollar ($)",
  ROBUX: "Robux (R$)",
};

export function formatMoney(amount: number, currency: (typeof currencies)[number]) {
  const rounded = currency === "ROBUX" ? Math.round(amount) : Math.round(amount * 100) / 100;
  const formatted = rounded.toLocaleString("en-US");
  return currency === "ROBUX" ? `${formatted} R$` : `${currencySymbols[currency]}${formatted}`;
}

export const commissionStatuses = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "WAITING_FOR_PAYMENT",
  "PAID",
  "COMPLETED",
  "CANCELLED",
] as const;

export const statusLabels: Record<(typeof commissionStatuses)[number], string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_PAYMENT: "Waiting For Payment",
  PAID: "Paid",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// "Active" = still ongoing work, used for dashboard stat cards.
export const activeStatuses = ["NOT_STARTED", "IN_PROGRESS", "WAITING_FOR_PAYMENT", "PAID"] as const;
// "Potential" = work in progress, money not yet received.
export const potentialStatuses = ["NOT_STARTED", "IN_PROGRESS", "WAITING_FOR_PAYMENT"] as const;
// "Revenue counted" = money has actually come in.
export const paidStatuses = ["PAID", "COMPLETED"] as const;

export const commissionFormSchema = z.object({
  discordUser: z
    .string()
    .min(2, "Discord username is required")
    .max(40, "Too long"),
  projectName: z.string().min(2, "Project name is required").max(80, "Too long"),
  description: z
    .string()
    .min(20, "Please describe your project in at least 20 characters")
    .max(3000, "Too long"),
  amount: z.coerce
    .number({ invalid_type_error: "Enter an amount" })
    .positive("Amount must be greater than 0")
    .max(10_000_000, "That number looks too large"),
  currency: z.enum(currencies, {
    errorMap: () => ({ message: "Select a currency" }),
  }),
  deadline: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Pick a valid date")
    .refine((v) => new Date(v).getTime() > Date.now(), "Deadline must be in the future"),
  urgent: z.boolean().default(false),
  notes: z.string().max(1000, "Too long").optional().or(z.literal("")),
  referenceUrls: z.array(z.string().url()).max(6, "Max 6 reference images"),
});

export type CommissionFormValues = z.infer<typeof commissionFormSchema>;

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const commissionUpdateSchema = z.object({
  status: z.enum(commissionStatuses).optional(),
  projectName: z.string().min(2).max(80).optional(),
  description: z.string().min(10).max(3000).optional(),
  amount: z.coerce.number().positive().max(10_000_000).optional(),
  currency: z.enum(currencies).optional(),
  deadline: z.string().optional(),
  urgent: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
});
