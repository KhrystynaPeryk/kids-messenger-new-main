import getUsers from "@/data/users"
import Sidebar from "../_components/sidebar/Sidebar"
import ConversationList from "./_components/ConversationList"

import {getConversations} from "@/data/conversations"

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {

    const conversations = await getConversations()
    const users = await getUsers()
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList 
                    users={users}
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    )
}