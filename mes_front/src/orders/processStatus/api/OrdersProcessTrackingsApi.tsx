import axios from "axios";
import type { OrderProcessTracking } from "../../../type";

// 환경 변수에서 API 서버 주소를 불러옴
const BASE_URL = import.meta.env.VITE_API_URL;

// 공정 진행현황 조회
export async function getOrderProcessTracking(order_inbound_id: number): Promise<OrderProcessTracking[]> {
  const response = await axios.get(`${BASE_URL}/orders/inbound/process/${order_inbound_id}`);
  return response.data;
}

// 공정 강제 시작(시작시간, 상태 업데이트)
export async function updateOrderProcessTracking(order: OrderProcessTracking): Promise<OrderProcessTracking> {
  const response = await axios.put(`${BASE_URL}/orders/inbound/process`, order);
  return response.data;
}

// 공정 진행현황 등록(초기화)
export async function postOrderProcessTracking(order: OrderProcessTracking): Promise<OrderProcessTracking> {
  const response = await axios.post(`${BASE_URL}/orders/inbound/process`, order);
  return response.data;
}



