import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema, type LoginFormData } from '@/schemas/auth/login';
import { useAuth } from '@/hooks/login/use-auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
    const { login, loading: loginLoading, error: loginError } = useAuth();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            
            // Success notification
            toast.success('Login successful!', {
                description: 'Welcome back! You have been logged in successfully.',
            });
            
            // Redirect to dashboard or home page
            navigate('/dashboard');
            
        } catch (err) {
            // Error notification - the error is now a string from Redux state
            const errorMessage = loginError || 'An unexpected error occurred';
            
            toast.error('Login Failed', {
                description: errorMessage,
            });
            
            console.error('Login error:', err);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                                        disabled={loginLoading}
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        disabled={loginLoading}
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-l-none border-l-2 focus:outline-none"
                                        disabled={loginLoading}
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

                {loginError && (
                    <div className="text-sm text-destructive">
                        {loginError}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loginLoading || !form.formState.isValid}
                >
                    {loginLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging In...
                        </>
                    ) : (
                        'Log In'
                    )}
                </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
                Forgot your password?{' '}
                <Link to="/auth/reset-password" className="text-primary underline hover:text-primary/80">
                    Reset it here
                </Link>
            </div>
        </Form>

    );
};

export default LoginPage;