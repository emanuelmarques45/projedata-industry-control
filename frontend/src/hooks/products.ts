import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import type { Product } from "../types/Product";
import type { ProductInput } from "../types/ProductInput";

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
    placeholderData: [],
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, ProductInput>({
    mutationFn: async (product: ProductInput) => {
      const response = await api.post("/products", product);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; data: ProductInput }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<Product>(`/products/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
