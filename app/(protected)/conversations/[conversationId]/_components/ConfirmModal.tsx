"use client"

import useConversation from "@/hooks/use-conversation";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner"
import Modal from "@/app/(protected)/_components/Modal";
import {FiAlertTriangle} from "react-icons/fi"
import { DialogTitle } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface ConfrimModalProps {
    isOpen?: boolean;
    onClose: () => void
}

const ConfirmModal = ({isOpen, onClose}: ConfrimModalProps) => {
    const router = useRouter()
    const {conversationId} = useConversation()
    const [isLoading, setIsLoading] = useState(false)

    const onDelete = useCallback(() => {
        setIsLoading(true)

        fetch(`/api/conversations/${conversationId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        })
        .then(() => {
            onClose()
            router.push('/conversations')
            router.refresh()
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false))

    }, [conversationId, router, onClose])
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="sm:flex sm:items-start">
                <div className="
                    mx-auto
                    flex
                    h-12w-12
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-red-100
                    sm:mx-0
                    sm:h-10
                    sm:w-10
                ">
                    <FiAlertTriangle 
                        className="h-6 w-6 text-red-600"
                    />
                </div>
                <div className="
                    mt-3
                    text-center
                    sm:ml-4
                    sm:mt-0
                    sm:text-left
                ">
                    <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900">
                            Delete conversation
                    </DialogTitle>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Are you sure you want to delete this conversation?
                            This action cannot be undone.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button variant="destructive" disabled={isLoading} onClick={onDelete}>Delete</Button>
                <Button variant="secondary" disabled={isLoading} onClick={onClose}>Cancel</Button>
            </div>
        </Modal>
    )
}

export default ConfirmModal