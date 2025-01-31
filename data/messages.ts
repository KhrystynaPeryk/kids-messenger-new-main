import { db } from "@/lib/db";

export const getMessages = async (conversationId: string) => {
    try {
        const messages = await db.message.findMany({
            where: {
                conversationId: conversationId
            },
            include: {
                sender: true,
                seen: true
            },
            orderBy: {
                createAt: 'asc'
            }
        })

        return messages
    } catch (error: any) {
        return []
    }
}