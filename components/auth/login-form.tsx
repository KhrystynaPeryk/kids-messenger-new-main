"use client"

import { CardWrapper } from "./card-wrapper"
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { LoginSchema } from "@/schemas"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

import { FormError } from "../form-errors"
import { FormSuccess } from "../form-success"

import { login } from "@/actions/login"
import Link from "next/link"

export const LoginForm = () => {
    const [isPending, startTransition] = useTransition()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : ""

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        // below you should use api to send your values to db
        setError("")
        setSuccess("")

        startTransition(() => {
            login(values, callbackUrl || undefined)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                })
        })
        
    }
    return (
        <CardWrapper
            headerLabel="Log in with Google or Github"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
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
                                    <Button
                                        size="sm"
                                        variant="link"
                                        asChild
                                        className="px-0 font-normal"
                                    >
                                        <Link href="/auth/reset">Forgot Password?</Link>
                                    </Button>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success} />
                    <Button
                        variant="gradient" 
                        type="submit" 
                        className="w-full" 
                        disabled={isPending} // to disable the input onSubmit
                    >
                        Login</Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
