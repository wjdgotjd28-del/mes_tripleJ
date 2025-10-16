import axios from "axios";
import type { RoutingCreateData } from "../../../type";

// 환경 변수에서 API 기본 URL을 불러옴
const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * 라우팅 등록 API
 * @param routingData - 등록할 라우팅 정보 (RoutingCreateData 타입)
 * @returns 등록된 라우팅 데이터 (RoutingFormData 타입)
 */
export const registerRouting = async (routingData: RoutingCreateData) => {
  const response = await axios.post(`${BASE_URL}/routing`, routingData);
  return response.data; // 서버에서 반환된 등록된 라우팅 정보
};

/**
 * 라우팅 전체 조회 API
 * @returns 라우팅 목록 배열
 */
export const fetchRoutings = async () => {
  const response = await axios.get(`${BASE_URL}/routing`);
  return response.data; // 서버에서 반환된 라우팅 리스트
};

/**
 * 라우팅 삭제 API
 * @param id - 삭제할 라우팅의 ID
 * @returns 삭제 결과 (성공 시 빈 응답 또는 메시지)
 */
export const deleteRouting = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/routing/${id}`);
  return response.data; // 서버에서 반환된 삭제 결과
};
