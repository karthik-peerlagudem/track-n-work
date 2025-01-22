import { HeaderLogo } from '@/components/header-logo';
import { Navigation } from '@/components/navigation';
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export const Header = () => {
    return (
        <header className="bg-[#161515] px-4 py-4">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-6">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <ClerkLoaded>
                        <UserButton
                            showName={true}
                            appearance={{
                                elements: {
                                    userButtonOuterIdentifier: 'text-white',
                                    userButtonPopoverActions:
                                        'flex flex-col [&>:first-child]:hidden',
                                },
                            }}
                        />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-500" />
                    </ClerkLoading>
                </div>
            </div>
        </header>
    );
};
