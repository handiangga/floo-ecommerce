"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoryService } from "@/services/category.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });
};
