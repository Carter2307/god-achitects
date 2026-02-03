import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { type AxiosRequestConfig } from "axios";
import { api, getErrorMessage, type ApiError } from "~/lib/axios";

type QueryKeyT = readonly unknown[];

// Generic GET hook
export function useApiQuery<T>(
  queryKey: QueryKeyT,
  url: string,
  options?: Omit<UseQueryOptions<T, ApiError>, "queryKey" | "queryFn">,
  config?: AxiosRequestConfig
) {
  return useQuery<T, ApiError>({
    queryKey,
    queryFn: async () => {
      const response = await api.get<T>(url, config);
      return response.data;
    },
    ...options,
  });
}

// Generic POST hook
export function useApiMutation<TData, TVariables>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn">
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const response = await api.post<TData>(url, variables);
      return response.data;
    },
    ...options,
  });
}

// Generic PUT hook
export function useApiPut<TData, TVariables>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn">
) {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables) => {
      const response = await api.put<TData>(url, variables);
      return response.data;
    },
    ...options,
  });
}

// Generic DELETE hook
export function useApiDelete<TData>(
  url: string,
  options?: Omit<UseMutationOptions<TData, ApiError, void>, "mutationFn">
) {
  return useMutation<TData, ApiError, void>({
    mutationFn: async () => {
      const response = await api.delete<TData>(url);
      return response.data;
    },
    ...options,
  });
}

// Hook for invalidating queries after mutations
export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return (queryKey: QueryKeyT) => {
    queryClient.invalidateQueries({ queryKey });
  };
}

// Re-export error helper
export { getErrorMessage };
