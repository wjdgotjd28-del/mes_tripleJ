import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchInboundHistory = async () => {
  const response = await axios.get(`${BASE_URL}/orders/inbound/history`);

  return response.data;
};

export const deleteInboundHistory = async (id: number) => {
  const response = await axios.delete(
    `${BASE_URL}/orders/inbound/history/${id}`
  );
  return response.data; // 서버에서 반환된 삭제 결과
};
