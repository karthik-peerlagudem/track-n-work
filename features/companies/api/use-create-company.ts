import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.companies.$post>;
type RequestType = InferRequestType<typeof client.api.companies.$post>['json'];

export const useCreateCompany = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.companies.$post({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Company created');
            queryClient.invalidateQueries({ queryKey: ['companies'] });
            queryClient.invalidateQueries({ queryKey: ['hours'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
        onError: () => {
            toast.error('Error creating company');
        },
    });
    return mutation;
};
