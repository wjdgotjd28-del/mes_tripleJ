import axios from "axios";
import type { OrderOutbound } from "../../../type";


const BASE_URL = import.meta.env.VITE_API_URL;

// 새로운 출고 등록
export const addOrderOutbound = async (order: Omit<OrderOutbound, "id">): Promise<OrderOutbound> => {
    const response = await axios.post(`${BASE_URL}/orderitem/outbound`, order);
    return response.data;
};

// 출고 목록 조회 (필요하다면 추가)
export const getOrderOutbound = async (): Promise<OrderOutbound[]> => {
    const response = await axios.get(`${BASE_URL}/orderitem/outbound`);
    return response.data;
};
