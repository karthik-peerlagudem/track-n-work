import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isSafariBrowser = () => {
    if (typeof window === 'undefined') return false;
    return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
};
