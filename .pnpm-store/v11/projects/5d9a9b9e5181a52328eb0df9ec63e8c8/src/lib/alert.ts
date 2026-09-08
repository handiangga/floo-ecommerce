import Swal from "sweetalert2";

const base = {
  background: "#fffdf9",
  color: "#34271f",
  confirmButtonColor: "#b88a55",
  cancelButtonColor: "#75645a",
  buttonsStyling: true,
};

export async function confirmDelete(item: string, detail?: string) {
  const result = await Swal.fire({
    ...base,
    icon: "warning",
    title: `Hapus ${item}?`,
    text: detail || "Data yang dihapus tidak dapat dikembalikan.",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
    reverseButtons: true,
    focusCancel: true,
  });
  return result.isConfirmed;
}
export function showSuccess(title: string) {
  return Swal.fire({
    ...base,
    icon: "success",
    title,
    timer: 1800,
    showConfirmButton: false,
  });
}

export function showSuccessToast(title: string) {
  return Swal.fire({
    ...base,
    toast: true,
    position: "top-end",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: true,
  });
}
export function showError(title: string, text?: string) {
  return Swal.fire({ ...base, icon: "error", title, text });
}
