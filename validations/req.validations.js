import { z } from "zod";

export const signUpValidationSchema = z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3).max(13)

})


export const loginValidationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3).max(13)
})

export const shortenPostRequestBodySchema= z.object({
    url : z.string({
    error: "URL is required",
  })
    .url({
    error: "Please provide a valid URL",
  }),
    shortCode: z.string().optional()

})