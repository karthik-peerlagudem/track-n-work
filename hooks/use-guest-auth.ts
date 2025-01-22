// import { client } from '@/lib/hono';

import { useClerk, useSignIn } from '@clerk/nextjs';

import { SignInCreateParams } from '@clerk/types';
import { useRouter } from 'next/navigation';

export const useGuestAuth = () => {
    const { signIn } = useSignIn();
    const clerk = useClerk();
    const router = useRouter();

    const signInAsGuest = async () => {
        try {
            // If the user is already signed in, sign them out
            const currentSession = clerk.session;
            if (currentSession) {
                clerk.signOut();
            }

            // const response = await client.api.auth.guest.$post({});
            // const data = await response.json();

            // Sign in with the token from Clerk
            // await signIn?.create({
            //     strategy: 'ticket',
            //     ticket: data.generatedToken.token,
            // })

            const clerkParams: SignInCreateParams = {
                identifier: process.env.NEXT_PUBLIC_GUEST_CRED_EMAIL ?? '',
                password: process.env.NEXT_PUBLIC_GUEST_CRED_PASSWORD,
            };

            await signIn?.create({
                strategy: 'password',
                ...clerkParams,
            });

            if (signIn?.status == 'complete' && signIn?.createdSessionId) {
                await clerk.setActive({
                    session: signIn.createdSessionId,
                });
                //TODO: work around
                router.push('/');
            }
        } catch (error) {
            console.error('Guest sign in failed:', error);
        }
    };

    return { signInAsGuest };
};
