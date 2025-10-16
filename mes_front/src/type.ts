// 이미지 정보 타입
export interface OrderItemImage {
  orderItemImgId?: number;     // 이미지 고유 ID
  orderItemId?: number;        // 품목 ID
  img_url: string;             // 이미지 URL
  img_ori_name: string;        // 원본 파일명
  img_name: string;            // 저장 파일명
  file?: File;                 // 신규 업로드 시 사용
}

// 수주 대상 품목 데이터 타입
export interface OrderItems {
  order_item_id: number;
  company_name: string;
  item_code: string;
  item_name: string;
  category: "DEFENSE"|"GENERAL"|"AUTOMOTIVE"|"SHIPBUILDING";
  color?: string;
  unit_price?: number;
  paint_type: "LIQUID" | "POWDER";
  note?: string;
  use_yn: "Y" | "N";
  status: "Y" | "N";
  image?: OrderItemImage[];
  routing?: RoutingFormData[];
}

// 원자재 품목 데이터 타입
export interface RawItems {
  material_item_id: number;
  company_name: string;
  item_code: string;
  item_name: string;
  category: "PAINT"|"THINNER"|"CLEANER"|"HARDENER";
  color: string;
  spec_qty: number;
  spec_unit: string;
  manufacturer: string;
  note: string;
  use_yn: "Y" | "N";
}

export interface Company {
  id: number;
  type: "CUSTOMER" | "PURCHASER";
  name: string;
  ceo: string;
  address: string;
  note: string;
  status: "Y" | "N";
};

export type RoutingCreateData = {
  processCode: string;
  processName: string;
  processTime: string;
  note: string;
};

export type RoutingFormData = RoutingCreateData & {
  routingId: number;
};

export type RoutingFormDataWithProcessNo = RoutingFormData & {
  process_no: number;
};

