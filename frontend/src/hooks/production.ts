import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export function useProductsSuggestion() {
  return useQuery({
    queryKey: ["productsSuggestion"],
    queryFn: async () => {
      const response = await api.get("/production/suggestion");
      return response.data;
    },
  });
}
