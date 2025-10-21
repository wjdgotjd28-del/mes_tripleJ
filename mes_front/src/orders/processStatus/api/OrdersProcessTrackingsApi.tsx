import axios from "axios";
import type { OrderProcessTracking, RoutingFormData } from "../../../type";

// 환경 변수에서 API 서버 주소를 불러옴
const BASE_URL = import.meta.env.VITE_API_URL;

// 공정 진행현황 조회
export async function getOrderProcessTracking(order_inbound_id: number): Promise<OrderProcessTracking[]> {
  const response = await axios.get(`${BASE_URL}/orders/inbound/process/${order_inbound_id}`);
  return response.data;
}

// 공정 강제 시작(시작시간, 상태 업데이트)
export async function updateOrderProcessTrackingBatch(
  inboundId: number,
  processes: OrderProcessTracking[]
): Promise<OrderProcessTracking[]> {
  if (!inboundId || processes.length === 0) return [];

  const payload = processes.map(p => ({
    id: p.id, // 서버에서 ID로 찾도록
    order_inbound_id: p.order_inbound_id,
    order_item_routing_id: p.order_item_routing_id,
    process_status: p.process_status,
    process_start_time: p.process_start_time,
  }));

  const response = await axios.put(`${BASE_URL}/orders/inbound/process/batch`, payload);
  return response.data;
}

// 🔥 공정 진행현황 초기화 (한 번에 등록)
export async function postOrderProcessTrackingBatch(
  inboundId: number,
  routingSteps: RoutingFormData[]
): Promise<OrderProcessTracking[]> {
  if (!inboundId || routingSteps.length === 0) return [];

  // 서버로 보낼 데이터 배열 생성
  const payload: Omit<OrderProcessTracking, "id">[] = routingSteps
    .filter(routing => routing.routing_id != null) // DB에 존재하는 ID만
    .map(() => ({
      order_inbound_id: inboundId,
      process_status: 0,           // 초기 상태: 대기
      process_start_time: null,    // 초기 시작시간: 없음
    }));

  // 한 번에 POST
  const response = await axios.post(`${BASE_URL}/orders/inbound/process`, payload);
  return response.data;
}



