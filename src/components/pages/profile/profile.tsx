import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/store/selectors/authSelectors";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useUserEmails, useAddUserEmail } from "@/hooks/userEmails";
import { emailSchema } from "@/schemas/userEmails";
import { toast } from "sonner";
import type { UserEmail } from "@/types/userEmails/userEmails.types";

export default function UserProfileOverview() {
  const user = useAppSelector(selectUser);

  // Fetch user emails from API
  const {
    userEmails,
    loading: emailsLoading,
    error: emailsError,
    refetch,
  } = useUserEmails(user?.id || 0);
  const {
    addUserEmail,
    loading: addEmailLoading,
    error: addEmailError,
  } = useAddUserEmail();

  // State for managing email inputs (maximum 5 emails)
  const [emails, setEmails] = useState<string[]>(["", "", "", "", ""]);
  const [emailValidationErrors, setEmailValidationErrors] = useState<string[]>(
    []
  );

  // Sync API data with local state
  useEffect(() => {
    if (userEmails.length > 0) {
      const emailStrings = userEmails.map((email) => email.email);
      // Pad with empty strings to maintain 5 slots
      while (emailStrings.length < 5) {
        emailStrings.push("");
      }
      setEmails(emailStrings.slice(0, 5)); // Ensure we don't exceed 5 emails
    }
  }, [userEmails]);

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

  // Get the corresponding UserEmail object for a given index
  const getUserEmailByIndex = (index: number): UserEmail | null => {
    return userEmails[index] || null;
  };

  // Check if an email at a given index is locked
  const isEmailLocked = (index: number): boolean => {
    const userEmail = getUserEmailByIndex(index);
    return userEmail?.is_locked || false;
  };

  // Handle email input change
  const handleEmailChange = (index: number, value: string) => {
    // Don't allow changes to locked emails
    if (isEmailLocked(index)) return;

    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);

    // Clear validation error for this field when user starts typing
    const newErrors = [...emailValidationErrors];
    newErrors[index] = "";
    setEmailValidationErrors(newErrors);
  };

  // Handle email deletion (can't delete locked emails)
  const handleDeleteEmail = (index: number) => {
    if (isEmailLocked(index)) return; // Can't delete locked emails

    const newEmails = [...emails];
    newEmails[index] = "";
    setEmails(newEmails);
  };

  // Validate email format
  const validateEmail = (email: string): string => {
    try {
      emailSchema.parse(email);
      return "";
    } catch (error: any) {
      return error.errors?.[0]?.message || "Invalid email format";
    }
  };

  // Handle save emails
  const handleSaveEmails = async () => {
    if (!user?.id) return;

    // Reset validation errors
    setEmailValidationErrors([]);

    const newErrors: string[] = [];
    const validEmails: string[] = [];

    // Validate all non-empty, non-locked emails
    emails.forEach((email, index) => {
      if (email.trim() !== "" && !isEmailLocked(index)) {
        const validationError = validateEmail(email.trim());
        newErrors[index] = validationError;

        if (!validationError) {
          validEmails.push(email.trim());
        }
      }
    });

    setEmailValidationErrors(newErrors);

    // If there are validation errors, don't proceed
    if (newErrors.some((error) => error !== "")) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    // Add new emails via API
    try {
      for (const email of validEmails) {
        // Check if this email is already in the userEmails (to avoid duplicates)
        const emailExists = userEmails.some(
          (existingEmail) => existingEmail.email === email
        );

        if (!emailExists) {
          await addUserEmail(user.id, { email });
        }
      }

      // Refresh the emails list
      refetch();
      toast.success("Emails saved successfully");
    } catch (error) {
      console.error("Error saving emails:", error);
      toast.error("Failed to save emails. Please try again.");
    }
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
      <div className="mt-2">
        <h2 className="text-2xl font-semibold mb-4">Emails:</h2>

        <div className="space-y-4 max-w-lg">
          {emails.map((email, index) => {
            const isLocked = isEmailLocked(index);
            const userEmail = getUserEmailByIndex(index);
            const hasValidationError = emailValidationErrors[index];

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      disabled={isLocked}
                      placeholder={
                        isLocked
                          ? "Locked Email"
                          : userEmail
                          ? `Email ${index + 1}`
                          : `Email ${index + 1}`
                      }
                      className={`
                        ${isLocked ? "bg-gray-100 cursor-not-allowed" : ""}
                        ${hasValidationError ? "border-red-500" : ""}
                      `}
                    />
                  </div>

                  {/* Delete button - only show for non-locked emails and when there's content */}
                  {!isLocked && (
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

                  {/* Spacer for locked emails to align with others */}
                  {isLocked && <div className="h-10 w-10"></div>}
                </div>

                {/* Validation error message */}
                {hasValidationError && (
                  <p className="text-sm text-red-500 ml-1">
                    {hasValidationError}
                  </p>
                )}
              </div>
            );
          })}

          {/* Save button */}
          <div className="pt-1">
            <Button
              onClick={handleSaveEmails}
              disabled={addEmailLoading || emailsLoading}
            >
              {addEmailLoading ? "Saving..." : "Save Emails"}
            </Button>
          </div>

          {/* Error messages */}
          {emailsError && (
            <div className="text-sm text-red-500">
              Error loading emails: {emailsError.message}
            </div>
          )}

          {addEmailError && (
            <div className="text-sm text-red-500">
              Error saving email: {addEmailError.message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
