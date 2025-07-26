import { z } from "zod";

export const paramsSchema = z.object({
    days: z.number().min(1, { message: "Au moins 1 jour" }).max(31, { message: "Maximum 31 jours" }),
    people: z.number().min(1, { message: "Au moins 1 personne" }).max(20, { message: "Maximum 20 personnes" }),
    diet: z.string().default("Tous les régimes"),
    start_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Format attendu: YYYY-MM-DD")
        .default(new Date().toISOString().slice(0, 10)), // yyyy-mm-dd du jour
});

export type Params = z.infer<typeof paramsSchema>;
