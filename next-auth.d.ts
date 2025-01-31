import NextAuth, { DefaultSession } from "next-auth"
import { UserRole } from "@prisma/client"

export type ExtendedUser = DefaultSession["user"] & {
    // here we are adding new custom fields for a session
    id: string;
    emailVerified: Date
    password: string;
    role: UserRole;
    isOAuth: boolean;
    conversationIds: string[];
    seenMessageIds: string[];
    createdAt: Date;
    updatedAt: Date;
    image: string;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}