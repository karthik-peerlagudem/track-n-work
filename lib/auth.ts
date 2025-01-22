import { createClerkClient } from '@clerk/nextjs/server';

export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
});

export async function createGuestUser() {
    const response = await clerkClient.users.createUser({
        skipPasswordRequirement: true,
        firstName: 'Guest',
        lastName: `User-${Date.now()}`,
        // Using a temporary email for Clerk requirement
        emailAddress: [`guest-${Date.now()}@temporary.com`],
    });
    const expiresInSeconds = 60 * 60 * 1; // 1 hour
    debugger;
    const token = await clerkClient.signInTokens.createSignInToken({
        userId: response.id,
        expiresInSeconds,
    });

    return {
        user: {
            id: response.id,
            isGuest: true,
            firstName: response.firstName,
            lastName: response.lastName,
            createdAt: new Date(response.createdAt),
        },
        token,
    };
}
