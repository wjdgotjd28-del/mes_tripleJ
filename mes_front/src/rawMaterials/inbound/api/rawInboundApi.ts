import axios from "axios";
import type { MaterialInbound } from "../../../type";

const BASE_URL = import.meta.env.VITE_API_URL;
// 원자재 입고 이력 페이지 조회
export const getMaterialInbound = async (): Promise<MaterialInbound[]> => {
  const response = await axios.get(`${BASE_URL}/materials/inbound`);
  return response.data;
};

export const addMaterialInbound = async (materialInbound: Omit<MaterialInbound, "id">): Promise<MaterialInbound> => {
  const response = await axios.post(`${BASE_URL}/materials/inbound/new`, materialInbound);
  return response.data;
};

// 수정을 위한 데이터 타입 정의
export type UpdateMaterialInboundData = Pick<
  MaterialInbound,
  "specQty" | "specUnit" | "qty" | "inboundDate" | "manufacteDate"
>;

// 원자재 입고 이력 수정 API
export const updateMaterialInbound = async (id: number, data: UpdateMaterialInboundData): Promise<MaterialInbound> => {
  const response = await axios.patch(`${BASE_URL}/materials/inbound/${id}`, data);
  return response.data;
};