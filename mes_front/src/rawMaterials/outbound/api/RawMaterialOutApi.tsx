import axios from "axios";
import type { RawMaterialOutItems, RawMaterialInventoryStatus } from "../../../type";

const BASE_URL = import.meta.env.VITE_API_URL;

// 원자재 출고 목록 조회
export async function getRawMaterialOutbound(): Promise<RawMaterialOutItems[]> {
  const res = await axios.get(`${BASE_URL}/raw/outbound`);
  return res.data;
}

// 출고 등록
export async function addRawMaterialOutbound(data: Omit<RawMaterialOutItems, "id" | "outbound_no">): Promise<void> {
  await axios.post(`${BASE_URL}/raw/outbound`, data);
}

// 출고 수정
export async function updateRawMaterialOutbound(data: RawMaterialOutItems): Promise<void> {
  await axios.put(`${BASE_URL}/raw/outbound/${data.id}`, data);
}

// 출고 삭제
export async function deleteRawMaterialOutbound(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/raw/outbound/${id}`);
}

// 출고 가능 재고 목록 조회
export async function getAvailableInventory(): Promise<RawMaterialInventoryStatus[]> {
  const res = await axios.get(`${BASE_URL}/raw/stock`);
  return res.data.filter((item: RawMaterialInventoryStatus) => item.total_qty > 0);
}
