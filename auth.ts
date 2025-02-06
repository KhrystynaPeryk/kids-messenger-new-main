import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { getUserById } from "./data/user"
import { UserRole} from "@prisma/client"
import { getAccountByUserId } from "./data/accounts"

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({user}) {
            await db.user.update({
                where: {id: user.id},
                data: {emailVerified: new Date()}
            })
        }
    },
    callbacks: {
        async signIn({user, account} : {user: any, account: any}) {
            console.log({
                user, 
                account
            })
            // Allow OAuth without email verification
            if (account?.provider !== "credentials") return true

            const existingUser = await getUserById(user.id)

            //Prevent signIn without email verification
            if (!existingUser?.emailVerified) return false

            // TODO Add 2FA check

            return true
        },
        async session({token, session}) {

            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }


            // updating a session in case you change the values in settings route
            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email as string
                session.user.isOAuth = token.isOAuth as boolean

                //more properties for a messenger
                session.user.conversationIds = token.conversationIds as string[];
                session.user.seenMessageIds = token.seenMessageIds as string[];
                session.user.createdAt = new Date(token.createdAt as string);
                session.user.updatedAt = new Date(token.updatedAt as string);

                session.user.id = token.id as string
                session.user.emailVerified = new Date(token.emailVerified as string)
                session.user.password = token.password as string

                session.user.image = token.image as string
            }
            return session
        },
        async jwt({token}) {
            console.log("I am beign called again - from auth.ts")
            // token.sub - gives the id of the user from Neon db

            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token

            // getting existing account of a user
            const existingAccount = await getAccountByUserId(
                existingUser.id
            )

            token.isOAuth = !!existingAccount // turning into a boolean

            // updating the values in case they were changed in settings route
            token.name = existingUser.name
            token.role = existingUser.role
            token.email = existingUser.email
            
            //more properties for a messenger
            token.conversationIds = existingUser.conversationIds;
            token.seenMessageIds = existingUser.seenMessageIds;
            token.createdAt = existingUser.createdAt;
            token.updatedAt = existingUser.updatedAt;

            token.id = existingUser.id
            token.emailVerified = existingUser.emailVerified
            token.password = existingUser.password

            token.image = existingUser.image

            return token
        }
    },
    adapter: PrismaAdapter(db),
    session: {strategy: "jwt",},
    ...authConfig,
})