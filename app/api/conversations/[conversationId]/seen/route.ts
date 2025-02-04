import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"

interface IParams {
    conversationId? : string
}

export async function POST(
    request: Request,
    {params}: {params: IParams}
) {
    try {
        const user = await currentUser()
        const par = await params
        const { conversationId } = par

        if (!user?.id || !user?.email) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        //Find the existing conversation
        const conversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true
                    }
                },
                users: true
            }
        })

        if (!conversation) {
            return new NextResponse('Invalid ID', {status: 400})
        }

        //Find the last message
        const lastMessage = conversation.messages[conversation.messages.length-1]

        if(!lastMessage) {
            return NextResponse.json(conversation)
        }

        //If we have a lastMessage, we will Update seen of last message
        const updatedMessage = await db.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data: {
                seen: {
                    connect: {
                        id: user.id
                    }
                }
            }
        })

        await pusherServer.trigger(user.email, 'conversation:update', {
            id: conversationId,
            messages: [updatedMessage]
        })

        //if we saw the last message
        if (lastMessage.seenIds.indexOf(user.id) !== -1) {
            return NextResponse.json(conversation)
        }

        //if we did not see the last message
        await pusherServer.trigger(conversationId!, 'message:update', updatedMessage)

        return NextResponse.json(updatedMessage)
    } catch (error: any) {
        console.log(error, 'ERROR_MESSAGES_SEEN')
        return new NextResponse("Internal Error", {status: 500})
    }
}