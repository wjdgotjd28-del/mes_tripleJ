import axios from "axios";
import type { OrderOutbound } from "../../../../type";

const BASE_URL = import.meta.env.VITE_API_URL;

// 수주 출고 등록
export const addOutbound = async (orderOutbound: OrderOutbound): Promise<OrderOutbound> => {
    const response = await axios.post(`${BASE_URL}/orderitem/outbound`, orderOutbound);
    return response.data;
}

// 출고 처리된 수주 목록 조회

// 출고 수정

// 출고 삭제


// 출하증