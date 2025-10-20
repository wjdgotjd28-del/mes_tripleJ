import axios from "axios";
import type { Inbound, OrderInbound, OrderInView } from "../../../type";

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

// 수주 출고에서 사용하는 수주 입고 이력 조회
export const getInboundForOut = async (): Promise<Inbound[]> => {
  const response = await axios.get(`${BASE_URL}/orders/inbound/orderoutbound`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return response.data.map((item: any) => ({
    orderInboundId: item.order_inbound_id,
    lotNo: item.lot_no,
    customerName: item.customer_name,
    itemName: item.item_name,
    itemCode: item.item_code,
    qty: item.qty,
    category: item.category,
    inboundDate: item.inbound_date,
    processStatus: item.processStatus,
  }));
};
/**
 * 입고등록 요청
 * - POST {VITE_API_URL}/orders/inbound/items
 * @param data OrderInboundDTO
 */
export async function registerInbound(data: OrderInbound): Promise<void> {
  await axios.post(`${BASE_URL}/orders/inbound/items`, data);
}

