import { currentUser } from "@/lib/auth";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST( request: Request) {
    try {
        const user = await currentUser()
        const body = await request.json()

        // create a schema
        const {
            userId,
            isGroup, 
            members,
            name,
        } = body

        if (!user?.id || !user?.email) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('invalid data', {status: 400})
        }

        // to create a group chat if the group is present
        if (isGroup) {
            const newConversation = await db.conversation.create({
                data: {
                    name,
                    isGroup, 
                    users: {
                        // connect array separately adds the current user to the group of members because when we crearte a group chat we are
                        // not gonna send our own id there because we are gonna filter out our user from the list of possible users to add ina group chat
                        connect: [
                            // iterate over array of members and use the id to connect our users
                            ...members.map((member: {value: string}) => ({
                                id: member.value
                            })),
                            {
                                id: user.id
                            }
                        ]
                    }
                },
                // include will populate the users when we get a conversation (by default when you get a new conversation you will get an array of user id (n ot user obj with data))
                include: {
                    users: true
                }
            })

            newConversation.users.forEach((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, 'conversation:new', newConversation)
                }
            })

            return NextResponse.json(newConversation)
        }

        // we are looking for a single conversation but we cannot use findUnique because some queries do not work with it, we have to use findMany
        const existingConversations = await db.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [user.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, user.id]
                        }
                    }
                ]
            }
        })

        const singleConversation = existingConversations[0]

        if (singleConversation) {
            return NextResponse.json(singleConversation)
        }

        // if a conversation does not exist, let's create a new one
        const newConversation = await db.conversation.create({
            data: {
                users: {
                    connect: [
                        {
                            id: user.id
                        },
                        {
                            id: userId
                        }
                    ]
                }
            },
            include: {
                users: true
            }
        })

        newConversation.users.map((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:new', newConversation)
            }
        })

        return NextResponse.json(newConversation)

    } catch (error: any) {
        return new NextResponse(`Internal error: ${error}`, {status: 500})
    }
}