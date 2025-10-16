import axios from "axios";
import type { OrderInView } from "../../../type";

// 환경 변수에서 API 서버 주소를 불러옴
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 수주 대상 품목 입고 목록 조회
 * - GET {VITE_API_URL}/orders/inbound/items
 * @returns OrderInView[] - 수주 대상 품목 목록
 */
export async function fetchInboundOrderItems(): Promise<OrderInView[]> {
  const response = await axios.get(`${BASE_URL}/orders/inbound/items`);
  return response.data;
}
