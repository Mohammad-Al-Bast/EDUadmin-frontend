import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/schemas/auth/reset-password';
import { Link, useLocation } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [showPasswordInfo, setShowPasswordInfo] = useState(true);

    // Password strength logic
    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: 'At least 8 characters' },
            { regex: /[A-Z]/, text: 'At least one uppercase letter' },
            { regex: /[a-z]/, text: 'At least one lowercase letter' },
            { regex: /[0-9]/, text: 'At least one number' },
            { regex: /[^A-Za-z0-9]/, text: 'At least one special character' },
        ];
        return requirements.map((req) => ({
            met: req.regex.test(pass),
            text: req.text,
        }));
    };

    const strength = checkStrength(newPasswordValue);
    const totalRequirements = 5;
    const strengthScore = React.useMemo(() => strength.filter((req) => req.met).length, [strength]);
    const getStrengthColor = (score: number) => {
        if (score === 0) return 'bg-border';
        if (score < totalRequirements) return 'bg-yellow-500';
        if (score === totalRequirements) return 'bg-emerald-500';
        return 'bg-border';
    };
    const getStrengthText = (score: number) => {
        if (score === 0) return 'Enter a password';
        if (score < totalRequirements) return 'Password not strong enough';
        if (score === totalRequirements) return 'Strong password';
        return 'Enter a password';
    };
    const id = 'new-password-strength';


    // Get email from query param if present
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const emailFromQuery = searchParams.get('email') || '';

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromQuery,
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        mode: 'onChange',
    });

    // If the email query param changes, update the form value
    useEffect(() => {
        if (emailFromQuery) {
            form.setValue('email', emailFromQuery);
        }
    }, [emailFromQuery, form]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        try {
            console.log('Reset password form submitted with data:', data);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // TODO: Replace with actual API call
            // TODO: Handle successful reset (show notification, redirect, etc.)

            form.reset();
        } catch (err) {
            // TODO: Handle error (show notification, log error, etc.)
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showOldPassword ? 'text' : 'password'}
                                        placeholder="Enter your old password"
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


                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="Enter your new password"
                                            disabled={isLoading}
                                            {...field}
                                            onChange={e => {
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
                                        type={showConfirmPassword ? 'text' : 'password'}
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
                        {showPasswordInfo ? 'Hide password requirements' : 'Show password requirements'}
                    </button>
                </div>


                {/* Password requirements and strength section, toggled */}
                <div
                    id="password-info-section"
                    aria-hidden={!showPasswordInfo}
                    className={`overflow-hidden transition-all duration-500 ${showPasswordInfo ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0 pointer-events-none'}`}
                >
                    {/* Password strength indicator */}
                    <div className="bg-border h-1 w-full overflow-hidden rounded-full" role="progressbar" aria-valuenow={strengthScore} aria-valuemin={0} aria-valuemax={totalRequirements} aria-label="Password strength">
                        <div
                            className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                            style={{ width: `${(strengthScore / totalRequirements) * 100}%` }}
                        ></div>
                    </div>
                    {/* Password strength description */}
                    <p id={`${id}-description`} className="text-foreground my-2 text-sm font-medium">
                        {getStrengthText(strengthScore)}. Must contain:
                    </p>
                    {/* Password requirements list */}
                    <ul className="space-y-1.5 mb-4" aria-label="Password requirements">
                        {strength.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {req.met ? (
                                    <Check size={16} className="text-emerald-500" aria-hidden="true" />
                                ) : (
                                    <X size={16} className="text-destructive" aria-hidden="true" />
                                )}
                                <span className={`text-xs ${req.met ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                                    {req.text}
                                    <span className="sr-only">
                                        {req.met ? ' - Requirement met' : ' - Requirement not met'}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !form.formState.isValid}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Resetting Password...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
                Remembered your password?{' '}
                <Link to="/auth/login" className="text-primary underline hover:text-primary/80">
                    Log in here
                </Link>
            </div>
        </Form>
    );
};

export default ResetPasswordPage;