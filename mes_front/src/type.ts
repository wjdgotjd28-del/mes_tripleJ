// 이미지 정보 타입
export interface ImageData {
  file: File;
  url?: string; // 미리보기 URL
}

// 공정 프로세스 타입
export interface RoutingData {
  step: string;
  description?: string;
  duration?: number; // 소요 시간 (분)
}

// 테이블 데이터 타입
export interface OrderItems {
  id: number; // ViewPage에서만 필요
  company_name: string;
  item_code: string;
  item_name: string;
  category: string;
  color: string;
  unit_price: number;
  paint_type: string;
  note: string;
  use_yn: string;
  status: string;
  image?: ImageData[];      // 다중 이미지
  routing?: RoutingData[];  // 공정 프로세스 배열
}
