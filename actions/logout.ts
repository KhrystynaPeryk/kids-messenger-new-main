"use server"

import { signOut } from "@/auth"

export const logout = async () => {
    // to do some server stuff before logout the user
    await signOut()
}