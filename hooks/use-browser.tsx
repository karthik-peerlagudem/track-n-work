import { useEffect, useState } from 'react';
import { isSafariBrowser } from '@/lib/utils';

export const useBrowser = () => {
    const [isSafari, setIsSafari] = useState(false);

    useEffect(() => {
        setIsSafari(isSafariBrowser());
    }, []);
    return { isSafari };
};
