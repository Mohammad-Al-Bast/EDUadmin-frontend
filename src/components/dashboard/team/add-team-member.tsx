import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";

import { useRegister } from "@/hooks/register/use-register";
import { registerSchema, type RegisterFormData } from "@/schemas/register";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AddTeamMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [showPasswordInfo, setShowPasswordInfo] = useState(true);

  const { register, loading, clearState } = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      locked_user_email: "",
      password: "",
      confirmPassword: "",
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

  const strength = checkStrength(passwordValue);
  const totalRequirements = 5;
  const strengthScore = useMemo(
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

  // Clear state when component mounts
  useEffect(() => {
    clearState();
  }, [clearState]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        name: data.name,
        email: data.email,
        locked_user_email: data.locked_user_email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      toast.success("Team member added successfully!");
      form.reset();
      setPasswordValue("");
      onSuccess?.();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add team memeber. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter full name"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter email address"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locked_user_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locked User Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter locked user email address"
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswordInfo(!showPasswordInfo)}
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    {showPasswordInfo ? "Hide" : "Show"} requirements
                  </Button>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      disabled={loading}
                      onChange={(e) => {
                        field.onChange(e);
                        setPasswordValue(e.target.value);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />

                {/* Password strength indicator */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-full rounded-full ${getStrengthColor(
                        strengthScore
                      )}`}
                      style={{
                        width: `${(strengthScore / totalRequirements) * 100}%`,
                        minWidth: strengthScore > 0 ? "20%" : "0%",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {getStrengthText(strengthScore)}
                    </span>
                  </div>
                </div>
              </FormItem>
            );
          }}
        />

        {/* Password requirements */}
        <div
          id="password-info-section"
          aria-hidden={!showPasswordInfo}
          className={`overflow-hidden transition-all duration-500 ${
            showPasswordInfo
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <Card className="border-muted">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-2">
                Password Requirements:
              </h4>
              <ul className="space-y-1">
                {strength.map((req, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 text-xs ${
                      req.met ? "text-emerald-600" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        req.met ? "bg-emerald-500" : "bg-muted-foreground/30"
                      }`}
                    />
                    {req.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
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

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || !form.formState.isValid}
            className="min-w-[120px]"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddTeamMemberForm;
