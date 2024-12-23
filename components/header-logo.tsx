import Link from 'next/link';
import Image from 'next/image';

export const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src="/logo.png" alt="logo" width={240} height={24} />
            </div>
        </Link>
    );
};
