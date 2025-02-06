import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { NextResponse } from "next/server"

// interface IParams {
//     conversationId? : string
// }

export async function DELETE(
    request: Request,
    {params}: any
) {
    try {
        const user = await currentUser()

        const { conversationId } = await params

        if (!user?.id) {
            return new NextResponse('Unauthorized', {status: 401})
        }
        
        const existingConversation = await db.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        if (!existingConversation) {
            return new NextResponse('Invalild ID', {status: 400})
        }

        const deletedConversation = await db.conversation.deleteMany({
            where: {
                id: conversationId,
                // only users which are part of the group can remove the conversation
                userIds: {
                    hasSome: [user.id]
                }
            }
        })

        // will deletes a conversation in a real-time without a need of reloading a page
        existingConversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deletedConversation)
    } catch (error: any) {
        console.log(error, "ERROR_CONVERSATION_DELETE")
        return new NextResponse('Internal Error', {status: 500})
    }
}