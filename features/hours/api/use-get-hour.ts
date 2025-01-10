import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

export const useGetHour = (id?: string) => {
    const query = useQuery({
        enabled: !!id,
        queryKey: ['hour', { id }],
        queryFn: async () => {
            const response = await client.api.hours[':id'].$get({
                param: { id },
            });

            if (!response.ok) {
                throw new Error('Error fetching hour');
            }

            const { data } = await response.json();
            return data;
        },
    });
    return query;
};
