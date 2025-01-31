"use client"

import Image from "next/image"
import { User } from "@prisma/client"

interface AvatarWithStatusProps {
    user?: User
}

const AvatarWithStatus = ({user}: AvatarWithStatusProps) => {
        
    return (
        <div className="relative">
            <div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11">
                <Image alt="avatar" src={user?.image || '/images/avatar-placeholder.jpg'} fill />
            </div>
            <span className="
                absolute
                block
                rounded-full
                bg-green-500
                ring-2
                ring-white
                top-0
                right-0
                h-2
                w-2
                md:h-3
                md:w-3
            ">
            </span>
        </div>
    )
}

export default AvatarWithStatus