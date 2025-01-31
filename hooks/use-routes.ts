// SIDEBAR ROUTES

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChat, HiLogout } from "react-icons/hi";
import { HiUsers } from "react-icons/hi2";
import { FaGear } from "react-icons/fa6";

import { logout } from "@/actions/logout";
import useConversation from "./use-conversation";

const useRoutes = () => {
    const pathname = usePathname()
    const {conversationId} = useConversation()

    const routes = useMemo(() => [
        {
            label: 'Chat',
            href: '/conversations',
            icon: HiChat,
            active: pathname === '/conversations' || !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUsers,
            active: pathname === '/users'
        },
        {
            label: 'Settings',
            href: '/settings',
            icon: FaGear,
            active: pathname === '/settings'
        },
        {
            label: 'Logout',
            href: '/auth/login',
            icon: HiLogout,
            onClick: () => logout()
        }
    ], [pathname, conversationId])

    return routes
}

export default useRoutes
