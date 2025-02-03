"use client"

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Modal from "../../_components/Modal";
import CustomInput from "../../_components/CustomInput";
import CustomSelect from "../../_components/CustomSelect";
import { Button } from "@/components/ui/button";

interface GroupChatModalProps {
    isOpen?: boolean;
    onClose: () => void;
    users: User[]
}

const GroupChatModal = ({isOpen, onClose, users}: GroupChatModalProps) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            members: []
        }
    })

    const members = watch('members')

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)

        fetch('/api/conversations', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({...data, isGroup: true})
        })
        .then((res) => res.json())
        .then(() => {
            router.refresh()
            onClose()
        })
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false))
    }
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Create a group chat
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Create a chat with more than 2 people
                        </p>
                        <div className="mt-10 flex flex-col gap-y-8">
                            <CustomInput 
                                register={register}
                                label="Name"
                                id="name"
                                disabled={isLoading}
                                required
                                errors={errors}
                            />
                            <CustomSelect
                                disabled={isLoading}
                                label="Members"
                                options={users.map((user) => ({
                                    value: user.id,
                                    label: user.name
                                }))}
                                onChange={(value) => setValue('members', value, {
                                    shouldValidate: true
                                })}
                                value={members}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button type="button" variant="destructive" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" variant="gradient" disabled={isLoading}>Create</Button>

                </div>
            </form>
        </Modal>
    )
}

export default GroupChatModal