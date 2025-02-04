"use client"

import { FullMessageType } from "@/app/types"
import useConversation from "@/hooks/use-conversation"
import { useEffect, useRef, useState } from "react"
import MessageBox from "./MessageBox"
import { pusherClient } from "@/lib/pusher"
import { find } from "lodash"

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

    useEffect(() => {
        // every user that is listening to conversationId will get the update
        pusherClient.subscribe(conversationId)
        // every time we join the conversation, it scrolls to the bottom last message
        bottomRef?.current?.scrollIntoView()
        // bind a pusherClient to expect a key from pusherServer api -  'messages:new'
            // firstly, creating a messageHandler
        const messageHandler = (message: FullMessageType) => {
            fetch(`/api/conversations/${conversationId}/seen`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
            })

            setMessages((current) => { // getting access to the current list of messages
                if (find(current, {id: message.id})) { // comparing a current list of messages and searching if there is any message in our current array, which already has an id of this new message that is coming in
                    return current // checking if we are not making any duplicate messages
                }

                return [...current, message]
            })

            bottomRef?.current?.scrollIntoView()
        }

        pusherClient.bind('messages:new', messageHandler)

        //every time we bind, we need to use the unmount method because otherwise it can cause an overflow - we do it by returning
        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind('messages:new', messageHandler)
        }
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