import axios from "axios";
import type { OrderItems } from "../../../type";

const BASE_URL = import.meta.env.VITE_API_URL;

// 조회
export const getOrderItems = async (): Promise<OrderItems[]> => {
    const url = `${BASE_URL}/items/order`
    const res = await axios.get(url);
  return res.data;
};

// 상세조회
export const getOrderItemsdtl = async (id: number): Promise<OrderItems> => {
    const url = `${BASE_URL}/items/order/dtl/${id}`
    const res = await axios.get(url);
    return res.data;
};

// 작성
export const createOrderItems = async (formData: FormData) => {
    const url = `${BASE_URL}/items/order/new`
    const res = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// 수정
export const updateOrderItems = async (id: number, formData: FormData) => {
    const url = `${BASE_URL}/items/order/${id}`
    const res = await axios.put(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// 삭제
export const deleteOrderItems = async (id: number): Promise<number> => {
  const url = `${BASE_URL}/items/order/delete/${id}`;
  const res = await axios.delete(url);
  return res.data;
};

// 복원(Y ↔ N)
export const restoreOrderItems = async (id: number) => {
  const url = `${BASE_URL}/items/order/${id}`;
  console.log("restoreRawItems 호출 URL:", url);
  const res = await axios.post(url, null, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
