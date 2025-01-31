"use client"

import { FullMessageType } from "@/app/types"
import useConversation from "@/hooks/use-conversation"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"

interface BodyProps {
    initialMessages: FullMessageType[]
}

const Body = ({initialMessages}: BodyProps) => {
    const [messages, setMessages] = useState(initialMessages)
    const bottomRef = useRef<HTMLDivElement>(null)

    const {conversationId} = useConversation()

    useEffect(() => {
        fetch(`/api/conversations/${conversationId}/seen`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
        })
    }, [conversationId])
    return (
        <div className="flex-1 overflow-y-auto">
            {messages.map((message, i) => (
                <MessageBox 
                    isLast={i === messages.length-1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className="pt-24" />
        </div>
    )
}

export default Body