"use client"

import AvatarWithStatus from "@/app/(protected)/_components/AvatarWithStatus"
import { FullMessageType } from "@/app/types"
import { useCurrentUser } from "@/hooks/use-current-user"
import clsx from "clsx"
import {format} from "date-fns"
import Image from "next/image"
import { useState } from "react"
import ImageModal from "./ImageModal"

interface MessageBoxProps {
    data: FullMessageType
    isLast?: boolean
}

const MessageBox = ({data, isLast} : MessageBoxProps) => {
    const user = useCurrentUser()
    const isOwn = user?.email === data?.sender?.email

    const [imageModalOpen, setImageModalOpen] = useState(false)

    const seenList = (data.seen || []) // in case seen is an undefined we should || [] otherwise it will throw an error
        .filter((user) => user.email !== data?.sender?.email) // removing a current user (sender) name from the list
        .map((user) => user.name) // return a name of users
        .join(', ')

    const container = clsx(
        "flex gap-3 p-4",
        isOwn && "justify-end"
    )

    const avatar = clsx(isOwn && "order-2")

    const body = clsx(
        "flex flex-col gap-2",
        isOwn && "items-end"
    )

    const message = clsx(
        "text-sm w-fit overflow-hidden",
        isOwn ? 'bg-sky-300/40 text-white' : 'bg-gray-100',
        data.image ? 'rounded-full py-2 px-3' : 'rounded-md p-2'
    )

    return (
        <div className={container}>
            <div className={avatar}>
                <AvatarWithStatus user={data.sender} />
            </div>
            <div className={body}>
                <div className="flex items-center gap-1">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createAt), 'p')}
                    </div>
                </div>
                <div className={message}>
                    <ImageModal 
                        src={data.image}
                        isOpen={imageModalOpen}
                        onClose={() => setImageModalOpen(false)}
                    />
                    {data.image ? (
                        <Image 
                            onClick={() => setImageModalOpen(true)}
                            alt="image"
                            height="288"
                            width="288"
                            src={data.image}
                            className="
                                object-cover
                                cursor-pointer
                                hover:scale-110
                                transition
                                translate
                            "
                        />
                    ) : (
                        <div>{data.body}</div>
                    )}
                </div>
                {isLast && isOwn && seenList.length > 0 && (
                    <div className="
                        text-xs
                        font-light
                        text-gray-500
                    ">
                        {`Seen by ${seenList}`}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessageBox