'use client'; // we use this to enable the client-side bundle such as hooks eg: usePathname

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMedia } from 'react-use';

import { NavButton } from '@/components/nav-button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
    SheetHeader,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Image from 'next/image';

const routes = [
    {
        href: '/',
        label: 'Home',
    },
    {
        href: '/companies',
        label: 'Companies',
    },
    {
        href: '/working-hours',
        label: 'Time Sheet',
    },
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const isMobile = useMedia('(max-width: 1023px)', false);

    const onClick = (href: string) => {
        router.push(href);
        setIsOpen(false);
    };

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="sm"
                        variant="outline"
                        className="font-normal bg-white/10 hover:bg-white/30 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
                    >
                        <Menu className="size-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <SheetHeader className="items-center">
                        <SheetTitle>
                            <Image
                                src="/logo.png"
                                width={120}
                                height={24}
                                alt="logo"
                            />
                        </SheetTitle>
                        <SheetDescription className="hidden">
                            Navigation menu
                        </SheetDescription>
                    </SheetHeader>

                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => (
                            <Button
                                key={route.href}
                                variant={
                                    route.href == pathname
                                        ? 'secondary'
                                        : 'ghost'
                                }
                                onClick={() => onClick(route.href)}
                                className="w-full justify-start"
                            >
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <nav className="hidden lg:flex items-center gap-x-4 overflow-auto text-white">
            {routes.map((route) => (
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            ))}
        </nav>
    );
};
