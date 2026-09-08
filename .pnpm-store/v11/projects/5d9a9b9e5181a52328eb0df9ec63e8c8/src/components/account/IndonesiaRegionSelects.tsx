"use client";

import { useEffect, useMemo, useState } from "react";
import { IndonesianRegion, RegionService } from "@/services/region.service";

const selectClassName =
  "w-full rounded-xl border border-border bg-background p-3 text-foreground disabled:cursor-not-allowed disabled:opacity-55";

type RegionSelectProps = {
  regions: IndonesianRegion[];
  value: string;
  placeholder: string;
  disabled?: boolean;
  onChange: (code: string) => void;
};

function RegionSelect({
  regions,
  value,
  placeholder,
  disabled,
  onChange,
}: RegionSelectProps) {
  return (
    <select
      required
      value={value}
      disabled={disabled}
      aria-label={placeholder}
      className={selectClassName}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">{placeholder}</option>
      {regions.map((region) => (
        <option key={region.code} value={region.code}>
          {region.name}
        </option>
      ))}
    </select>
  );
}

export default function IndonesiaRegionSelects() {
  const [provinces, setProvinces] = useState<IndonesianRegion[]>([]);
  const [regencies, setRegencies] = useState<IndonesianRegion[]>([]);
  const [districts, setDistricts] = useState<IndonesianRegion[]>([]);
  const [villages, setVillages] = useState<IndonesianRegion[]>([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [regencyCode, setRegencyCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [villageCode, setVillageCode] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const selectedProvince = useMemo(
    () => provinces.find((region) => region.code === provinceCode),
    [provinceCode, provinces],
  );
  const selectedRegency = useMemo(
    () => regencies.find((region) => region.code === regencyCode),
    [regencies, regencyCode],
  );
  const selectedDistrict = useMemo(
    () => districts.find((region) => region.code === districtCode),
    [districtCode, districts],
  );
  const selectedVillage = useMemo(
    () => villages.find((region) => region.code === villageCode),
    [villageCode, villages],
  );

  useEffect(() => {
    let active = true;
    setLoading("provinces");
    RegionService.provinces()
      .then((data) => active && setProvinces(data))
      .catch(
        () =>
          active &&
          setError("Data wilayah belum dapat dimuat. Coba lagi sebentar."),
      )
      .finally(() => active && setLoading(""));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setRegencyCode("");
    setDistrictCode("");
    setVillageCode("");
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    if (!provinceCode) return;

    let active = true;
    setError("");
    setLoading("regencies");
    RegionService.regencies(provinceCode)
      .then((data) => active && setRegencies(data))
      .catch(
        () =>
          active &&
          setError(
            "Kota/kabupaten belum dapat dimuat. Coba pilih provinsi lagi.",
          ),
      )
      .finally(() => active && setLoading(""));
    return () => {
      active = false;
    };
  }, [provinceCode]);

  useEffect(() => {
    setDistrictCode("");
    setVillageCode("");
    setDistricts([]);
    setVillages([]);
    if (!regencyCode) return;

    let active = true;
    setError("");
    setLoading("districts");
    RegionService.districts(regencyCode)
      .then((data) => active && setDistricts(data))
      .catch(
        () =>
          active &&
          setError(
            "Kecamatan belum dapat dimuat. Coba pilih kota/kabupaten lagi.",
          ),
      )
      .finally(() => active && setLoading(""));
    return () => {
      active = false;
    };
  }, [regencyCode]);

  useEffect(() => {
    setVillageCode("");
    setVillages([]);
    if (!districtCode) return;

    let active = true;
    setError("");
    setLoading("villages");
    RegionService.villages(districtCode)
      .then((data) => active && setVillages(data))
      .catch(
        () =>
          active &&
          setError("Kelurahan belum dapat dimuat. Coba pilih kecamatan lagi."),
      )
      .finally(() => active && setLoading(""));
    return () => {
      active = false;
    };
  }, [districtCode]);

  return (
    <>
      <input
        type="hidden"
        name="province"
        value={selectedProvince?.name || ""}
      />
      <input type="hidden" name="city" value={selectedRegency?.name || ""} />
      <input
        type="hidden"
        name="district"
        value={selectedDistrict?.name || ""}
      />
      <input
        type="hidden"
        name="subdistrict"
        value={selectedVillage?.name || ""}
      />

      <RegionSelect
        regions={provinces}
        value={provinceCode}
        placeholder={
          loading === "provinces" ? "Memuat provinsi..." : "Pilih provinsi"
        }
        disabled={loading === "provinces"}
        onChange={setProvinceCode}
      />
      <RegionSelect
        regions={regencies}
        value={regencyCode}
        placeholder={
          loading === "regencies"
            ? "Memuat kota/kabupaten..."
            : "Pilih kota/kabupaten"
        }
        disabled={!provinceCode || loading === "regencies"}
        onChange={setRegencyCode}
      />
      <RegionSelect
        regions={districts}
        value={districtCode}
        placeholder={
          loading === "districts" ? "Memuat kecamatan..." : "Pilih kecamatan"
        }
        disabled={!regencyCode || loading === "districts"}
        onChange={setDistrictCode}
      />
      <RegionSelect
        regions={villages}
        value={villageCode}
        placeholder={
          loading === "villages" ? "Memuat kelurahan..." : "Pilih kelurahan"
        }
        disabled={!districtCode || loading === "villages"}
        onChange={setVillageCode}
      />

      {error && (
        <p className="text-sm text-destructive md:col-span-2">{error}</p>
      )}
    </>
  );
}
