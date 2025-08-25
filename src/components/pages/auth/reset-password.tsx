import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  changePasswordSchema,
  tokenResetPasswordSchema,
  type ResetPasswordFormData,
} from "@/schemas/auth/reset-password";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authServices } from "@/services/login/login.service";
import { toast } from "sonner";

const ResetPasswordPage: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailFromQuery = searchParams.get("email") || "";
  const tokenFromQuery = searchParams.get("token") || "";

  // Determine if this is a token-based reset or change password flow
  const isTokenBasedReset = !!tokenFromQuery;
  const pageTitle = isTokenBasedReset
    ? "Reset Your Password"
    : "Change Your Password";
  const submitButtonText = isTokenBasedReset
    ? "Reset Password"
    : "Change Password";

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
  const id = "new-password-strength";

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(
      isTokenBasedReset ? tokenResetPasswordSchema : changePasswordSchema
    ),
    defaultValues: {
      email: emailFromQuery,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  // If the email query param changes, update the form value
  useEffect(() => {
    if (emailFromQuery) {
      form.setValue("email", emailFromQuery);
    }
  }, [emailFromQuery, form]);

  // Update form validation when flow type changes
  useEffect(() => {
    // Clear errors and re-validate when flow type changes
    form.clearErrors();
    form.trigger();
  }, [isTokenBasedReset, form]);

  // Custom validation function to handle conditional oldPassword requirement
  const isFormValid = () => {
    const values = form.getValues();
    if (!isTokenBasedReset && !values.oldPassword) {
      return false;
    }
    return form.formState.isValid;
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      if (isTokenBasedReset) {
        // Token-based password reset flow
        await authServices.resetPassword({
          token: tokenFromQuery,
          email: data.email,
          password: data.newPassword,
          password_confirmation: data.confirmNewPassword,
        });
        toast.success(
          "Password reset successfully! You can now log in with your new password."
        );
        navigate("/auth/login");
      } else {
        // Change password flow (user is authenticated)
        if (!data.oldPassword) {
          toast.error("Current password is required");
          return;
        }
        await authServices.changePassword({
          current_password: data.oldPassword,
          password: data.newPassword,
          password_confirmation: data.confirmNewPassword,
        });
        toast.success("Password changed successfully!");
        form.reset();
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Password operation failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-center">{pageTitle}</h1>
          {isTokenBasedReset && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Enter your new password below
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    disabled={
                      isLoading || (isTokenBasedReset && !!emailFromQuery)
                    }
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isTokenBasedReset && (
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowOldPassword((v) => !v)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-l-none border-l-2 focus:outline-none"
                      disabled={isLoading}
                    >
                      {showOldPassword ? (
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
        )}

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setNewPasswordValue(e.target.value);
                      }}
                      aria-describedby="new-password-strength-description"
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
            );
          }}
        />

        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
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
        <div className="flex justify-end mt-3">
          <button
            type="button"
            className="text-xs text-primary underline hover:text-primary/80 focus:outline-none transition-colors"
            aria-expanded={showPasswordInfo}
            aria-controls="password-info-section"
            onClick={() => setShowPasswordInfo((v) => !v)}
          >
            {showPasswordInfo
              ? "Hide password requirements"
              : "Show password requirements"}
          </button>
        </div>

        {/* Password requirements and strength section, toggled */}
        <div
          id="password-info-section"
          aria-hidden={!showPasswordInfo}
          className={`overflow-hidden transition-all duration-500 ${
            showPasswordInfo
              ? "max-h-96 opacity-100 mt-2"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          {/* Password strength indicator */}
          <div
            className="bg-border h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={totalRequirements}
            aria-label="Password strength"
          >
            <div
              className={`h-full ${getStrengthColor(
                strengthScore
              )} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / totalRequirements) * 100}%` }}
            ></div>
          </div>
          {/* Password strength description */}
          <p
            id={`${id}-description`}
            className="text-foreground my-2 text-sm font-medium"
          >
            {getStrengthText(strengthScore)}. Must contain:
          </p>
          {/* Password requirements list */}
          <ul className="space-y-1.5 mb-4" aria-label="Password requirements">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <Check
                    size={16}
                    className="text-emerald-500"
                    aria-hidden="true"
                  />
                ) : (
                  <X
                    size={16}
                    className="text-destructive"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-xs ${
                    req.met ? "text-emerald-600" : "text-muted-foreground"
                  }`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met ? " - Requirement met" : " - Requirement not met"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isTokenBasedReset
                ? "Resetting Password..."
                : "Changing Password..."}
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        {isTokenBasedReset ? (
          <>
            Remembered your password?{" "}
            <Link
              to="/auth/login"
              className="text-primary underline hover:text-primary/80"
            >
              Log in here
            </Link>
          </>
        ) : (
          <>
            Want to go back?{" "}
            <Link
              to="/dashboard"
              className="text-primary underline hover:text-primary/80"
            >
              Return to Dashboard
            </Link>
          </>
        )}
      </div>
    </Form>
  );
};

export default ResetPasswordPage;
