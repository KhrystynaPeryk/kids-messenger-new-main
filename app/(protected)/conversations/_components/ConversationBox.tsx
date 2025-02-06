"use client"

import { useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"

import {format} from "date-fns"
import { useCurrentUser } from "@/hooks/use-current-user"
import clsx from "clsx"
import { FullConversationType } from "@/app/types"
import useOtherUser from "@/hooks/use-other-user"
import AvatarWithStatus from "../../_components/AvatarWithStatus"
import AvatarGroup from "../../_components/AvatarGroup"

interface ConversationBoxProps {
    data: FullConversationType
    selected?: boolean
}

const ConversationBox = ({data, selected}: ConversationBoxProps) => {
    const otherUser = useOtherUser(data)
    const currentUser = useCurrentUser()
    const router = useRouter()

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [data.id, router])

    const lastMessage = useMemo(() => {
        const messages = data.messages || []

        return messages[messages.length - 1]
    }, [data.messages])

    const userEmail = useMemo(() => {
        return currentUser?.email
    }, [currentUser?.email])

    //whether user has seen this message
    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false
        }

        const seenArray = lastMessage.seen || []

        if (!userEmail) {
            return false
        }

        return seenArray.filter((user) => user.email === userEmail).length !== 0
    }, [userEmail, lastMessage])

    const lastMessageText = useMemo(() => {
        // if a user sent an image as a last message
        if(lastMessage?.image) {
            return 'Sent an image'
        }

        //if a user sent a text
        if (lastMessage?.body) {
            return lastMessage.body
        }

        return "Started a conversation"

    }, [lastMessage])
    
    return (
        <div 
            onClick={handleClick}
            className={clsx(`
                w-fullrelative
                flex
                items-center
                space-x-3
                hover:bg-neutral-100
                rounded-lg
                transition
                cursor-pointer
                p-3  
            `,
                selected ? 'bg-neutral-100' : 'bg-white'
            )}
        >
            {data.isGroup ? (
                <AvatarGroup users={data.users}/> 
            ) : (
                <AvatarWithStatus user={otherUser} />
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-md font-medium text-gray-900">
                            {data.name || otherUser.name }
                        </p>
                        {lastMessage?.createdAt && (
                            <p className="text-xs text-gray-400 font-light">
                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p className={clsx(`
                        truncate
                        text-sm
                    `, hasSeen ? 'text-gray-500' : 'text-black font-medium'
                    )}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConversationBox