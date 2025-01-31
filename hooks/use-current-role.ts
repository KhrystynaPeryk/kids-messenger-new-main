import { useSession } from "next-auth/react";

// creating this hook because it is annoying to always type session.data.user.role
export const useCurrentRole = () => {
    const session = useSession()

    return session.data?.user?.role
}