import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Schema for admin password reset
const adminResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmNewPassword: z.string().min(1, "Please confirm the new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type AdminResetPasswordFormData = z.infer<typeof adminResetPasswordSchema>;

interface AdminResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => Promise<void>;
  userName: string;
  isLoading: boolean;
}

export function AdminResetPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  isLoading,
}: AdminResetPasswordDialogProps) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(true);

  const form = useForm<AdminResetPasswordFormData>({
    resolver: zodResolver(adminResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  // Password strength logic
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[A-Z]/, text: "At least one uppercase letter" },
      { regex: /[a-z]/, text: "At least one lowercase letter" },
      { regex: /[0-9]/, text: "At least one number" },
      { regex: /[^A-Za-z0-9]/, text: "At least one special character" },
    ];
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(newPasswordValue);
  const totalRequirements = 5;
  const strengthScore = React.useMemo(
    () => strength.filter((req) => req.met).length,
    [strength]
  );

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score < totalRequirements) return "bg-yellow-500";
    if (score === totalRequirements) return "bg-emerald-500";
    return "bg-border";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score < totalRequirements) return "Password not strong enough";
    if (score === totalRequirements) return "Strong password";
    return "Enter a password";
  };

  const onSubmit = async (data: AdminResetPasswordFormData) => {
    try {
      await onConfirm(data.newPassword);
      form.reset();
      setNewPasswordValue("");
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isLoading) {
      onOpenChange(newOpen);
      if (!newOpen) {
        form.reset();
        setNewPasswordValue("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password for {userName}</DialogTitle>
          <DialogDescription>
            Set a new password for this user. The user will need to use this
            password to log in.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        disabled={isLoading}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setNewPasswordValue(e.target.value);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-l-none border-l-2 focus:outline-none"
                        disabled={isLoading}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmNewPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        disabled={isLoading}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-l-none border-l-2 focus:outline-none"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggle for password info */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-primary underline hover:text-primary/80 focus:outline-none transition-colors"
                onClick={() => setShowPasswordInfo((v) => !v)}
              >
                {showPasswordInfo
                  ? "Hide password requirements"
                  : "Show password requirements"}
              </button>
            </div>

            {/* Password requirements and strength section */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                showPasswordInfo
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              {/* Password strength indicator */}
              <div className="bg-border h-1 w-full overflow-hidden rounded-full mb-2">
                <div
                  className={`h-full ${getStrengthColor(
                    strengthScore
                  )} transition-all duration-500 ease-out`}
                  style={{
                    width: `${(strengthScore / totalRequirements) * 100}%`,
                  }}
                ></div>
              </div>

              {/* Password strength description */}
              <p className="text-foreground mb-2 text-sm font-medium">
                {getStrengthText(strengthScore)}. Must contain:
              </p>

              {/* Password requirements list */}
              <ul className="space-y-1.5 mb-4">
                {strength.map((req, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {req.met ? (
                      <Check size={16} className="text-emerald-500" />
                    ) : (
                      <X size={16} className="text-destructive" />
                    )}
                    <span
                      className={`text-xs ${
                        req.met ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      {req.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
