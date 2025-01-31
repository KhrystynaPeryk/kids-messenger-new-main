import Sidebar from "../_components/sidebar/Sidebar"
import ConversationList from "./_components/ConversationList"

import {getConversations} from "@/data/conversations"

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {

    const conversations = await getConversations()
    return (
        <Sidebar>
            <div className="h-full">
                <ConversationList 
                    initialItems={conversations}
                />
                {children}
            </div>
        </Sidebar>
    )
}