import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SigninPage: React.FC = () => {

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log('Signin form submitted');
    };

    return (
        <form
            onSubmit={handleSignin}
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
            >
                Sign In
            </Button>
        </form>
    );
};

export default SigninPage;