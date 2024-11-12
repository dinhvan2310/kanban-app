import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(6),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;
