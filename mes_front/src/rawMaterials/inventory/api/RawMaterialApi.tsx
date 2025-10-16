// axios: HTTP 요청을 보내기 위한 라이브러리
import axios from "axios";

// 원자재 재고 상태 타입 정의 (응답 데이터 타입)
import type { RawMaterialInventoryStatus } from "../../../type";

// API 기본 경로 설정 (백엔드의 원자재 관련 엔드포인트)
const BASE_URL = "/api/raw-materials";

// 🟦 원자재 재고 조회 API 함수
export async function fetchRawMaterialInventory(): Promise<
  RawMaterialInventoryStatus[]
> {
  // GET 요청을 통해 /api/raw-materials/inventory 경로에서 재고 데이터 가져오기
  const response = await axios.get(`${BASE_URL}/inventory`);

  // 서버에서 반환된 재고 데이터 배열 반환
  return response.data;
}
