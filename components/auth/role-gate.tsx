"use client"

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-errors";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole
}

const RoleGate = ({children, allowedRole}: RoleGateProps) => {
    const role = useCurrentRole()

    if (role !== allowedRole) {
        return (
            <FormError message="You do not have permission to view this  content" />
        )
    }
    return (
        <div>{children}</div>
    )
}

export default RoleGate