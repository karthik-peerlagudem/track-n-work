import { useQueryClient, useMutation } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
    (typeof client.api.hours)[':id']['$delete']
>;

export const useDeleteHours = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType>({
        mutationFn: async () => {
            const response = await client.api.hours[':id']['$delete']({
                param: { id },
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success('Hours deleted');
            queryClient.invalidateQueries({ queryKey: ['hours'] });
        },
        onError: () => {
            toast.error('Error deleting hours');
        },
    });
    return mutation;
};
