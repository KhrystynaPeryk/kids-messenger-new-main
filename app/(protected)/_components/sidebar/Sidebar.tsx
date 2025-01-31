"use client"

import DesktopSidebar from "./DesktopSidebar"
import MobileFooter from "./MobileFooter"
import { useCurrentUser } from "@/hooks/use-current-user"

function Sidebar ({children}: {
    children: React.ReactNode
}) {
    const user = useCurrentUser()
    return (
        <div className="h-full">
            <DesktopSidebar currentUser={user} />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default Sidebar