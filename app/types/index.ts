import { Conversation, Message, User } from "@prisma/client";

export type FullMessageType = Message & {
    sender: User,
    seen: User[]
}

// in getConversations() we use include that ill ALSO populate users: and messages:
export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMessageType[]
}