import axios from "axios";
import type { OrderItems } from "../../../type";

const BASE_URL = import.meta.env.VITE_API_URL;

// 조회
export const getOrderItems = async (): Promise<OrderItems[]> => {
    const res = await axios.get(
        `${BASE_URL}/items/order`
    );
    console.log("기준정보_수주대상품목_조회 -> ", res);
    return res.data;
};

// 상세조회
export const getOrderItemsdtl = async (id: number): Promise<OrderItems> => {
    const res = await axios.get(
        `${BASE_URL}/items/order/dtl/${id}`
    );
    console.log("기준정보_수주대상품목_조회 -> ", res);
    return res.data;
};

// 작성
export const createOrderItems = async (orderItems: OrderItems) => {
    try {
            const res = await axios.post(
            `${BASE_URL}/items/order/new`,
            orderItems,
        );
        console.log("기준정보_수주대상품목_작성_성공 -> ", res);
        return res.data;
    } catch (err) {
        console.log("기준정보_수주대상품목_작성_실패 -> ", err);
    }
};

// 수정
export const updateOrderItems = async (id: number, orderItems: OrderItems) => {
    try {
            const res = await axios.put(
            `${BASE_URL}/items/order/${id}`,
            orderItems,
        );
        console.log("기준정보_수주대상품목_수정_성공 -> ", res);
        return res.data;
    } catch (err) {
        console.log("기준정보_수주대상품목_수정_실패 -> ", err);
    }
};

// 삭제(soft delete)
export const deleteOrderItems = async (id: number): Promise<number> => {
  const response = await axios.post(
    `${BASE_URL}/items/order/delete/${id}`,
  );
  console.log(response.data);
  return response.data;
};

// 복원(Y ↔ N)
export const restoreOrderItems = async (id: number) => {
  return await axios.post(
    `${BASE_URL}/items/order/${id}`,
  );
};
