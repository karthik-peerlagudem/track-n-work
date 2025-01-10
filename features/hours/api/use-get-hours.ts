import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';

type Props = {
    start_date: string;
    end_date: string;
};

export const useGetHours = ({ start_date, end_date }: Props) => {
    const query = useQuery({
        enabled: !!start_date && !!end_date,
        queryKey: ['hours', { start_date, end_date }],
        queryFn: async () => {
            const response = await client.api.hours.$get({
                query: {
                    start_date,
                    end_date,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch hours');
            }
            const { data } = await response.json();
            return data;
        },
    });
    return query;
};
