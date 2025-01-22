'use client';
import Image from 'next/image';
import { SignIn, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGuestAuth } from '@/hooks/use-guest-auth';

const SignInPage = () => {
    const { signInAsGuest } = useGuestAuth();

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-16">
                    <h1 className="font-bold text-3xl text-[#2E2A47]">
                        Welcome Back!
                    </h1>
                    <p className="text-base text-[#7E8CA0]">
                        Log in or Create account to get back to your dashboard!
                    </p>
                    <div className="flex flex-col items-center justify-center">
                        <Button
                            onClick={() => {
                                signInAsGuest();
                            }}
                        >
                            Continue as a Guest
                        </Button>

                        <p className="mt-2">or</p>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-8">
                    <ClerkLoaded>
                        <SignIn />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </ClerkLoading>
                </div>
            </div>
            <div className="h-full hidden lg:flex items-center justify-center bg-black">
                <Image src={'/logo.png'} width={250} height={250} alt="logo" />
            </div>
        </div>
    );
};

export default SignInPage;
