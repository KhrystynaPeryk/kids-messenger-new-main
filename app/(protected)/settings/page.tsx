"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { settings } from "@/actions/settings"
import { useTransition, useState } from "react"
import { useSession } from "next-auth/react"

import * as z from 'zod'
import {useForm} from "react-hook-form"
import { SettingsSchema } from "@/schemas"
import {Form, FormField, FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCurrentUser } from "@/hooks/use-current-user"

import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-errors"

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import { UserRole } from "@prisma/client"
import { useRouter } from "next/navigation"
import { CldUploadWidget } from 'next-cloudinary' 

import Image from "next/image"

const SettingsPage = () => {
    const user = useCurrentUser()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const {update} = useSession()
    const [isPending, startTransition] = useTransition()

    const router = useRouter()
    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined,
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            image: user?.image || undefined
        }
    })

    const handleUpload = (result: any) => {
        form.setValue('image', result?.info?.secure_url, { shouldValidate: true })
    }
    const image = form.watch('image')

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(() => {
            settings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error)
                    } 

                    if (data.success) {
                        // to update the values of the current session
                        update()
                        setSuccess(data.success)
                        router.back()
                    }
                })
                .catch(() => setError("Something went wrong"))
        })
    }
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-[400px] shadow-md">
                <CardHeader>
                    <p className="text-2xl font-semibold text-center">
                        ⚙️ Settings
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <FormField control={form.control} name="name" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="John Doe" disabled={isPending}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                {user?.isOAuth === false && (
                                    <>
                                    <FormField control={form.control} name="email" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="john.doe@example.com" type="email" disabled={isPending}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="password" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="******" value={field.value || ""} type="password" disabled={isPending}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name="newPassword" render={({field}) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="******" value={field.value || ""} type="password" disabled={isPending}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    </>
                                )}
                                <FormField control={form.control} name="role" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={UserRole.USER}>User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}/>


                                <FormField control={form.control} name="image" render={() => (
                                    <FormItem>
                                        <FormLabel>Profile Image</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col items-center gap-4">
                                                    <CldUploadWidget
                                                        uploadPreset="Kids-messenger-image"
                                                        onSuccess={handleUpload}
                                                    >
                                                        {({ open }) => (
                                                            <Image onClick={() => open()} src={image || user?.image || '/images/avatar-placeholder.jpg'} width="48" height="48" className="rounded-full" alt="Avatar"/>
                                                        )}
                                                    </CldUploadWidget>
                                                </div>
                                            </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>


                            </div>
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <div className="flex justify-between flex-col gap-y-2">
                                <Button type="submit" variant="gradient" disabled={isPending}>Save</Button>
                                <Button type="button" onClick={() => router.back()} variant="destructive" disabled={isPending}>Cancel</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>

    )
}

export default SettingsPage