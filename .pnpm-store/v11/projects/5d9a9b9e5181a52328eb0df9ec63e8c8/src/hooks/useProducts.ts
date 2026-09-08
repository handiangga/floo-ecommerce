"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { ProductQuery } from "@/types/product";

export const useProducts = (params?: ProductQuery) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => ProductService.getAll(params),
  });
};
