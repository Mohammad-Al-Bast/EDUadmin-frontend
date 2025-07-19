import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Login form submitted');
    };

    return (
        <form
            onSubmit={handleLogin}
            className='flex flex-col gap-2'
        >
            <Input
                type="email"
                name='email'
                placeholder="Email"
                value=""
            />

            <Input
                type="password"
                name='password'
                placeholder="Password"
                value=""
            />

            <Button
                type="submit"
                color="primary"
                className='mt-3'
            >
                Login
            </Button>
        </form>
    );
};

export default LoginPage;