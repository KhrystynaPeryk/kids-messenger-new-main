import { getConversationById } from "@/data/conversations"
import { getMessages } from "@/data/messages"
import EmptyState from "../../_components/EmptyState"
import Header from "./_components/Header"
import Body from "./_components/Body"
import Form from "./_components/Form"

// interface IParams{
//     conversationId: string
// }

const ConversationId = async( {params}: any ) => {

    const { conversationId } = await params;

    const conversation = await getConversationById(conversationId)
    const messages = await getMessages(conversationId)

    if(!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }
    return (
        <div className="lg:pl-80 h-full">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body initialMessages={messages}/>
                <Form />
            </div>
        </div>
    )
}

export default ConversationId