import axios from "axios";
import type { RoutingCreateData } from "../../../type";

const BASE_URL = import.meta.env.VITE_API_URL;

export const registerRouting = async (routingData: RoutingCreateData) => {
  const response = await axios.post(`${BASE_URL}/routing`, routingData);
  return response.data; // 이건 RoutingFormData 타입
};

export const fetchRoutings = async () => {
  const response = await axios.get(`${BASE_URL}/routing`);
  return response.data;
};

export const deleteRouting = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/routing/${id}`);
  return response.data;
};
