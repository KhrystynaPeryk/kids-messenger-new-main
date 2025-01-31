import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

interface IParams {
    conversationId? : string
}

export async function DELETE(
    request: Request,
    {params}: {params: IParams}
) {
    try {
        const user = await currentUser()
        const par = await params
        const { conversationId } = par

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
        return NextResponse.json(deletedConversation)
    } catch (error: any) {
        console.log(error, "ERROR_CONVERSATION_DELETE")
        return new NextResponse('Internal Error', {status: 500})
    }
}