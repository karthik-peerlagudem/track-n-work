import { client } from '@/lib/hono';

import { useQuery } from '@tanstack/react-query';

export const useGetSummary = () => {
    const query = useQuery({
        queryKey: ['summary'],
        queryFn: async () => {
            const response = await client.api.summary.$get();

            if (!response.ok) {
                throw new Error('Error in fectching summary');
            }

            return await response.json();
        },
    });

    return query;
};
