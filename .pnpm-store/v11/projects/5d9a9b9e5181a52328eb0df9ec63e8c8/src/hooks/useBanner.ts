import { useQuery } from "@tanstack/react-query";
import { BannerService } from "@/services/banner.service";

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: BannerService.getAll,
  });
}
