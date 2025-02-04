"use client"

import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import AvatarWithStatus from "../../_components/AvatarWithStatus"
import LoadingModal from "@/components/LoadingModal"

interface UserBoxProps {
    data: User
}
const UserBox = ({data}: UserBoxProps) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = useCallback(() => {
        setIsLoading(true)

        fetch('/api/conversations', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({userId: data.id})
        })
        .then((response) => response.json()) 
        .then((data) => {
            router.push(`/conversations/${data.id}`)
        })
        .finally(() => setIsLoading(false))
        .catch((error) => {
            console.error('Error in UserBox:', error);
            setIsLoading(false);
        })

    }, [data, router])
    return (
        <>
            {isLoading && <LoadingModal />}
            <div onClick={handleClick} className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer">
                <AvatarWithStatus user={data} />
                <div className="mon-w-0 flex-1">
                    <div className="focus:outline-none">
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-medium text-gray-900">{data.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserBox