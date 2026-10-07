import { apiFetch } from "./client";
import { ENDPOINTS } from "./endpoints";
import type {
  AddressResponse,
  CreateAddressRequest,
} from "@/types";

export const addressApi = {
  list: () => apiFetch<AddressResponse[]>(ENDPOINTS.users.addresses),
  create: (body: CreateAddressRequest) =>
    apiFetch<AddressResponse>(ENDPOINTS.users.addresses, {
      method: "POST",
      body,
    }),
  update: (id: number, body: CreateAddressRequest) =>
    apiFetch<AddressResponse>(ENDPOINTS.users.addressById(id), {
      method: "PUT",
      body,
    }),
  delete: (id: number) =>
    apiFetch<string>(ENDPOINTS.users.addressById(id), {
      method: "DELETE",
    }),
  setDefault: (id: number) =>
    apiFetch<string>(ENDPOINTS.users.setDefaultAddress(id), {
      method: "PATCH",
    }),
};