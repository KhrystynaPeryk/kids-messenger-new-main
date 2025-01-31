"use client"

import Link from "next/link"
import clsx from "clsx"


interface MobileItemProps {
    icon: any;
    href: string;
    onClick?: () => void;
    active?: boolean
}

const MobileItem = ({icon: Icon, href, onClick, active}: MobileItemProps) => {

    const handleClick = () => {
        if (onClick) {
            return onClick()
        }
    }
// Logout does not work on mobile
    return (
        <li onClick={handleClick} className="list-none">
            <Link 
                href={href}
                className={clsx(`
                    group
                    flex
                    gap-x-3
                    text-sm
                    leading-6
                    font-semibold
                    w-full
                    justify-center
                    p-4
                    text-gray-500
                    hover:text-black
                    hover:bg-gray-100
                `, active && "bg-gray-100 text-black"
                )}    
            >
                <Icon className="h-6 w-6"/>
            </Link>
        </li>
    )
}

export default MobileItem