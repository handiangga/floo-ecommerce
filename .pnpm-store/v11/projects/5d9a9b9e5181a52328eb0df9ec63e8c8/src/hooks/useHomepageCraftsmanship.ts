import { useQuery } from "@tanstack/react-query";
import { HomepageCraftsmanshipService } from "@/services/homepage-craftsmanship.service";

export function useHomepageCraftsmanship() {
  return useQuery({ queryKey: ["homepage-craftsmanship"], queryFn: HomepageCraftsmanshipService.get });
}
