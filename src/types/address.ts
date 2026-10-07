export interface AddressResponse {
  id: number;
  contactName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  contactName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}