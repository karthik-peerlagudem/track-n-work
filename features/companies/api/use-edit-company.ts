import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
    (typeof client.api.companies)[':id']['$patch']
>;
type RequestType = InferRequestType<
    (typeof client.api.companies)[':id']['$patch']
>['json'];

export const useEditCompany = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.companies[':id']['$patch']({
                json,
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Company updated');
            queryClient.invalidateQueries({ queryKey: ['company', { id }] });
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
        onError: () => {
            toast.error('Error updating company');
        },
    });
    return mutation;
};
