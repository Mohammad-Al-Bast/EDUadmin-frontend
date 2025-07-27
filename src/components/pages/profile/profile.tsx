import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { USER } from "@/constants/mock-data"

export default function UserProfileOverview() {
    const [selectedFile, setSelectedFile] = useState<string>("No file chosen")

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file.name)
        } else {
            setSelectedFile("No file chosen")
        }
    }

    return (
        <div className="max-w-md">
            <div className="flex gap-6 mb-8">
                <div className="flex items-center justify-center">
                    <Avatar className="w-26 h-26">
                        <AvatarImage src={USER.avatar} alt={USER.name} />
                        <AvatarFallback className="bg-gray-300 text-gray-600 text-xl">
                            {USER.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                        <div>
                            <div className="text-[#999999] text-sm mb-1">User Name</div>
                            <div className="text-sm font-semibold">{USER.name}</div>
                        </div>

                        <div>
                            <div className="text-[#999999] text-sm mb-1">Campus</div>
                            <div className="text-sm font-semibold">{USER.campus}</div>
                        </div>

                        <div>
                            <div className="text-[#999999] text-sm mb-1">Email</div>
                            <div className="text-sm font-semibold">{USER.email}</div>
                        </div>

                        <div>
                            <div className="text-[#999999] text-sm mb-1">School</div>
                            <div className="text-sm font-semibold">{USER.school}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-4">Change Profile</h3>
                    <Button className="bg-black hover:bg-gray-800 text-white px-6">Upload</Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                        <label
                            htmlFor="profile-upload"
                            className="w-full inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Choose File
                            <span className="ml-3 text-sm font-medium text-[#999999]">{selectedFile}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}
