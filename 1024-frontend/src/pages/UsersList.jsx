import { useEffect, useState } from "react"
import { getUsers } from "../services/api"

export function UsersList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const usersData = await getUsers()
                console.log('usersData', usersData)
                setUsers(usersData)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    return (<>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Users List</h1>
                <ul className="space-y-3">
                    {users.map((user) => (
                        <li 
                            key={user.id}
                            className="px-4 py-3 bg-gray-50 rounded-md hover:bg-gray-200 transition-colors duration-200 text-gray-700"
                        >
                            {user.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    )
}