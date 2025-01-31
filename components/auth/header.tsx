import { Poppins } from "next/font/google";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
})

interface HeaderProps {
    label: string
}

export const Header = ({label}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <Avatar>
                <AvatarImage height={48} width={48} src="/images/logo.png" />
            </Avatar>
            <p className={`text-muted-foreground text-sm ${font.className}`}>{label}</p>
        </div>
    )
}
