import { AuthContext } from "@/contexts/Auth/AuthContext"
import { useContext } from "react"

export const useAuth = () => {
    const user = useContext(AuthContext)
    return user
}