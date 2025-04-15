// data access layer
import 'server-only'
import { getUserRole } from './auth'

export async function isAdmin() {
    const role = await getUserRole()
    return role.data === "admin"
}