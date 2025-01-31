"use client"

import { CardWrapper } from "./card-wrapper"
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { NewPasswordSchema } from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

import { FormError } from "../form-errors"
import { FormSuccess } from "../form-success"

import { newPassword } from "@/actions/new-password"

export const NewPasswordForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [isPending, startTransition] = useTransition()

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        }
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        // below you should use api to send your values to db
        setError("")
        setSuccess("")

        console.log(values)

        startTransition(() => {
            newPassword(values, token)
                .then((data) => {
                    setError(data?.error)
                    setSuccess(data?.success)
                })
        })
        
    }
    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending} // to disable the input onSubmit
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success} />
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isPending} // to disable the input onSubmit
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
