"use client"

import DesktopSidebar from "./DesktopSidebar"
import MobileFooter from "./MobileFooter"
import { useCurrentUser } from "@/hooks/use-current-user"

function Sidebar ({children}: {
    children: React.ReactNode
}) {
    const user = useCurrentUser()

    console.log({sidebarUSER: user})  
    
      // Normalize user properties to ensure they are either the correct value or null ------------- fixing the BUILD ERROR
    const normalizedUser = user
    ? {
        ...user,
        email: user.email ?? null,
        name: user.name ?? null,
        image: user.image ?? null,
        password: user.password ?? null,
        emailVerified: user.emailVerified ?? null,
        }
    : undefined;
    return (
        <div className="h-full">
            <DesktopSidebar currentUser={normalizedUser} />
            <MobileFooter />
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default Sidebar