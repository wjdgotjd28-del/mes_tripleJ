// 이미지 정보 타입
export interface ImageData {
  order_item_img_id?: number; // 이미지 ID (수정 시 사용)
  order_item_id?: number; // 수주 품목 ID
  file?: File; // 신규 업로드 시 사용
  img_url: string; // 파일 경로 (필수)
  img_ori_name: string; // 원본 파일 이름 (필수)
  img_name: string; // 저장된 파일 이름 (필수)
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
