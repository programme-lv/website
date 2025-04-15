// data access layer
import 'server-only'
import getUserRole from './user/role'

export async function isAdmin() {
    const role = await getUserRole()
    return role.data?.role === "admin"
}