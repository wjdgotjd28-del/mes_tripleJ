import axios from "axios";
import type { MaterialInbound } from "../../../type";

const BASE_URL = import.meta.env.VITE_API_URL;
// 원자재 입고 이력 페이지 조회
export const getMaterialInbound = async (): Promise<MaterialInbound[]> => {
  const response = await axios.get(`${BASE_URL}/materials/inbound`);
  return response.data;
};


// 원자재 입고 등록
export const addMaterialInbound = async (materialInbound: Omit<MaterialInbound, "id">): Promise<MaterialInbound> => {
  const response = await axios.post(`${BASE_URL}/materials/inbound/new`, materialInbound);
  return response.data;
};

// 원자재 입고 이력 수정 API
export const updateMaterialInbound = async (materialInbound: MaterialInbound): Promise<MaterialInbound> => {
  const response = await axios.patch(`${BASE_URL}/materials/inbound`, materialInbound);
  return response.data;
};

// 원자재 입고 삭제 
export const deleteMaterailInbound = async (id: number): Promise<MaterialInbound> => {
  const response = await axios.delete(`${BASE_URL}/materials/inbound/${id}`);
  return response.data;
}