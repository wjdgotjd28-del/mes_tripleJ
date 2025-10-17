import axios from "axios";
import type { OrderOutbound } from "../../../type";


const BASE_URL = import.meta.env.VITE_API_URL;

// 새로운 출고 등록
export const addOrderOutbound = async (order: Omit<OrderOutbound, "id">): Promise<OrderOutbound> => {
    const response = await axios.post(`${BASE_URL}/orderitem/outbound/new`, order);
    return response.data;
};

// 출고된 이력 조회 
export const getOrderOutbound = async (): Promise<OrderOutbound[]> => {
    const response = await axios.get(`${BASE_URL}/orderitem/outbound`);
    return response.data;
};

// 출고된 이력 수정
export const updateOrderOutbound = async (order: OrderOutbound): Promise<OrderOutbound> => {
    const response = await axios.patch(`${BASE_URL}/orderitem/outbound`, order);
    return response.data;
}


