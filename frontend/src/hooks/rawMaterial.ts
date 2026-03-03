import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import type { RawMaterial } from "../types/RawMaterial";
import type { RawMaterialInput } from "../types/RawMaterialInput";

export function useRawMaterials() {
  return useQuery<RawMaterial[], Error>({
    queryKey: ["rawMaterials"],
    queryFn: async () => {
      const response = await api.get("/raw-materials");
      return response.data;
    },
  });
}

export function useCreateRawMaterial() {
  const queryClient = useQueryClient();
  return useMutation<RawMaterial, Error, RawMaterialInput>({
    mutationFn: async (data: RawMaterialInput) => {
      const response = await api.post("/raw-materials", data);
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] }),
  });
}

export function useUpdateRawMaterial() {
  const queryClient = useQueryClient();
  return useMutation<
    RawMaterial,
    Error,
    { id: number; data: RawMaterialInput }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await api.put<RawMaterial>(`/raw-materials/${id}`, data);
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] }),
  });
}

export function useDeleteRawMaterial() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await api.delete(`/raw-materials/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["rawMaterials"] }),
  });
}
