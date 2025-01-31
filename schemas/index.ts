import { UserRole } from '@prisma/client'
import * as z from 'zod'

// schema to change password
export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
})

// schema to send reset email
export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
})

// validation on login
export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    })
})

// register 
export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Min is 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required"
    })
})


// settings schema
export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    image: z.optional(z.string().url())
})
 // cool thing with zod we can use .refine. If the user enters a newPassword, he should also enter an oldPassword 
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false
        }
        return true
    }, {
        message: "New password is required",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false
        }
        return true
    }, {
        message: "Password is required",
        path: ["password"]
    })