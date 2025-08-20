import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/service/api";
import {
  NewPaymentRequest,
  NewPaymentResponse,
  PaymentsResponse,
  PaymentFetchParams,
} from "@/types/payment";

// Add payment mutation
export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      paymentData: NewPaymentRequest,
    ): Promise<NewPaymentResponse> => {
      const response = await api.post("/leases/payment", paymentData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate properties list to reflect updated payment information
      queryClient.invalidateQueries({
        queryKey: ["properties"],
      });

      // Invalidate all property queries to ensure fresh data
      queryClient.invalidateQueries({
        queryKey: ["property"],
      });

      // Invalidate due rents since payments directly affect rent status
      queryClient.invalidateQueries({
        queryKey: ["properties", "due-rents"],
      });

      // Invalidate payments list to show the new payment
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
  });
};

// Fetch all payments query
export const useGetPayments = (params?: PaymentFetchParams) => {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: async (): Promise<PaymentsResponse> => {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.pageSize !== undefined) {
        searchParams.append("size", params.pageSize.toString());
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }

      const url = `/leases/payments${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await api.get(url);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
