import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const getConversations = async () => {
    const user = await currentUser()

    if (!user?.id) {
        return []
    }

    try {
        // we are going to load every single conversation that includes our user (single (one on one conversations and group chats))
        const conversations = await db.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                userIds: {
                    has: user.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        })

        return conversations
    } catch (error: any) {
        return []
    }
}

export const getConversationById = async ( consversationId: string) => {
    try {
        const user = await currentUser()

        if(!user?.email) {
            return null
        }

        const conversation = await db.conversation.findUnique({
            where: {
                id: consversationId
            },
            include: {
                users: true
            }
        })
        return conversation
    } catch (error: any) {
        return null
    }
}