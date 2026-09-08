"use client";

import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: () => ProductService.getBySlug(slug),
    enabled: Boolean(slug),
  });
