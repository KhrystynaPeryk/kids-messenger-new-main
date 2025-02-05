import { useEffect, useState } from "react"
import useActiveList from "./use-active-list"
import { Channel, Members } from "pusher-js"
import { pusherClient } from "@/lib/pusher"

const useActiveChannel = () => {
    const {set, add, remove} = useActiveList()
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

    useEffect(() => {
        let channel = activeChannel

        if (!channel) {
            // it will only work if there is an authentication in api/pusher/auth.ts
            channel = pusherClient.subscribe('presence-messenger')
            setActiveChannel(channel)
        }

        // on a special event called 'pusher:subscription_succeeded' we will define our initial members
        // we are going to list all active members and set them in our global store (we use Zustand for that)
        // then we will use our global store to compare who is active or not
        channel.bind('pusher:subscription_succeeded', (members: Members) => {
            const initialMembers: string[] = []

            // this is the initial LOAd event to load all the users
            members.each((member: Record<string, any>) => initialMembers.push(member.id))   // members is a special obj in pusher that's why it has a weird method each()
            set(initialMembers)
        })

        channel.bind("pusher:member_added", (member: Record<string, any>) => {
            add(member.id)
        })

        channel.bind("pusher:member_removed", (member: Record<string, any>) => {
            remove(member.id)
        })

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe('presence-messenger')
                setActiveChannel(null)
            }
        }
    }, [activeChannel, set, add, remove])
}

export default useActiveChannel