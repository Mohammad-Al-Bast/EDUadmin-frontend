import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/store/selectors/authSelectors";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function UserProfileOverview() {
  const user = useAppSelector(selectUser);

  // State for managing emails
  const [emails, setEmails] = useState<string[]>([
    user?.email || "", // First email is the user's main email (disabled)
    "",
    "",
    "",
    "",
  ]);

  // If no user is found, return early
  if (!user) {
    return <div>Loading user information...</div>;
  }

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Handle email input change
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  // Handle email deletion (can't delete the first one)
  const handleDeleteEmail = (index: number) => {
    if (index === 0) return; // Can't delete the first email

    const newEmails = [...emails];
    newEmails[index] = "";
    setEmails(newEmails);
  };

  // Handle save emails
  const handleSaveEmails = () => {
    const validEmails = emails.filter((email) => email.trim() !== "");
    console.log("Saving emails:", validEmails);
    // TODO: Implement API call to save emails
  };

  return (
    <main className="">
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
                <div className="text-sm font-semibold">
                  {user.is_verified ? "Verified" : "Not Verified"}
                </div>
              </div>

              <div>
                <div className="text-[#999999] text-sm mb-1">Email</div>
                <div className="text-sm font-semibold">{user.email}</div>
              </div>

              <div>
                <div className="text-[#999999] text-sm mb-1">Role</div>
                <div className="text-sm font-semibold">
                  {user.is_admin ? "Admin" : "User"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator />

      {/* Emails Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Emails:</h2>

        <div className="space-y-4 max-w-lg">
          {emails.map((email, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  disabled={index === 0} // First email is disabled
                  placeholder={
                    index === 0 ? "Primary Email" : `Email ${index + 1}`
                  }
                  className={
                    index === 0 ? "bg-gray-100 cursor-not-allowed" : ""
                  }
                />
              </div>

              {/* Delete button - only show for emails after the first one */}
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteEmail(index)}
                  className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600"
                  disabled={email === ""}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}

              {/* Spacer for the first email to align with others */}
              {index === 0 && <div className="h-10 w-10"></div>}
            </div>
          ))}

          {/* Save button */}
          <div className="pt-1">
            <Button onClick={handleSaveEmails}>Save Emails</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
