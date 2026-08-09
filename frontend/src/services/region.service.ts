import api from "@/lib/api";

export type IndonesianRegion = { code: string; name: string };

const get = (path: string) =>
  api.get(path).then((response) => response.data.data as IndonesianRegion[]);

export const RegionService = {
  provinces: () => get("/regions/provinces"),
  regencies: (provinceCode: string) =>
    get(`/regions/regencies/${provinceCode}`),
  districts: (regencyCode: string) => get(`/regions/districts/${regencyCode}`),
  villages: (districtCode: string) => get(`/regions/villages/${districtCode}`),
};
