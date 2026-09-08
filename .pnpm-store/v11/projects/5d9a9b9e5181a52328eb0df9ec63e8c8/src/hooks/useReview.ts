"use client";

import { useQuery } from "@tanstack/react-query";
import { ReviewService } from "@/services/review.service";

export const useReview = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: ReviewService.getAll,
  });
};
