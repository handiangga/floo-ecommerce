"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";

export const useProducts = (params?: any) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => ProductService.getAll(params),
  });
};
