"use client"

import useConversation from "@/hooks/use-conversation"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2"
import MessageInput from "./MessageInput"
import { Button } from "@/components/ui/button"
import { CldUploadButton } from 'next-cloudinary';

const Form = () => {

    const {conversationId} = useConversation()

    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues:{
            message: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        // shouldValidate will clear the message input
        setValue('message', '', {shouldValidate: true})

        fetch('/api/messages', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({...data, conversationId})
        })
    }

    const handleUpload = (result: any) => {
        fetch('/api/messages', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({image: result?.info?.secure_url, conversationId})
        }).then((response) => response.json()) 
    }

    return (
        <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
            <CldUploadButton options={{maxFiles: 1}} uploadPreset="Kids-messenger-image" onSuccess={handleUpload}>
                <HiPhoto size={30} className="text-sky-500"/>
            </CldUploadButton>
            <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2 lg:gap-4 w-full">
                <MessageInput id="message" register={register} errors={errors} required placeholder="Write a message"/>
                <Button type="submit" variant='gradient'>
                    <HiPaperAirplane size={18} className="text-white"/>
                </Button>
            </form>
        </div>
    )
}

export default Form