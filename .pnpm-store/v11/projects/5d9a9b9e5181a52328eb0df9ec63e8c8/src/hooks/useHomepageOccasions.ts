import { useQuery } from "@tanstack/react-query";
import { HomepageOccasionService } from "@/services/homepage-occasion.service";

export function useHomepageOccasions() {
  return useQuery({ queryKey: ["homepage-occasions"], queryFn: HomepageOccasionService.getAll });
}
