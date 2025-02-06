import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

const getUsers = async () => {
    const user = await currentUser()

    console.log({userFromDataUsers: user})

    if (!user?.email) {
        return []
    }

    try {
        // we are finding all the users EXCEPT our own user
        const users = await db.user.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                NOT: {
                    email: user.email
                }
            }
        })

        return users
    } catch(error: any) {
        return []
    }
}

export default getUsers