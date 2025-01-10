import { client } from '@/lib/hono';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { InferResponseType, InferRequestType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.hours.$post>;
type RequestType = InferRequestType<typeof client.api.hours.$post>['json'];

interface ApiErrorResponse {
    message: string;
    status?: number;
}

export const useCreateHours = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.hours.$post({ json });

            if (!response.ok) {
                const error = (await response.json()) as ApiErrorResponse;
                toast.error(error.message);
            }

            return (await response.json()) as Promise<ResponseType>;
        },
        onSuccess: () => {
            toast.success('Logged Work Hours');
            queryClient.invalidateQueries({ queryKey: ['hours'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
        onError: () => {
            toast.error('Error logging work hours');
        },
    });
    return mutation;
};
