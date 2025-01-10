import { client } from '@/lib/hono';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
    (typeof client.api.hours)[':id']['$patch']
>;
type RequestType = InferRequestType<
    (typeof client.api.hours)[':id']['$patch']
>['json'];

export const useEditHours = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.hours[':id']['$patch']({
                json,
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Hours updated');
            queryClient.invalidateQueries({ queryKey: ['hours'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
        onError: () => {
            toast.error('Error updating hours');
        },
    });
    return mutation;
};
