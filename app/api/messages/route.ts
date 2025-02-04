import { NextResponse } from "next/server"
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(
    request: Request
) {
    try {
        const user = await currentUser()
        const body = await request.json()
        const {
            message,
            image,
            conversationId
        } = body

        console.log('Request Body:', body); // Log entire body
        console.log('User:', user?.id, user?.email); // Log user details
        console.log('Conversation ID:', conversationId); // Log conversation ID

        if (!user?.id || !user?.email) {
            return new NextResponse('Unauthorized', {status: 401})
        }
        const newMessage = await db.message.create({
            data: {
                body: message,
                image: image,
                conversation: {
                    connect: {
                        id: conversationId
                    }
                },
                sender: {
                    connect: {
                        id: user.id
                    }
                },
                seen: {
                    connect: {
                        id: user.id
                    }
                }
            },
            include: {
                seen: true,
                sender: true
            }
        })


        // we are preparing an updatedConversation in order to send it to all our Active users to give them a real-time update on a conversation
        const updatedConversation = await db.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date(),
                messages: {
                    connect: {
                        id: newMessage.id
                    }
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        seen: true,

                    }
                }
            }
        })

        // this is going to add a new message in real-time
        await pusherServer.trigger(conversationId, 'messages:new', newMessage)

        const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1]

        updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, 'conversation:update', {
                id: conversationId,
                messages: [lastMessage]
            })
        })

        return NextResponse.json(newMessage)
    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES')
        return new NextResponse('Internal Error', {status: 500})
    }
}