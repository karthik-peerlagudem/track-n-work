import { client } from '@/lib/hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
    (typeof client.api.companies)[':id']['$delete']
>;

export const useDeleteCompany = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.companies[':id']['$delete']({
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Company deleted');
            queryClient.invalidateQueries({ queryKey: ['companies'] });
        },
        onError: () => {
            toast.error('Error deleting company');
        },
    });
    return mutation;
};
