import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSelector } from "@/hooks/redux"
import { selectUser } from "@/store/selectors/authSelectors"

export default function UserProfileOverview() {
    const user = useAppSelector(selectUser)

    // If no user is found, return early
    if (!user) {
        return <div>Loading user information...</div>
    }

    // Generate initials from user name
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    return (
        <div className="max-w-md">
            <div className="flex gap-6 mb-8">
                <div className="flex items-center justify-center">
                    <Avatar className="w-26 h-26">
                        <AvatarImage src="/avatars/default.jpg" alt={user.name} />
                        <AvatarFallback className="bg-[#D9D9D9] text-gray-600 text-xl">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                        <div>
                            <div className="text-[#999999] text-sm mb-1">User Name</div>
                            <div className="text-sm font-semibold">{user.name}</div>
                        </div>

                        <div>
                            <div className="text-[#999999] text-sm mb-1">Status</div>
                            <div className="text-sm font-semibold">{user.is_verified ? 'Verified' : 'Not Verified'}</div>
                        </div>

                        <div>
                            <div className="text-[#999999] text-sm mb-1">Email</div>
                            <div className="text-sm font-semibold">{user.email}</div>
                        </div>

                        <div>
                            <div className="text-[#999999] text-sm mb-1">Role</div>
                            <div className="text-sm font-semibold">{user.is_admin ? 'Admin' : 'User'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
