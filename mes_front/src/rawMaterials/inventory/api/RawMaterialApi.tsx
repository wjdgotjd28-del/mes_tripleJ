import axios from "axios";
import type { RawMaterialInventoryStatus } from "../../../type";

// 환경 변수에서 API 서버 주소를 불러옴
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 원자재 재고 현황 조회 함수
 * - GET {VITE_API_URL}/raw-materials/inventory 요청을 수행합니다.
 *
 * @returns RawMaterialInventoryStatus[] - 원자재 재고 데이터 배열
 */
export async function fetchRawMaterialInventory(): Promise<
  RawMaterialInventoryStatus[]
> {
  const response = await axios.get(`${BASE_URL}/raw-materials/inventory`);
  return response.data;
}
