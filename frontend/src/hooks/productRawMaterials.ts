import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import type { ProductRawMaterialInput } from "../types/ProductRawMaterialInput";

export function useAssociateRawMaterial() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, ProductRawMaterialInput>({
    mutationFn: async ({ product_id, raw_material_id, required_quantity }) => {
      await api.post(
        `/products/${product_id}/raw-materials/${raw_material_id}`,
        {
          required_quantity,
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
