// axios: HTTP 요청을 보내기 위한 라이브러리
import axios from "axios";

// Routing 등록 시 사용하는 데이터 타입
import type { RoutingCreateData } from "../../../type";

// .env 파일에서 API 기본 URL을 불러옴 (예: http://localhost:8080)
const BASE_URL = import.meta.env.VITE_API_URL;

// 🟦 라우팅 등록 API
export const registerRouting = async (routingData: RoutingCreateData) => {
  // POST 요청으로 서버에 라우팅 데이터 전송
  const response = await axios.post(`${BASE_URL}/routing`, routingData);

  // 서버에서 반환된 등록된 라우팅 데이터 (RoutingFormData 타입)
  return response.data;
};

// 🟨 라우팅 전체 조회 API
export const fetchRoutings = async () => {
  // GET 요청으로 모든 라우팅 데이터 가져오기
  const response = await axios.get(`${BASE_URL}/routing`);

  // 서버에서 반환된 라우팅 목록 배열
  return response.data;
};

// 🟥 라우팅 삭제 API
export const deleteRouting = async (id: number) => {
  // DELETE 요청으로 특정 ID의 라우팅 삭제
  const response = await axios.delete(`${BASE_URL}/routing/${id}`);

  // 서버에서 반환된 삭제 결과 (성공 여부 또는 메시지)
  return response.data;
};
