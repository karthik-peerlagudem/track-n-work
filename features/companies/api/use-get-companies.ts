import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

export const useGetCompanies = () => {
    const query = useQuery({
        queryKey: ['companies'],
        queryFn: async () => {
            const response = await client.api.companies.$get();

            if (!response.ok) {
                throw new Error('Error fetching companies');
            }

            const { data } = await response.json();
            return data;
        },
    });
    return query;
};
