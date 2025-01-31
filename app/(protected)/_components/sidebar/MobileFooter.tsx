"use client"

import useConversation from "@/hooks/use-conversation"
import useRoutes from "@/hooks/use-routes"
import MobileItem from "./MobileItem"

const MobileFooter = () => {
    const routes = useRoutes()
    const {isOpen} = useConversation()

    if (isOpen) {
        return null
    }

    return (
        <div className="
            fixed
            justify-around
            w-full
            bottom-0
            left-0
            z-40
            flex
            items-center
            bg-white
            border-y-[1px]
            lg:hidden
        ">
            {routes.map((route) => (
                <MobileItem 
                    key={route.href}
                    href={route.href}
                    icon={route.icon}
                    active={route.active}
                    onClick={route.onClick}
                />
            ))}
        </div>
    )
}

export default MobileFooter