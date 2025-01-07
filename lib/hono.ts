import { hc } from 'hono/client';

import { AppType } from '@/app/api/[[...route]]/route';

const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://track-n-work.vercel.app'
        : 'http://localhost:3000');

export const client = hc<AppType>(baseUrl!, {
    headers: {
        'Content-Type': 'application/json',
    },
});
