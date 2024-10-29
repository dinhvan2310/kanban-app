import { z } from "zod";

export const signupFormSchema = z
    .object({
        email: z.string().min(1).email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["confirmPassword"],
            });
        }
    });

export type SignupFormType = z.infer<typeof signupFormSchema>;
