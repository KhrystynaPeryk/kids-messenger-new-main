"use client"

import { CardWrapper } from "./card-wrapper"
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

import { useState, useTransition } from "react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { ResetSchema } from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

import { FormError } from "../form-errors"
import { FormSuccess } from "../form-success"

import { reset } from "@/actions/reset"

export const ResetForm = () => {
    const [isPending, startTransition] = useTransition()

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        }
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        // below you should use api to send your values to db
        setError("")
        setSuccess("")

        console.log(values)

        startTransition(() => {
            reset(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                })
        })
        
    }
    return (
        <CardWrapper
            headerLabel="Forgot your password?"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            disabled={isPending} // to disable the input onSubmit
                                            placeholder="john.doe@example.com"
                                            type="email"
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
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
