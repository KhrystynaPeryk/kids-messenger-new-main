import { useCurrentUser } from "./use-current-user";
import { useMemo } from "react";
import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | {
    users: User[]
}) => {

    const currentUser = useCurrentUser()
    const otherUser = useMemo(() => {
        const currentUserEmail = currentUser?.email
        // we are going to leave the user which is NOT our user
        const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail)
        return otherUser[0]
    }, [currentUser?.email, conversation.users])

    return otherUser
}

export default useOtherUser