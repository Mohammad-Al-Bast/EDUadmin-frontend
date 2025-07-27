
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { profileUploadSchema, type ProfileUploadFormData } from "@/schemas/profile/profile"
import { USER } from "@/constants/mock-data"
import { Loader2 } from "lucide-react"

export default function UserProfileOverview() {
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement | null>(null)

    const form = useForm<ProfileUploadFormData>({
        resolver: zodResolver(profileUploadSchema),
        defaultValues: {
            file: undefined,
        },
        mode: 'onChange',
    })

    const onSubmit = async (data: ProfileUploadFormData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // TODO: Replace with actual upload logic
            console.log("File submitted:", data.file)
            form.reset()
            if (inputRef.current) inputRef.current.value = ""
        } catch (err) {
            // TODO: Handle error (show notification, log error, etc.)
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md">
            <div className="flex gap-6 mb-8">
                <div className="flex items-center justify-center">
                    <Avatar className="w-26 h-26">
                        <AvatarImage src={USER.avatar} alt={USER.name} />
                        <AvatarFallback className="bg-[#D9D9D9] text-gray-600 text-xl">
                            {USER.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex-1 flex flex-col justify-center">
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

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Change Profile</h3>
                        <Button
                            type="submit"
                            variant="default"
                            className="px-6"
                            disabled={isLoading || !form.formState.isValid}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload"
                            )}
                        </Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="profile-upload"
                                            className="hidden"
                                            accept="image/*"
                                            ref={inputRef}
                                            disabled={isLoading}
                                            onChange={e => {
                                                const file = e.target.files?.[0]
                                                field.onChange(file)
                                            }}
                                        />
                                        <label
                                            htmlFor="profile-upload"
                                            className="w-full inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium cursor-pointer"
                                        >
                                            Choose File
                                            <span className="ml-3 text-sm font-medium text-[#999999]">
                                                {field.value instanceof File ? field.value.name : "No file chosen"}
                                            </span>
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    )
}
